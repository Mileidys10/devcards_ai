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
  try {
    const res = await fetch("/api/status");
    if (!res.ok) return;
    const data = await res.json();
    const dot = document.querySelector(".status-dot");
    const label = document.getElementById("status-label");

    if (data.ollama_connected) {
      dot.style.background = "#10b981";
      dot.style.boxShadow = "0 0 8px #10b981";
      label.textContent = "Ollama Local (11434)";
    } else {
      dot.style.background = "#38bdf8";
      dot.style.boxShadow = "0 0 8px #38bdf8";
      label.textContent = "Motor Inteligente (Offline)";
    }
  } catch (e) {
    document.getElementById("status-label").textContent = "Modo Local Autónomo";
  }
}

async function fetchCards() {
  try {
    const res = await fetch("/api/cards");
    if (!res.ok) throw new Error("Falla al cargar tarjetas");
    state.allCards = await res.json();
    applyFilters();
    renderCategoryTabs();
    updateLeitnerProgress();
  } catch (err) {
    console.error("Error al cargar tarjetas:", err);
  }
}

// ==============================================================================
// FILTROS Y CATEGORÍAS
// ==============================================================================

function renderCategoryTabs() {
  const container = document.getElementById("category-tabs-container");
  if (!container) return;

  const counts = {};
  state.allCards.forEach(c => {
    const cat = c.category || "Otros";
    counts[cat] = (counts[cat] || 0) + 1;
  });

    // Categorias dinamicas generadas a partir de las tarjetas reales
  const categoryIcons = {
    "Todos": "🌐",
    "POO": "📦",
    "Estructuras de Datos": "⛓️",
    "Arquitectura Hexagonal": "⬡",
    "Principios SOLID": "🎯",
    "Patrones de Diseño": "♟️",
    "Algoritmos y Big O": "📈",
    "Redes y Protocolos TCP/IP": "🌐",
    "Sockets Avanzados en Java": "🔌",
    "Java NIO y Alta Concurrencia": "⚡",
    "Sistemas Distribuidos": "🌍",
    "CORBA y RMI-IIOP": "🏛️",
    "Java I/O y Compresión": "💾",
    "Java Core y JVM": "☕",
    "POO Avanzada en Java": "💎",
    "Colecciones y Generics": "📚",
    "Hilos y Concurrencia": "⚡",
    "Entrada/Salida y Serialización": "💾",
    "Networking y Sockets": "🔌",
    "Java RMI": "📡",
    "Acceso a Datos y JDBC": "🗄️",
    "Reflexión e Introspección": "🔍",
    "Persistencia y JPA": "🏛️",
    "Inversión de Control y Spring": "🌱",
    "Java 8 Funcional": "λ"
  };

  const categories = [{ name: "Todos", count: state.allCards.length, icon: "🌐" }];
  
  // Orden prioritario sugerido
  const order = [
    "Java Core y JVM",
    "POO Avanzada en Java",
    "Colecciones y Generics",
    "Hilos y Concurrencia",
    "Networking y Sockets",
    "Java RMI",
    "Acceso a Datos y JDBC",
    "Entrada/Salida y Serialización",
    "Reflexión e Introspección",
    "Persistencia y JPA",
    "Inversión de Control y Spring",
    "Java 8 Funcional",
    "POO",
    "Estructuras de Datos",
    "Arquitectura Hexagonal",
    "Principios SOLID",
    "Patrones de Diseño",
    "Algoritmos y Big O"
  ];

  const added = new Set(["Todos"]);
  order.forEach(cat => {
    if (counts[cat]) {
      categories.push({
        name: cat,
        count: counts[cat],
        icon: categoryIcons[cat] || "🏷️"
      });
      added.add(cat);
    }
  });

  // Cualquier otra categoria adicional
  Object.keys(counts).sort().forEach(cat => {
    if (!added.has(cat)) {
      categories.push({
        name: cat,
        count: counts[cat],
        icon: categoryIcons[cat] || "🏷️"
      });
    }
  });

  container.innerHTML = categories.map(cat => `
    <button class="cat-tab ${state.activeCategory === cat.name ? 'active' : ''}" onclick="selectCategory('${cat.name}')">
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

  if (state.activeCategory !== "Todos") {
    list = list.filter(c => (c.category || "").toLowerCase() === state.activeCategory.toLowerCase());
  }

  if (state.searchQuery) {
    const q = state.searchQuery;
    list = list.filter(c => 
      (c.title || "").toLowerCase().includes(q) ||
      (c.question || "").toLowerCase().includes(q) ||
      (c.definition || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q)
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

  // Actualizar Anverso
  document.getElementById("card-front-cat").textContent = c.category || "General";
  document.getElementById("card-front-diff").textContent = c.difficulty || "Intermedio";
  document.getElementById("card-front-icon").textContent = c.icon || "💡";
  document.getElementById("card-front-title").textContent = c.title;
  document.getElementById("card-front-question").textContent = c.question;

  // Actualizar Reverso
  document.getElementById("card-back-cat").textContent = c.category || "General";
  document.getElementById("card-back-title").textContent = c.title;
  document.getElementById("card-back-definition").textContent = c.definition;
  document.getElementById("card-back-analogy").textContent = c.analogy;
  document.getElementById("card-back-code").textContent = c.code_example || "# Sin código necesario";
  document.getElementById("takeaway-text").textContent = c.key_takeaway || "Practica este concepto con frecuencia.";

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
  window.location.href = "/api/export";
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
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Error en el servidor al importar");
    const result = await res.json();
    alert(`¡Éxito! Se importaron ${result.added_count} tarjetas nuevas. Total en mazo: ${result.total_cards}`);
    await fetchCards();
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
  state.quiz.cards = state.allCards.filter(c => c.quiz_question && c.quiz_options && c.quiz_options.length > 0);
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
    alert("Error al generar la tarjeta con IA: " + err.message);
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
