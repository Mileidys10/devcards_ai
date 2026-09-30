# 🧠 DevCards AI &mdash; Plataforma de Repaso Conceptual y Arquitectura con IA

> **Proyecto Oficial de la Fábrica de Software Agéntica OKF v0.2**  
> Identificador OKF: `urn:factory:project:devcards_ai`  
> Roles: `FullStackEngineer`, `AIIntegrationSpecialist`, `SoftwareFactoryArchitect`

---

## 🌟 ¿Qué es DevCards AI?

**DevCards AI** es una plataforma web interactiva de alto rendimiento visual diseñada para desarrolladores que desean dominar, recordar y clarificar conceptos fundamentales de programación y arquitectura de software que frecuentemente se olvidan o malinterpretan.

Utiliza el método científico de **Repetición Espaciada de Leitner**, explicaciones basadas en **analogías cotidianas**, visualizaciones arquitectónicas interactivas y asistencia de **IA local con Ollama** (o generador sintético experto fuera de línea).

---

## 🎯 Conceptos Clave Cubiertos (218+ Tarjetas Pedagógicas)

La plataforma cuenta con un mazo exhaustivo y categorizado de **más de 218 tarjetas** organizadas en materias fundamentales con filtros dedicados:

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

5. **☕ Ecosistema Java Completo (105+ Tarjetas)**:
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
