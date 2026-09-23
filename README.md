# 🧠 DevCards AI &mdash; Plataforma de Repaso Conceptual y Arquitectura con IA

> **Proyecto Oficial de la Fábrica de Software Agéntica OKF v0.2**  
> Identificador OKF: `urn:factory:project:devcards_ai`  
> Roles: `FullStackEngineer`, `AIIntegrationSpecialist`, `SoftwareFactoryArchitect`

---

## 🌟 ¿Qué es DevCards AI?

**DevCards AI** es una plataforma web interactiva de alto rendimiento visual diseñada para desarrolladores que desean dominar, recordar y clarificar conceptos fundamentales de programación y arquitectura de software que frecuentemente se olvidan o malinterpretan.

Utiliza el método científico de **Repetición Espaciada de Leitner**, explicaciones basadas en **analogías cotidianas**, visualizaciones arquitectónicas interactivas y asistencia de **IA local con Ollama** (o generador sintético experto fuera de línea).

---

## 🎯 Conceptos Clave Cubiertos

1. **Programación Orientada a Objetos (POO)**:
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
