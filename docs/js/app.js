/**
 * app.js - Lógica interactiva cliente de DevCards AI.
 */

// Estado global de la aplicación
const state = {
  allCards: [],
  filteredCards: [],
  currentIndex: 0,
  isFlipped: false,
  activeCategory: "Todos",
  activeDomain: "all", // "all", "dev", "eng"
  quizFilter: "all",   // "all", "dev", "eng"
  searchQuery: "",
  appMode: "cards", // 'cards', 'hexagonal', 'quiz', 'leitner'
  ratings: {},      // { [cardId]: 1 | 2 | 3 } (Cajas Leitner)
  sessionStudiedCount: 0,
  quiz: {
    cards: [],
    currentIndex: 0,
    score: 0,
    answered: false
  },
  hexLayers: {
    domain: {
      title: "Núcleo de Dominio (Domain Core)",
      tag: "El corazón puro de la lógica de negocio",
      icon: "💎",
      desc: "El Dominio contiene exclusivamente Entidades de Negocio, Objetos de Valor (Value Objects) y Reglas de Negocio Puras. Es completamente agnóstico a la tecnología: NO importa Spring, ni Angular, ni Hibernate, ni SQL. Si cambias de base de datos relacional a MongoDB, o de REST a GraphQL, el Dominio no sufre ni un solo cambio.",
      list: [
        "Entidad CuentaBancaria con método debitar()",
        "Objeto de Valor Dinero(monto, moneda)",
        "Regla: 'No se puede transferir un monto negativo'",
        "Regla de Invarianza: El Dominio NO conoce frameworks ni librerías de transporte"
      ]
    },
    ports: {
      title: "Capa de Puertos (Ports / Interfaces)",
      tag: "Contratos de Entrada y Salida",
      icon: "🔌",
      desc: "Los Puertos son interfaces que definen QUÉ hace el sistema, actuando como la frontera protectora del dominio. Existen dos tipos esenciales:\n\n1. Puertos Primarios (Driving/Inbound): Interfaces de Casos de Uso que los actores externos llaman (ej: RegistrarUsuarioUseCase).\n2. Puertos Secundarios (Driven/Outbound): Interfaces que el dominio requiere para interactuar con la infraestructura (ej: GuardarUsuarioPort, PasarelaPagoPort).",
      list: [
        "Puerto Primario: CrearPedidoUseCase (Inbound)",
        "Puerto Secundario: RepositorioCuentasPort (Outbound)",
        "Puerto Secundario: NotificadorEmailPort (Outbound)",
        "Principio DIP: El Dominio define el puerto; la infraestructura lo implementa"
      ]
    },
    adapters: {
      title: "Capa de Adaptadores (Infraestructura)",
      tag: "Implementaciones Tecnológicas Concretas",
      icon: "⚙️",
      desc: "Los Adaptadores son los encargados de traducir entre el mundo exterior y los puertos del dominio. Si la tecnología cambia, SOLO tocas esta capa:\n\n1. Adaptadores Primarios: Controladores REST, Consolas CLI, listeners de Kafka.\n2. Adaptadores Secundarios: Repositorios de PostgreSQL, clientes de Stripe, envíos de correo SMTP.",
      list: [
        "Adaptador Primario: AuthRestController (Spring Boot / FastAPI)",
        "Adaptador Secundario: PostgresUsuarioRepository (SQL / JPA)",
        "Adaptador Secundario: StripePaymentGatewayAdapter",
        "Aislamiento total: La base de datos es un detalle reemplazable"
      ]
    }
  }
};

// Cargar calificaciones previas de LocalStorage
try {
  const saved = localStorage.getItem("devcards_leitner_ratings");
  if (saved) state.ratings = jsonParseSafe(saved, {});
} catch (e) {
  state.ratings = {};
}

function jsonParseSafe(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

// Inicialización al cargar la ventana
document.addEventListener("DOMContentLoaded", () => {
  fetchStatus();
  fetchCards();
  setupKeyboardShortcuts();
});

// ==============================================================================
// COMUNICACIÓN CON LA API FASTAPI
// ==============================================================================

async function fetchStatus() {
  const dot = document.querySelector(".status-dot");
  const label = document.getElementById("status-label");
  try {
    const res = await fetch("/api/status");
    if (!res.ok) throw new Error("Status endpoint error");
    const data = await res.json();

    if (data.ollama_connected) {
      if (dot) {
        dot.style.background = "#10b981";
        dot.style.boxShadow = "0 0 8px #10b981";
      }
      if (label) label.textContent = "Ollama Local (11434)";
    } else {
      if (dot) {
        dot.style.background = "#38bdf8";
        dot.style.boxShadow = "0 0 8px #38bdf8";
      }
      if (label) label.textContent = "Motor Inteligente (Offline)";
    }
  } catch (e) {
    if (dot) {
      dot.style.background = "#10b981";
      dot.style.boxShadow = "0 0 8px #10b981";
    }
    if (label) label.textContent = "Modo Web Autónomo";
  }
}

async function fetchCards() {
  let loadedFromBackend = false;
  try {
    const res = await fetch("/api/cards");
    if (res.ok) {
      state.allCards = await res.json();
      loadedFromBackend = true;
    }
  } catch (err) {
    // Backend no disponible (modo estático, doble clic o GitHub Pages)
  }

  if (!loadedFromBackend) {
    if (window.DEVCARDS_SEED_DATA && Array.isArray(window.DEVCARDS_SEED_DATA)) {
      state.allCards = [...window.DEVCARDS_SEED_DATA];
    } else {
      console.warn("No se encontró window.DEVCARDS_SEED_DATA");
    }
  }

  // Cargar tarjetas personalizadas guardadas en LocalStorage
  try {
    const custom = JSON.parse(localStorage.getItem("devcards_custom_cards") || "[]");
    if (Array.isArray(custom) && custom.length > 0) {
      const existingIds = new Set(state.allCards.map(c => c.id));
      custom.forEach(card => {
        if (!existingIds.has(card.id)) {
          state.allCards.unshift(card);
        }
      });
    }
  } catch (e) {}

  applyFilters();
  renderCategoryTabs();
  updateLeitnerProgress();

  if (!loadedFromBackend) {
    const label = document.getElementById("status-label");
    if (label) label.textContent = `Modo Autónomo (${state.allCards.length} tarjetas)`;
  }
}

// ==============================================================================
// FILTROS Y CATEGORÍAS
// ==============================================================================


// ==============================================================================
// GESTIÓN DE DOMINIO: PROGRAMACIÓN VS. INGLÉS PROFESIONAL
// ==============================================================================

function selectDomain(domain) {
  state.activeDomain = domain;
  document.querySelectorAll(".domain-pill").forEach(p => p.classList.remove("active"));
  const activeBtn = document.getElementById(`pill-domain-${domain}`);
  if (activeBtn) activeBtn.classList.add("active");

  if (domain === "eng") {
    state.activeCategory = "Inglés (Completo)";
  } else if (domain === "dev") {
    state.activeCategory = "Todos";
  } else {
    state.activeCategory = "Todos";
  }

  state.currentIndex = 0;
  applyFilters();
  renderCategoryTabs();
}

function setQuizFilter(filter) {
  state.quizFilter = filter;
  document.querySelectorAll(".quiz-domain-btn").forEach(btn => btn.classList.remove("active"));
  const b = document.getElementById(`quiz-filter-${filter}`);
  if (b) b.classList.add("active");
  startQuiz();
}

function renderCategoryTabs() {
  const container = document.getElementById("category-tabs-container");
  if (!container) return;

  // Actualizar contadores del selector de dominios
  const allCount = state.allCards.length;
  const engCards = state.allCards.filter(c => c.is_english || (c.category || "").toLowerCase().includes("inglés") || (c.id || "").startsWith("eng-"));
  const engCount = engCards.length;
  const devCount = allCount - engCount;

  const cAll = document.getElementById("count-domain-all");
  if (cAll) cAll.textContent = `(${allCount.toLocaleString()})`;
  const cDev = document.getElementById("count-domain-dev");
  if (cDev) cDev.textContent = `(${devCount.toLocaleString()})`;
  const cEng = document.getElementById("count-domain-eng");
  if (cEng) cEng.textContent = `(${engCount.toLocaleString()})`;

  const counts = {};
  state.allCards.forEach(c => {
    const cat = c.category || "Otros";
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const categoryIcons = {
    "Todos": "🌐",
    "Inglés (Completo)": "🇬🇧",
    "Java (Completo)": "☕",
    "Inteligencia Artificial": "🤖",
    "Python y Backend": "🐍",
    "Bases de Datos y SQL": "🗄️",
    "Angular": "🅰️",
    "TypeScript": "🔷",
    "HTML y Web": "🌐",
    "DevOps y Cloud": "🐳",
    "Seguridad y OWASP": "🛡️",
    "Git y Control de Versiones": "🌿",
    "POO": "📦",
    "Estructuras de Datos": "⛓️",
    "Arquitectura Hexagonal": "⬡",
    "Principios SOLID": "🎯",
    "Patrones de Diseño": "♟️",
    "Algoritmos y Big O": "📈",
    "Inglés: Grammar Refresher": "📖",
    "Inglés: Departamentos y Gobierno": "🏛️",
    "Inglés: Asistencia Social y Beneficios": "🍞",
    "Inglés: Atención al Cliente y Facturación": "🎧",
    "Inglés: Salud y Médico (L2/L3)": "🩺",
    "Inglés: Seguros y Finanzas (L2/L3)": "🛡️",
    "Inglés: Emergencias, 911 y Legal (L2/L3)": "🚨",
    "Inglés: Educación y Academia": "🎓",
    "Inglés: Falsos Amigos & Interpretación": "⚠️"
  };

  const javaCategories = new Set([
    "java core y jvm", "poo avanzada en java", "colecciones y generics",
    "hilos y concurrencia", "sockets avanzados en java", "redes y protocolos tcp/ip",
    "networking y sockets", "java rmi", "acceso a datos y jdbc",
    "java i/o y compresión", "java nio y alta concurrencia", "sistemas distribuidos",
    "corba y rmi-iiop", "persistencia y jpa", "inversión de control y spring",
    "java 8 funcional", "reflexión e introspección", "entrada/salida y serialización"
  ]);
  const javaCount = state.allCards.filter(c => {
    const cat = (c.category || "").toLowerCase();
    const id = (c.id || "").toLowerCase();
    return javaCategories.has(cat) || cat.includes("java") || id.startsWith("java-") || id.startsWith("net-") || id.startsWith("rmi-") || id.startsWith("corba-");
  }).length;

  let categories = [];

  if (state.activeDomain === "eng") {
    // Modo Específico de Inglés Profesional
    categories = [
      { name: "Inglés (Completo)", count: engCount, icon: "🇬🇧", isMateria: true },
      { name: "Inglés: Grammar Refresher", count: counts["Inglés: Grammar Refresher"] || 0, icon: "📖", isMateria: true },
      { name: "Inglés: Departamentos y Gobierno", count: counts["Inglés: Departamentos y Gobierno"] || 0, icon: "🏛️", isMateria: true },
      { name: "Inglés: Asistencia Social y Beneficios", count: counts["Inglés: Asistencia Social y Beneficios"] || 0, icon: "🍞", isMateria: true },
      { name: "Inglés: Atención al Cliente y Facturación", count: counts["Inglés: Atención al Cliente y Facturación"] || 0, icon: "🎧", isMateria: true },
      { name: "Inglés: Salud y Médico (L2/L3)", count: counts["Inglés: Salud y Médico (L2/L3)"] || 0, icon: "🩺", isMateria: true },
      { name: "Inglés: Seguros y Finanzas (L2/L3)", count: counts["Inglés: Seguros y Finanzas (L2/L3)"] || 0, icon: "🛡️", isMateria: true },
      { name: "Inglés: Emergencias, 911 y Legal (L2/L3)", count: counts["Inglés: Emergencias, 911 y Legal (L2/L3)"] || 0, icon: "🚨", isMateria: true },
      { name: "Inglés: Educación y Academia", count: counts["Inglés: Educación y Academia"] || 0, icon: "🎓", isMateria: true },
      { name: "Inglés: Falsos Amigos & Interpretación", count: counts["Inglés: Falsos Amigos & Interpretación"] || 0, icon: "⚠️", isMateria: true }
    ];
  } else if (state.activeDomain === "dev") {
    // Modo Específico de Programación
    categories = [
      { name: "Todos", count: devCount, icon: "🌐", isMateria: true },
      { name: "Java (Completo)", count: javaCount, icon: "☕", isMateria: true },
      { name: "Inteligencia Artificial", count: counts["Inteligencia Artificial"] || 0, icon: "🤖", isMateria: true },
      { name: "Python y Backend", count: counts["Python y Backend"] || 0, icon: "🐍", isMateria: true },
      { name: "Bases de Datos y SQL", count: counts["Bases de Datos y SQL"] || 0, icon: "🗄️", isMateria: true },
      { name: "Angular", count: counts["Angular"] || 0, icon: "🅰️", isMateria: true },
      { name: "TypeScript", count: counts["TypeScript"] || 0, icon: "🔷", isMateria: true },
      { name: "HTML y Web", count: counts["HTML y Web"] || 0, icon: "🌐", isMateria: true },
      { name: "DevOps y Cloud", count: counts["DevOps y Cloud"] || 0, icon: "🐳", isMateria: true },
      { name: "Seguridad y OWASP", count: counts["Seguridad y OWASP"] || 0, icon: "🛡️", isMateria: true },
      { name: "Git y Control de Versiones", count: counts["Git y Control de Versiones"] || 0, icon: "🌿", isMateria: true },
      { name: "POO", count: counts["POO"] || 0, icon: "📦" },
      { name: "Estructuras de Datos", count: counts["Estructuras de Datos"] || 0, icon: "⛓️" },
      { name: "Arquitectura Hexagonal", count: counts["Arquitectura Hexagonal"] || 0, icon: "⬡" },
      { name: "Principios SOLID", count: counts["Principios SOLID"] || 0, icon: "🎯" },
      { name: "Patrones de Diseño", count: counts["Patrones de Diseño"] || 0, icon: "♟️" },
      { name: "Algoritmos y Big O", count: counts["Algoritmos y Big O"] || 0, icon: "📈" }
    ];
  } else {
    // Modo Global (Todos)
    categories = [
      { name: "Todos", count: allCount, icon: "🌐", isMateria: true },
      { name: "Inglés (Completo)", count: engCount, icon: "🇬🇧", isMateria: true },
      { name: "Java (Completo)", count: javaCount, icon: "☕", isMateria: true },
      { name: "Inteligencia Artificial", count: counts["Inteligencia Artificial"] || 0, icon: "🤖", isMateria: true },
      { name: "Python y Backend", count: counts["Python y Backend"] || 0, icon: "🐍", isMateria: true },
      { name: "Bases de Datos y SQL", count: counts["Bases de Datos y SQL"] || 0, icon: "🗄️", isMateria: true },
      { name: "Angular", count: counts["Angular"] || 0, icon: "🅰️", isMateria: true },
      { name: "TypeScript", count: counts["TypeScript"] || 0, icon: "🔷", isMateria: true },
      { name: "HTML y Web", count: counts["HTML y Web"] || 0, icon: "🌐", isMateria: true },
      { name: "DevOps y Cloud", count: counts["DevOps y Cloud"] || 0, icon: "🐳", isMateria: true },
      { name: "Seguridad y OWASP", count: counts["Seguridad y OWASP"] || 0, icon: "🛡️", isMateria: true },
      { name: "Git y Control de Versiones", count: counts["Git y Control de Versiones"] || 0, icon: "🌿", isMateria: true }
    ];

    // Agregar otras categorías con tarjetas
    const existingNames = new Set(categories.map(c => c.name));
    Object.keys(counts).sort().forEach(cat => {
      if (!existingNames.has(cat)) {
        categories.push({
          name: cat,
          count: counts[cat],
          icon: categoryIcons[cat] || "🏷️"
        });
      }
    });
  }

  container.innerHTML = categories.map(cat => `
    <button class="cat-tab ${cat.isMateria ? 'cat-tab-materia' : ''} ${state.activeCategory === cat.name ? 'active' : ''}" onclick="selectCategory('${cat.name}')">
      <span>${cat.icon}</span> ${cat.name} <span style="opacity: 0.6; font-size: 0.72rem;">(${cat.count})</span>
    </button>
  `).join("");
}

function selectCategory(catName) {
  state.activeCategory = catName;
  state.currentIndex = 0;
  applyFilters();
  renderCategoryTabs();
}

function onSearchInput() {
  const input = document.getElementById("search-input");
  state.searchQuery = input.value.toLowerCase().trim();
  state.currentIndex = 0;
  applyFilters();
}

function applyFilters() {
  let list = [...state.allCards];

  // Filtro de Dominio de Alto Nivel
  if (state.activeDomain === "dev") {
    list = list.filter(c => !c.is_english && !(c.category || "").toLowerCase().includes("inglés") && !(c.id || "").startsWith("eng-"));
  } else if (state.activeDomain === "eng") {
    list = list.filter(c => c.is_english || (c.category || "").toLowerCase().includes("inglés") || (c.id || "").startsWith("eng-"));
  }

  const catActive = (state.activeCategory || "").toLowerCase();

  if (catActive === "inglés (completo)" || catActive === "ingles (completo)" || catActive === "inglés" || catActive === "ingles" || catActive === "english") {
    list = list.filter(c => c.is_english || (c.category || "").toLowerCase().includes("inglés") || (c.id || "").startsWith("eng-"));
  } else

  if (catActive === "java (completo)" || catActive === "java") {
    const javaCategories = new Set([
      "java core y jvm", "poo avanzada en java", "colecciones y generics",
      "hilos y concurrencia", "sockets avanzados en java", "redes y protocolos tcp/ip",
      "networking y sockets", "java rmi", "acceso a datos y jdbc",
      "java i/o y compresión", "java nio y alta concurrencia", "sistemas distribuidos",
      "corba y rmi-iiop", "persistencia y jpa", "inversión de control y spring",
      "java 8 funcional", "reflexión e introspección", "entrada/salida y serialización"
    ]);
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return javaCategories.has(cat) || cat.includes("java") || id.startsWith("java-") || id.startsWith("net-") || id.startsWith("rmi-") || id.startsWith("corba-");
    });
  } else if (catActive === "inteligencia artificial" || catActive === "ia" || catActive === "ia (inteligencia artificial)") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "inteligencia artificial" || cat.includes("ia") || id.startsWith("ia-");
    });
  } else if (catActive === "angular") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "angular" || id.startsWith("ng-");
    });
  } else if (catActive === "typescript" || catActive === "ts") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "typescript" || id.startsWith("ts-");
    });
  } else if (catActive === "html y web" || catActive === "html") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "html y web" || cat === "html" || id.startsWith("html-");
    });
  } else if (catActive === "python y backend" || catActive === "python" || catActive === "py") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "python y backend" || id.startsWith("py-");
    });
  } else if (catActive === "bases de datos y sql" || catActive === "bases de datos" || catActive === "sql" || catActive === "db") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "bases de datos y sql" || id.startsWith("db-");
    });
  } else if (catActive === "devops y cloud" || catActive === "devops" || catActive === "docker" || catActive === "cloud") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "devops y cloud" || id.startsWith("ops-");
    });
  } else if (catActive === "seguridad y owasp" || catActive === "seguridad" || catActive === "owasp" || catActive === "security") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "seguridad y owasp" || id.startsWith("sec-");
    });
  } else if (catActive === "git y control de versiones" || catActive === "git" || catActive === "control de versiones") {
    list = list.filter(c => {
      const cat = (c.category || "").toLowerCase();
      const id = (c.id || "").toLowerCase();
      return cat === "git y control de versiones" || id.startsWith("git-");
    });
  } else if (catActive !== "todos") {
    list = list.filter(c => (c.category || "").toLowerCase() === catActive);
  }

  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(c => 
      (c.title || "").toLowerCase().includes(q) ||
      (c.question || "").toLowerCase().includes(q) ||
      (c.definition || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q) ||
      (c.key_takeaway || "").toLowerCase().includes(q) ||
      (c.code_example || "").toLowerCase().includes(q)
    );
  }

  state.filteredCards = list;
  renderCurrentCard();
}

// ==============================================================================
// RENDERIZADO Y NAVEGACIÓN DE FLASHCARDS
// ==============================================================================

function renderCurrentCard() {
  const cardElem = document.getElementById("main-flip-card");
  if (!cardElem) return;

  // Si no hay resultados
  if (state.filteredCards.length === 0) {
    document.getElementById("card-front-title").textContent = "Sin resultados";
    document.getElementById("card-front-question").textContent = "No se encontraron conceptos para la búsqueda actual.";
    document.getElementById("card-front-icon").textContent = "🔍";
    document.getElementById("current-card-idx").textContent = "0 / 0";
    document.getElementById("study-progress-fill").style.width = "0%";
    return;
  }

  // Asegurar índice válido
  if (state.currentIndex >= state.filteredCards.length) {
    state.currentIndex = 0;
  } else if (state.currentIndex < 0) {
    state.currentIndex = state.filteredCards.length - 1;
  }

  const c = state.filteredCards[state.currentIndex];
  state.isFlipped = false;
  cardElem.classList.remove("flipped");

  const isEnglishCard = Boolean(c.is_english || (c.category || "").toLowerCase().includes("inglés") || (c.id || "").startsWith("eng-"));

  // Actualizar Anverso
  const frontCat = document.getElementById("card-front-cat");
  if (frontCat) {
    frontCat.textContent = c.category || "General";
    frontCat.classList.toggle("badge-english", isEnglishCard);
  }
  document.getElementById("card-front-diff").textContent = c.difficulty || "Intermedio";
  document.getElementById("card-front-icon").textContent = c.icon || (isEnglishCard ? "🗣️" : "💡");
  document.getElementById("card-front-title").textContent = c.title;
  document.getElementById("card-front-question").textContent = c.question;

  // Actualizar Reverso
  const backCat = document.getElementById("card-back-cat");
  if (backCat) {
    backCat.textContent = c.category || "General";
    backCat.classList.toggle("badge-english", isEnglishCard);
  }

  // Título dinámico según dominio
  const backTitle = document.getElementById("card-back-title");
  if (backTitle) {
    backTitle.textContent = isEnglishCard ? "Significado, Traducción & Guión de Uso" : "Definición & Comprensión";
  }

  const defTitle = document.getElementById("card-back-def-title");
  if (defTitle) {
    defTitle.innerHTML = isEnglishCard ? "📖 Significado & Equivalente en Español" : "📖 Definición Técnica";
  }

  const analogyTitle = document.getElementById("card-back-analogy-title");
  if (analogyTitle) {
    analogyTitle.innerHTML = isEnglishCard ? "🌟 Contexto de Interpretación & Registro Profesional" : "🌟 Analogía de la Vida Real (Para Nunca Olvidarlo)";
  }

  const codeBoxTitle = document.getElementById("code-box-header-title");
  if (codeBoxTitle) {
    codeBoxTitle.innerHTML = isEnglishCard ? "🗣️ Diálogo en Contexto Real / Guión de Interpretación" : "💻 Código Canónico Demostrativo";
  }

  const takeawayLabel = document.getElementById("takeaway-label");
  if (takeawayLabel) {
    takeawayLabel.innerHTML = isEnglishCard ? "💡 <b>Tip de Interpretación:</b>" : "💡 <b>Regla de Oro:</b>";
  }

  document.getElementById("card-back-definition").textContent = c.definition;
  document.getElementById("card-back-analogy").textContent = c.analogy;
  document.getElementById("card-back-code").textContent = c.code_example || (isEnglishCard ? "# Guión en preparación" : "# Sin código necesario");
  document.getElementById("takeaway-text").textContent = c.key_takeaway || (isEnglishCard ? "Mantén la precisión terminológica en interpretación." : "Practica este concepto con frecuencia.");

  // Actualizar barra de progreso
  const total = state.filteredCards.length;
  const current = state.currentIndex + 1;
  document.getElementById("current-card-idx").textContent = `${current} / ${total}`;
  const pct = Math.round((current / total) * 100);
  document.getElementById("study-progress-fill").style.width = `${pct}%`;
}

function toggleCardFlip() {
  const cardElem = document.getElementById("main-flip-card");
  state.isFlipped = !state.isFlipped;
  cardElem.classList.toggle("flipped", state.isFlipped);
}

function nextCard() {
  if (state.filteredCards.length <= 1) return;
  state.currentIndex = (state.currentIndex + 1) % state.filteredCards.length;
  renderCurrentCard();
}

function prevCard() {
  if (state.filteredCards.length <= 1) return;
  state.currentIndex = (state.currentIndex - 1 + state.filteredCards.length) % state.filteredCards.length;
  renderCurrentCard();
}

// ==============================================================================
// SISTEMA DE REPASO ESPACIADO LEITNER
// ==============================================================================

function rateCard(rating) {
  if (state.filteredCards.length === 0) return;
  const c = state.filteredCards[state.currentIndex];

  let box = 1;
  if (rating === "facil") box = 3;
  else if (rating === "dudoso") box = 2;
  else box = 1;

  state.ratings[c.id] = box;
  localStorage.setItem("devcards_leitner_ratings", JSON.stringify(state.ratings));

  state.sessionStudiedCount++;

  // Sincronizar asíncronamente con backend
  fetch(`/api/cards/${c.id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ box, rating })
  }).catch(() => {});

  updateLeitnerProgress();
  updateStreakAndMetrics();
  nextCard();
}

function updateStreakAndMetrics() {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem("devcards_last_date");
  let streak = parseInt(localStorage.getItem("devcards_streak") || "1", 10);

  if (lastDate && lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) {
      streak += 1;
    } else {
      streak = 1;
    }
  }
  localStorage.setItem("devcards_last_date", today);
  localStorage.setItem("devcards_streak", streak.toString());

  const streakEl = document.getElementById("streak-counter");
  if (streakEl) streakEl.textContent = `🔥 ${streak} día${streak > 1 ? 's' : ''}`;

  const total = state.allCards.length || 1;
  let inBox3 = 0;
  state.allCards.forEach(c => {
    if (state.ratings[c.id] === 3) inBox3++;
  });
  const percent = Math.round((inBox3 / total) * 100);
  const masteryEl = document.getElementById("mastery-counter");
  if (masteryEl) masteryEl.textContent = `📈 ${percent}%`;

  const sessionEl = document.getElementById("session-counter");
  if (sessionEl) sessionEl.textContent = `🎯 ${state.sessionStudiedCount} leídas`;
}

// ==============================================================================
// EXPORTACIÓN E IMPORTACIÓN DE MAZO (RF-11)
// ==============================================================================

function exportDeck() {
  const cardsToExport = (state.allCards && state.allCards.length > 0) 
    ? state.allCards 
    : (window.DEVCARDS_SEED_DATA || []);
  
  if (cardsToExport.length === 0) {
    alert("No hay tarjetas para exportar.");
    return;
  }

  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cardsToExport, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `devcards_deck_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (e) {
    window.location.href = "/api/export";
  }
}

function triggerImport() {
  const fileInput = document.getElementById("file-import-input");
  if (fileInput) fileInput.click();
}

async function handleImportFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const cardsToAdd = Array.isArray(data) ? data : (data.cards || []);
    if (!cardsToAdd.length) throw new Error("El archivo no contiene un arreglo de tarjetas válido.");

    let backendSuccess = false;
    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        alert(`¡Éxito! Se importaron ${result.added_count} tarjetas al servidor. Total en mazo: ${result.total_cards}`);
        backendSuccess = true;
        await fetchCards();
      }
    } catch (e) {
      // Backend inaccesible, proceder localmente
    }

    if (!backendSuccess) {
      const existingIds = new Set(state.allCards.map(c => c.id));
      let added = 0;
      const customCards = JSON.parse(localStorage.getItem("devcards_custom_cards") || "[]");
      
      for (const card of cardsToAdd) {
        if (!existingIds.has(card.id)) {
          state.allCards.unshift(card);
          customCards.push(card);
          added++;
        }
      }
      localStorage.setItem("devcards_custom_cards", JSON.stringify(customCards));
      alert(`¡Éxito en modo autónomo! Se importaron ${added} tarjetas nuevas al mazo local. Total disponible: ${state.allCards.length}`);
      applyFilters();
      renderCategoryTabs();
      updateLeitnerProgress();
    }
  } catch (err) {
    alert("Error al importar el archivo JSON: " + err.message);
  } finally {
    event.target.value = "";
  }
}

function updateLeitnerProgress() {
  const box1List = document.getElementById("list-box-1");
  const box2List = document.getElementById("list-box-2");
  const box3List = document.getElementById("list-box-3");
  if (!box1List) return;

  const b1 = [];
  const b2 = [];
  const b3 = [];

  state.allCards.forEach(c => {
    const box = state.ratings[c.id] || 1;
    const itemHtml = `
      <div class="box-card-item">
        <span>${c.icon || '💡'} <b>${c.title}</b></span>
        <span style="opacity: 0.6; font-size: 0.72rem;">${c.category}</span>
      </div>
    `;
    if (box === 3) b3.push(itemHtml);
    else if (box === 2) b2.push(itemHtml);
    else b1.push(itemHtml);
  });

  document.getElementById("count-box-1").textContent = b1.length;
  document.getElementById("count-box-2").textContent = b2.length;
  document.getElementById("count-box-3").textContent = b3.length;

  box1List.innerHTML = b1.join("");
  box2List.innerHTML = b2.join("");
  box3List.innerHTML = b3.join("");
}

// ==============================================================================
// CAMBIO DE MODOS DE LA APLICACIÓN
// ==============================================================================

function setAppMode(mode) {
  state.appMode = mode;

  // Actualizar botones de navegación
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`btn-mode-${mode}`).classList.add("active");

  // Actualizar secciones visibles
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(`section-${mode}`).classList.add("active");

  if (mode === "quiz") {
    startQuiz();
  } else if (mode === "leitner") {
    updateLeitnerProgress();
  }
}

// ==============================================================================
// VISUALIZADOR DE ARQUITECTURA HEXAGONAL
// ==============================================================================

function selectHexLayer(layerId) {
  const info = state.hexLayers[layerId];
  if (!info) return;

  document.getElementById("hex-info-icon").textContent = info.icon;
  document.getElementById("hex-info-title").textContent = info.title;
  document.getElementById("hex-info-tag").textContent = info.tag;
  document.getElementById("hex-info-desc").innerText = info.desc;

  const listElem = document.getElementById("hex-info-list");
  listElem.innerHTML = info.list.map(item => `<li>${item}</li>`).join("");
}

// ==============================================================================
// MODO QUIZ
// ==============================================================================

function startQuiz() {
  let pool = state.allCards.filter(c => c.quiz_question && c.quiz_options && c.quiz_options.length > 0);

  if (state.quizFilter === "dev") {
    pool = pool.filter(c => !c.is_english && !(c.category || "").toLowerCase().includes("inglés") && !(c.id || "").startsWith("eng-"));
  } else if (state.quizFilter === "eng") {
    pool = pool.filter(c => c.is_english || (c.category || "").toLowerCase().includes("inglés") || (c.id || "").startsWith("eng-"));
  }

  state.quiz.cards = pool;
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.answered = false;

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qState = state.quiz;
  const q = qState.cards[qState.currentIndex];

  if (!q) {
    document.getElementById("quiz-question-text").textContent = `¡Quiz completado! Puntuación final: ${qState.score} / ${qState.cards.length}`;
    document.getElementById("quiz-options-container").innerHTML = "";
    document.getElementById("quiz-feedback").style.display = "none";
    return;
  }

  qState.answered = false;
  document.getElementById("quiz-cat").textContent = q.category || "Quiz";
  document.getElementById("quiz-score").textContent = qState.score;
  document.getElementById("quiz-total").textContent = qState.cards.length;
  document.getElementById("quiz-question-text").textContent = q.quiz_question;
  document.getElementById("quiz-feedback").style.display = "none";

  const optionsContainer = document.getElementById("quiz-options-container");
  optionsContainer.innerHTML = q.quiz_options.map((opt, idx) => `
    <button class="quiz-opt-btn" onclick="answerQuiz(${idx})">
      <span>${String.fromCharCode(65 + idx)})</span> ${opt}
    </button>
  `).join("");
}

function answerQuiz(selectedIdx) {
  const qState = state.quiz;
  if (qState.answered) return;
  qState.answered = true;

  const q = qState.cards[qState.currentIndex];
  const buttons = document.querySelectorAll(".quiz-opt-btn");

  const correct = selectedIdx === q.quiz_answer;
  if (correct) qState.score++;

  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.quiz_answer) {
      btn.classList.add("correct");
    } else if (idx === selectedIdx && !correct) {
      btn.classList.add("incorrect");
    }
  });

  const feedback = document.getElementById("quiz-feedback");
  const fbText = document.getElementById("quiz-feedback-text");
  feedback.style.display = "flex";
  fbText.innerHTML = correct 
    ? "🎉 <b>¡Correcto!</b> " + (q.key_takeaway || "")
    : `❌ <b>Incorrecto.</b> La respuesta correcta era la ${String.fromCharCode(65 + q.quiz_answer)}.`;
  
  document.getElementById("quiz-score").textContent = qState.score;
}

function nextQuizQuestion() {
  state.quiz.currentIndex++;
  renderQuizQuestion();
}

// ==============================================================================
// SÍNTESIS DE VOZ Y COPIADO
// ==============================================================================

function speakCurrentCard() {
  if (!('speechSynthesis' in window)) {
    alert("Tu navegador no soporta síntesis de voz nativa.");
    return;
  }

  window.speechSynthesis.cancel();
  if (state.filteredCards.length === 0) return;
  const c = state.filteredCards[state.currentIndex];

  const textToRead = state.isFlipped
    ? `${c.title}. Definición: ${c.definition}. Analogía: ${c.analogy}`
    : `${c.title}. Pregunta: ${c.question}`;

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = "es-ES";
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

function copyCodeSnippet() {
  const code = document.getElementById("card-back-code").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".btn-copy");
    const prev = btn.textContent;
    btn.textContent = "✓ ¡Copiado!";
    setTimeout(() => btn.textContent = prev, 1500);
  });
}

// ==============================================================================
// MODAL: GENERACIÓN CON IA
// ==============================================================================

function openCreateModal() {
  document.getElementById("modal-create").style.display = "flex";
  document.getElementById("ai-topic-input").focus();
}

function closeCreateModal() {
  document.getElementById("modal-create").style.display = "none";
}

async function submitAIGeneration() {
  const topicInput = document.getElementById("ai-topic-input");
  const topic = topicInput.value.trim();
  if (!topic) {
    alert("Por favor escribe un tema o concepto.");
    return;
  }

  const category = document.getElementById("ai-category-select").value;
  const level = document.getElementById("ai-level-select").value;
  const btn = document.getElementById("btn-generate-ai");
  const note = document.getElementById("ai-modal-note");

  btn.disabled = true;
  btn.textContent = "⏳ Generando con IA...";
  note.textContent = "🧠 Invocando al modelo de IA y estructurando tarjeta...";

  try {
    const res = await fetch("/api/generate-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, category, level })
    });

    if (!res.ok) throw new Error("Falla en la generación con IA");
    const newCard = await res.json();

    // Incorporar al mazo
    state.allCards.unshift(newCard);
    state.activeCategory = "Todos";
    state.searchQuery = "";
    document.getElementById("search-input").value = "";
    
    applyFilters();
    renderCategoryTabs();
    closeCreateModal();
    topicInput.value = "";

    alert(`¡Tarjeta sobre '${newCard.title}' generada exitosamente con IA!`);
  } catch (err) {
    // Generación offline / modo autónomo cliente
    const fallbackCard = {
      id: "card-" + Date.now(),
      title: topic,
      category: category,
      difficulty: level,
      icon: "⚡",
      question: `¿Qué es y cómo se aplica ${topic}?`,
      definition: `${topic} es un concepto clave en el dominio de ${category} para diseñar sistemas desacoplados, robustos y mantenibles.`,
      analogy: `Imagina ${topic} como una pieza estándar de ingeniería: define reglas claras para que cualquier desarrollador entienda su rol sin necesidad de descifrar detalles internos.`,
      code_example: `// Ejemplo conceptual de ${topic}\nclass ${topic.replace(/[^a-zA-Z0-9]/g, '')}Service {\n  execute() {\n    console.log("Aplicando ${topic} exitosamente.");\n  }\n}`,
      quiz_question: `¿Cuál es el beneficio primordial de implementar ${topic}?`,
      quiz_options: [
        "Mejora la modularidad, cohesión y mantenibilidad a largo plazo",
        "Aumenta el acoplamiento y la complejidad ciclomática",
        "Elimina por completo la necesidad de pruebas unitarias",
        "Obliga a reescribir todo el sistema en un solo archivo"
      ],
      quiz_answer: 0,
      key_takeaway: `${topic}: Domina su propósito para elevar la calidad de tu código y superar entrevistas técnicas.`
    };

    state.allCards.unshift(fallbackCard);

    // Persistir tarjeta personalizada localmente
    try {
      const customCards = JSON.parse(localStorage.getItem("devcards_custom_cards") || "[]");
      customCards.unshift(fallbackCard);
      localStorage.setItem("devcards_custom_cards", JSON.stringify(customCards));
    } catch (e) {}

    state.activeCategory = "Todos";
    state.searchQuery = "";
    document.getElementById("search-input").value = "";

    applyFilters();
    renderCategoryTabs();
    closeCreateModal();
    topicInput.value = "";

    alert(`¡Tarjeta sobre '${topic}' creada exitosamente en Modo Web Autónomo!

Nota: Para generación de modelos profundos vía LLM local (Ollama / Llama 3.2), ejecuta el servidor con 'iniciar_devcards.bat'.`);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "<span>⚡</span> Generar Tarjeta";
    note.textContent = "🤖 Conectado al motor de Inteligencia Artificial (Ollama Local / Asistente Semántico).";
  }
}

// ==============================================================================
// ATAJOS DE TECLADO
// ==============================================================================

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    // Si el usuario está escribiendo en un input, ignorar atajos
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.code === "Space") {
      e.preventDefault();
      if (state.appMode === "cards") toggleCardFlip();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      if (state.appMode === "cards") nextCard();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      if (state.appMode === "cards") prevCard();
    } else if (e.key === "1") {
      if (state.appMode === "cards") rateCard("dificil");
    } else if (e.key === "2") {
      if (state.appMode === "cards") rateCard("dudoso");
    } else if (e.key === "3") {
      if (state.appMode === "cards") rateCard("facil");
    }
  });
}
