# 🧠 DevCards AI &mdash; Plataforma de Repaso Conceptual y Arquitectura con IA

> **Proyecto Oficial de la Fábrica de Software Agéntica OKF v0.2**  
> Identificador OKF: `urn:factory:project:devcards_ai`  
> Roles: `FullStackEngineer`, `AIIntegrationSpecialist`, `SoftwareFactoryArchitect`

---

## 🌟 ¿Qué es DevCards AI?

**DevCards AI** es una plataforma web interactiva de alto rendimiento visual diseñada para desarrolladores que desean dominar, recordar y clarificar conceptos fundamentales de programación y arquitectura de software que frecuentemente se olvidan o malinterpretan.

Utiliza el método científico de **Repetición Espaciada de Leitner**, explicaciones basadas en **analogías cotidianas**, visualizaciones arquitectónicas interactivas y asistencia de **IA local con Ollama** (o generador sintético experto fuera de línea).

---

## 🎯 Conceptos Clave Cubiertos (284+ Tarjetas Pedagógicas en 10 Materias)

La plataforma cuenta con un mazo enciclopédico y categorizado de **más de 284 tarjetas pedagógicas** organizadas en 10 materias de vanguardia con filtros reactivos dedicados:

1. **🤖 Inteligencia Artificial (IA)**:
   - *LLMs y Parámetros*: Matrices de pesos, arquitectura Transformer, pre-entrenamiento vs inferencia.
   - *Vector Embeddings & Espacio Semántico*: Similitud coseno, búsqueda vectorial, modelos de embedding.
   - *RAG (Retrieval-Augmented Generation)*: Conexión con bases de conocimiento privadas, grounding y fuentes.
   - *Bases Vectoriales & HNSW*: Grafos jerárquicos de proximidad y búsqueda aproximada O(log N).
   - *Self-Attention & Transformers*: Matrices Query (Q), Key (K), Value (V), procesamiento paralelo.
   - *Agentes Autónomos & Patrón ReAct*: Thought, Action, Observation, invocación iterativa de herramientas.
   - *Fine-Tuning con LoRA*: Adaptación de bajo rango con matrices delta B*A y reducción drástica de VRAM.
   - *Protocolo MCP (Model Context Protocol)*: Estandarización de Tools, Resources y Prompts para LLMs.
   - *Prompt Engineering*: Zero-Shot, Few-Shot demostrativo y Chain-of-Thought (pensar paso a paso).
   - *Tokenización, BPE y Ventana de Contexto*: Fragmentos atómicos, tarificación y memoria de atención.
   - *Hiperparámetros de Muestreo*: Temperatura (determinismo vs creatividad) y Top-P (Nucleus Sampling).
   - *Function Calling & Tool Use*: Esquemas JSON Schema, estructuración y delegación de ejecución al backend.
   - *Alucinaciones & Grounding*: Causas probabilísticas, mitigación y verificación con fuentes.
   - *Alineación con RLHF y DPO*: Modelos de recompensa, utilidad, honestidad y seguridad inofensiva.
   - *Redes Neuronales & Backpropagation*: Forward pass, cálculo de pérdida y regla de la cadena.
   - *Modelos Multimodales Nativos*: Espacio latente unificado para texto, visión, audio y video.

2. **🅰️ Angular (Framework Web Moderno)**:
   - *Signals*: Reactividad atómica granular con `signal()`, `computed()` perezoso y `effect()`.
   - *Standalone Components*: Arquitectura autosuficiente sin NgModules con imports directos.
   - *Nuevo Control Flow*: Bloques declarativos `@if`, `@else`, `@switch` y `@for` con `track` obligatorio.
   - *Inyección de Dependencias Moderna*: Función `inject()` en contexto de inicialización sin super().
   - *Estrategias de Change Detection*: `OnPush` reactivo y el nuevo modo experimental `Zoneless`.
   - *Angular Router*: Lazy loading por componente (`loadComponent`) y Functional Guards declarativos.
   - *RxJS & Gestión de Ciclo de Vida*: Operadores reactivos, Subjects y prevención de memory leaks con `takeUntilDestroyed()`.
   - *HttpClient & Functional Interceptors*: Intercepción centralizada de tokens JWT y errores con `HttpInterceptorFn`.
   - *Directivas & Host Directives*: Directivas de atributo y composición de comportamientos sin herencia.
   - *Pipes Puros vs Impuros*: Transformación idempotente con memoización y `AsyncPipe`.
   - *Signal Queries*: `viewChild()`, `viewChildren()` y `contentChildren()` reactivos.
   - *Strictly Typed Reactive Forms*: `FormGroup` y `FormControl` fuertemente tipados en compilación.
   - *Ciclo de Vida*: Diferencia entre `ngOnInit` (lógica de datos) y `afterNextRender` (DOM seguro en SSR).
   - *Input y Output Signals*: `input()`, `input.required()` y `output()` nativos.
   - *Deferrable Views (`@defer`)*: Carga diferida con triggers (`on viewport`, `interaction`, `@placeholder`, `@loading`).
   - *Hydration & SSR*: Hidratación no destructiva con preservación de DOM para Core Web Vitals.

3. **🔷 TypeScript (Tipado Estricto)**:
   - *Interfaces vs Type Aliases*: Declaration Merging en interfaces vs versatilidad de tipos y uniones.
   - *Generics & Restricciones*: Parametrización con `<T extends Restriccion>` y preservación de tipos.
   - *Union (|) vs Intersection (&)*: Alternativas válidas vs conjunción estricta de contratos.
   - *Type Narrowing & Discriminant Unions*: Estrechamiento con guardas `typeof`/`instanceof` y propiedades literales.
   - *Utility Types Básicos*: `Partial<T>`, `Required<T>`, `Readonly<T>`.
   - *Utility Types de Selección*: `Pick<T, K>`, `Omit<T, K>`, `Record<K, T>`.
   - *Operadores de Compilación*: `keyof` (extracción de claves) y `typeof` (inferencia desde objetos existentes).
   - *Jerarquía de Tipos*: `unknown` (top-type seguro), `any` (inseguro) y `never` (estado imposible/exhaustividad).
   - *Mapped Types*: Transformación sistemática de propiedades con `[P in keyof T]`.
   - *Const Assertions (`as const`)*: Sellado de tipos literales y tuplas de solo lectura sin widening.
   - *Conditional Types & infer*: Lógica ternaria en tipos y deducción de tipos anidados con `infer`.
   - *Enums vs Const Objects*: Por qué la comunidad moderna prefiere objetos con `as const`.
   - *Operadores Seguros*: Non-Null assertion (`!`) vs Optional Chaining (`?.`) y Coalescencia Nula (`??`).
   - *Configuración tsconfig*: Modo `strict: true`, `strictNullChecks` y `noImplicitAny`.
   - *Template Literal Types*: Tipado dinámico de nombres de métodos y eventos con sintaxis de template string.

4. **🌐 HTML y Plataforma Web**:
   - *HTML5 Semántico*: Landmark elements (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`) para SEO y accesibilidad.
   - *Accesibilidad Web (a11y) & WAI-ARIA*: Primera regla de ARIA, `role`, `aria-label`, `aria-live`.
   - *Formularios & Constraint Validation API*: Validación nativa con `pattern`, `required` y `checkValidity()`.
   - *Web Storage API*: Comparativa de ciclo de vida entre `localStorage`, `sessionStorage`, `Cookies` e `IndexedDB`.
   - *DOM Event Flow*: Capturing, Target, Bubbling y el patrón de Delegación de Eventos.
   - *Web Components*: Custom Elements, Shadow DOM para aislamiento de CSS y `<template>`.
   - *Meta Tags Esenciales*: Viewport responsivo móvil, Charset UTF-8, SEO y tarjetas Open Graph.
   - *Gráficos Nativos*: SVG vectorial escalable con nodos DOM vs Canvas 2D rasterizado por píxeles a 60fps.
   - *Progressive Web Apps (PWA)*: Service Workers para modo Offline-First, Cache Storage y Push.
   - *Web Workers*: Ejecución multihilo en segundo plano sin congelar la interfaz de usuario (UI Freezing).
   - *Critical Rendering Path*: DOM -> CSSOM -> Render Tree -> Reflow (Layout) -> Repaint -> Composite.
   - *Carga de Scripts*: Atributos `defer` (orden preservado sin bloqueo) vs `async` (ejecución inmediata).
   - *Multimedia Nativa*: `<picture>` y `srcset` para imágenes responsivas y formatos AVIF/WebP con lazy loading.
   - *Seguridad Web*: Content Security Policy (CSP) contra XSS y Cross-Origin Resource Sharing (CORS).
   - *Tiempo Real*: WebSockets bidireccional full-duplex vs Server-Sent Events (SSE) para streaming de tokens.

5. **🐍 Python & Backend Moderno (14 Tarjetas)**:
   - *Mutabilidad & Referencias*: `id()`, comparación por identidad (`is`) vs valor (`==`), tipos mutables vs inmutables.
   - *Generadores e Iteradores*: `yield`, `next()`, evaluación perezosa y consumo de RAM O(1).
   - *Decoradores & Closures*: Envoltorios de funciones, preservación de metadatos con `@functools.wraps`.
   - *Type Hinting & Pydantic*: Validación de datos en tiempo de ejecución, coerción y `BaseModel`.
   - *Asyncio & Concurrencia I/O*: `async def`, `await`, Event Loop cooperativo y `asyncio.gather`.
   - *El GIL de CPython*: Limitaciones multinúcleo en CPU, cuándo usar `multiprocessing` vs `threading`.
   - *Context Managers*: Protocolo con `with`, adquisición y liberación garantizada en `__exit__`.
   - *FastAPI & Inyección de Dependencias*: `Depends()`, modularización de auth y testing con overrides.
   - *Comprehensions Avanzadas*: List, Dict y Set comprehensions optimizadas a nivel C.
   - *Métodos Dunder*: Sobrecarga de operadores, `__repr__` (depuración) vs `__str__` (usuario).
   - *Manejo Robusto de Errores*: Tracebacks limpios y encadenamiento de causas con `raise ... from`.
   - *Empaquetado Moderno*: Entornos virtuales (`.venv`), `pyproject.toml` y herramientas ultra-rápidas (`uv`).
   - *Parámetros Dinámicos*: Empaquetado posicional (`*args`) y nominal (`**kwargs`).
   - *Data Classes*: `@dataclass(frozen=True)` para modelos internos ligeros frente a Pydantic.

6. **🗄️ Bases de Datos, SQL & Persistencia (14 Tarjetas)**:
   - *Índices B-Tree vs Hash vs GIN*: Búsqueda en rangos O(log N), índices exactos y campos JSONB/Full-text.
   - *Transacciones ACID*: Atomicidad, Consistencia, Aislamiento y Durabilidad con Write-Ahead Logging (WAL).
   - *Niveles de Aislamiento SQL*: Read Committed, Repeatable Read y Serializable; prevención de Dirty Reads.
   - *Tipos de JOINs*: INNER, LEFT, RIGHT, FULL OUTER y CROSS JOIN (producto cartesiano).
   - *Normalización (1NF a 3NF) vs Desnormalización*: Integridad en OLTP vs lectura ultra-rápida en OLAP.
   - *Optimización con EXPLAIN ANALYZE*: Costos, tiempos reales y detección de Seq Scans costosos.
   - *Particionamiento vs Sharding*: Poda de particiones local en un nodo vs distribución horizontal en clusters.
   - *Replicación Master-Replica*: Streaming de WAL, escalado de lecturas y tolerancia a fallos con failover.
   - *El Teorema CAP*: Compromiso ineludible entre Consistencia Estricta (CP) y Alta Disponibilidad (AP).
   - *Bases NoSQL*: Modelos Documentales (MongoDB), Clave-Valor en memoria RAM (Redis) y Columnar.
   - *Patrón Cache-Aside*: Reducción de carga en BD con TTL y políticas de desalojo LRU.
   - *Integridad Referencial*: Claves Foráneas y mitigación de riesgos con `ON DELETE RESTRICT` vs `CASCADE`.
   - *Migraciones Automatizadas*: Versionado de esquema como código con Alembic y Flyway.
   - *Connection Pooling*: Reutilización de sockets con HikariCP/pgBouncer para miles de conexiones concurrentes.

7. **🐳 DevOps, Docker & CI/CD (14 Tarjetas)**:
   - *Imágenes vs Contenedores*: Capas inmutables de solo lectura (UnionFS) vs capa efímera Read-Write.
   - *Dockerfile*: Directivas fundamentales, ejecutable base con `ENTRYPOINT` vs flags por defecto en `CMD`.
   - *Multi-Stage Builds*: Reducción de imágenes de 1GB a 25MB y eliminación de superficies de ataque CVE.
   - *Persistencia de Datos*: Named Volumes seguros gestionados por Docker vs Bind Mounts para desarrollo.
   - *Redes de Contenedores*: Driver Bridge por defecto, modo Host sin aislamiento y Overlay distribuido.
   - *Docker Compose*: Orquestación declarativa multicontenedor con resolución DNS automática por nombre.
   - *Kubernetes Pods & Deployments*: Unidad mínima compartida, ReplicaSets y autorreparación continua (Self-Healing).
   - *Servicios e Ingress*: ClusterIP interno, NodePort, balanceadores de nube y enrutamiento L7 con Ingress.
   - *Pipelines CI/CD*: Automatización de pruebas, análisis estático, empaquetado y despliegues con GitHub Actions.
   - *The Twelve-Factor App*: Configuración exclusiva en variables de entorno y procesos sin estado (Stateless).
   - *Infraestructura como Código (IaC)*: Enfoque declarativo con Terraform y gestión de archivos de estado.
   - *Observabilidad*: Los 3 pilares indispensables (Métricas en series temporales, Logs estructurados y Trazas OpenTelemetry).
   - *Estrategias de Despliegue*: Blue/Green para rollback instantáneo con cero downtime vs despliegues Canary.
   - *Gestión de Secretos*: Secret Managers empresariales (Vault, AWS Secrets Manager) vs archivos `.env`.

8. **🛡️ Seguridad del Software & OWASP Top 10 (12 Tarjetas)**:
   - *Inyección SQL (SQLi)*: Ataques por concatenación y mitigación definitiva mediante Prepared Statements.
   - *Cross-Site Scripting (XSS)*: Inyección de JavaScript en el cliente (Stored, Reflected, DOM) y escape de salidas.
   - *Cross-Site Request Forgery (CSRF)*: Suplantación de peticiones, tokens Anti-CSRF y cookies con `SameSite`.
   - *JSON Web Tokens (JWT)*: Header, Payload (público) y Firma criptográfica; rotación con Access y Refresh Tokens.
   - *Hashing de Contraseñas*: Derivación lenta y costosa con Argon2id y bcrypt con salt vs hashes rápidos inseguros.
   - *Principio de Menor Privilegio (PoLP)*: Cuentas de servicio restringidas y control de acceso por roles (RBAC).
   - *Cifrado en Tránsito vs Reposo*: Protocolo TLS 1.3 / HTTPS contra MitM vs cifrado de bloques AES-256 en disco.
   - *Rate Limiting*: Algoritmos Token Bucket y Leaky Bucket para frenar ataques de fuerza bruta y DoS (HTTP 429).
   - *Cabeceras de Seguridad HTTP*: CSP estricto, HSTS contra downgrades y prevención de Clickjacking con X-Frame-Options.
   - *Server-Side Request Forgery (SSRF)*: Blindaje de endpoints que descargan URLs bloqueando IPs privadas y metadatos de cloud.
   - *Autenticación Multifactor (MFA/2FA)*: Algoritmo TOTP (RFC 6238) basado en HMAC y tiempo Unix fuera de línea.
   - *Análisis de Composición de Software (SCA)*: Detección y mitigación automática de vulnerabilidades en dependencias (CVEs).

9. **🌿 Git & Control de Versiones Profesional (12 Tarjetas)**:
   - *Modelo de Objetos de Git*: Blobs inmutables, Trees jerárquicos, Commits firmados y Grafo Acíclico Dirigido (DAG).
   - *Las 3 Zonas de Git*: Working Directory (disco), Staging Area / Index (preparación) y Repositorio permanente.
   - *Git Merge vs Git Rebase*: Historial cronológico con commits de fusión vs historial lineal continuo.
   - *Git Cherry-Pick*: Aplicación selectiva de parches de commits específicos entre ramas.
   - *Git Bisect*: Búsqueda binaria logarítmica O(log N) para aislar el commit exacto que introdujo una regresión.
   - *Git Stash*: Almacenamiento temporal de cambios incompletos para alternar contextos limpiamente.
   - *Resolución de Conflictos*: Interpretación de marcadores `<<<<<<<` y confirmación atómica con `git add`.
   - *Git Reset vs Git Revert*: Deshacer commits locales reescribiendo la historia vs commits de compensación seguros en ramas públicas.
   - *Estrategias de Ramas*: Trunk-Based Development con Feature Flags frente a la sobrecarga de GitFlow.
   - *Git Hooks*: Automatización local con pre-commit (bloqueo de credenciales y linters) y commit-msg.
   - *Submódulos vs Monorepos*: Dependencias externas ancladas a hashes vs repositorios unificados.
   - *Firmado Criptográfico*: Verificación de autenticidad e identidad del autor con claves GPG / SSH en GitHub.

10. **☕ Ecosistema Java Completo (105+ Tarjetas)**:
   - Java Core, JVM (JIT, Garbage Collector), Colecciones, Concurrencia multihilo, Sockets, Java RMI, NIO, JPA y Spring.

6. **📦 POO y Fundamentos de Arquitectura**:
   - *Objeto vs. Instancia*: La diferencia precisa en memoria y concepto (plano vs. casa construida).
   - Encapsulamiento, Polimorfismo, Herencia vs. Composición, Clases Abstractas vs. Interfaces.
2. **Nodos y Estructuras de Datos**:
   - *El concepto de Nodo*: Contenedor con `dato` + `puntero/referencia`.
   - Listas Enlazadas (Simple y Doblemente Enlazada), Árboles Binarios (BST), Pilas (LIFO), Colas (FIFO), Tablas Hash y Grafos.
3. **Arquitectura Hexagonal (Ports & Adapters)**:
   - Explorador visual interactivo de capas:
     - **💎 Núcleo de Dominio**: Entidades puras y reglas de negocio sin frameworks ni SQL.
     - **🔌 Capa de Puertos**: Interfaces Driving/Inbound (Casos de Uso) y Driven/Outbound (SPI).
     - **⚙️ Capa de Adaptadores**: Implementaciones concretas (REST Controllers, Postgres, Repositorios, Stripe, etc.).
   - Regla de oro de dependencia y Desacoplamiento.
4. **Principios SOLID**:
   - SRP (Responsabilidad Única), OCP (Abierto/Cerrado), LSP (Sustitución de Liskov), ISP (Segregación de Interfaces), DIP (Inversión de Dependencias).
5. **Patrones de Diseño GoF**:
   - Patrón Adapter, Patrón Strategy, Patrón Observer, Patrón Factory.
6. **Algoritmos y Notación Big O**:
   - $O(1)$, $O(\log n)$, $O(n)$, $O(n \log n)$, $O(n^2)$.

---

## 🚀 Inicio Rápido

### Opción 1: Con un solo clic en Windows
Haz doble clic sobre el archivo:
```bat
iniciar_devcards.bat
```

### Opción 2: Desde terminal (PowerShell o CMD)
```bash
cd C:\Users\POWER\Documents\GitHub\devcards_ai
python run_devcards.py
```
El servidor arrancará en `http://localhost:8000` y abrirá automáticamente tu navegador web.

---

## 🤖 Integración con Inteligencia Artificial (Ollama)

DevCards AI está preparado para conectarse con **Ollama** de manera local:

1. Si Ollama está ejecutándose en tu PC (`http://localhost:11434`), la aplicación lo detectará en tiempo real.
2. Puedes usar modelos locales como `llama3.2`, `qwen2.5:1.5b` o `mistral` para:
   - **Generar nuevas tarjetas a demanda** con definición, analogía, código y preguntas de examen.
   - **Explicar cualquier concepto con analogías cotidianas** haciendo clic en el botón *"💡 Explicar con analogía cotidiana"*.
3. **Modo Offline-First**: Si Ollama no está corriendo, la aplicación continúa funcionando al 100% gracias a su catálogo precargado de 24 tarjetas maestras y su **Generador Sintético Experto** integrado.

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| `Espacio` | Voltear la tarjeta (Frente / Dorso) |
| `Flecha Derecha` | Tarjeta siguiente |
| `Flecha Izquierda` | Tarjeta anterior |
| `1` | Calificar como **Difícil** (Caja Leitner 1) |
| `2` | Calificar como **Dudoso** (Caja Leitner 2) |
| `3` | Calificar como **Dominado** (Caja Leitner 3) |
| `Q` | Activar / Desactivar Modo Quiz |

---

## 🧪 Pruebas Automatizadas

El proyecto cuenta con una suite completa de pruebas unitarias con `FastAPI TestClient`:
```bash
python tests/test_api.py
```
*Cobertura: 8 pruebas completadas con éxito verificando endpoints REST, persistencia, generación sintética y progresión Leitner.*

---

## 📂 Gobernanza y Backlog

- Consulta el backlog completo con Casos de Uso, Requisitos y Sprints en:  
  [BACKLOG.md](BACKLOG.md)
- Especificación del Agente de Fábrica en:  
  [AGENTS.md](AGENTS.md)
