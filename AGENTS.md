---
okf_id: "urn:factory:agent:devcards-ai"
project_id: "urn:factory:project:devcards-ai"
project_name: "devcards_ai"
disk_path: "C:\Users\POWER\Documents\GitHub\devcards_ai"
mcp_server: "okf-factory-mcp"
standard: "OKF/Google-Schema.org JSON-LD"
primary_role: "FullStackEngineer"
created_at: "2026-09-22T23:52:38.580979+00:00"
---

# AGENTS.md &mdash; Especificación Agéntica: devcards_ai

> Este proyecto ha emergido bajo la gobernanza de la **Fábrica de Software Agéntica**.
> Todo agente de IA (Antigravity, Cursor, Claude Code) que opere en este directorio
> debe ceñirse a las directivas, librerías autorizadas y habilidades registradas en este documento.

---

## 🏭 1. Conexión con el Servidor MCP de OKF

Este proyecto está formalmente conectado al servidor MCP central de la fábrica:
* **Servidor MCP**: `okf-factory-mcp`
* **Estándar Semántico**: Open Knowledge Format (OKF) con `@context: https://schema.org/`
* **Ubicación en Disco**: `C:\Users\POWER\Documents\GitHub\devcards_ai`
* **Manifiestos de Dependencias**: `Detectado por código fuente`

Cualquier agente debe consultar el servidor MCP para:
1. Validar si existen habilidades previas (`resolver_skills_libreria`).
2. Mantener actualizado el mapa dinámico en tiempo real (`obtener_mapa_fabrica_disco`).
3. Registrar nuevas decisiones técnicas y módulos en la Wiki de Obsidian.

---

## 🤖 2. Rol Principal & Directivas de Operación

### **Ingeniero Full Stack Agéntico** (`FullStackEngineer`)
*Descripción del proyecto:* Plataforma web de aprendizaje interactivo y nemotecnia con tarjetas (Flashcards) asistida por IA (Ollama / Gemini) para afianzar conceptos de POO, estructuras de datos, nodos y Arquitectura Hexagonal.

#### Directivas Operativas Obligatorias:
- Desarrollar componentes de frontend y servicios de backend respetando la arquitectura del proyecto.
- Mantener la integridad de los contratos de API y tipos de datos en ambos extremos.
- Consultar los skills de la fábrica en Obsidian antes de introducir nuevos patrones.

- **Estructuras Tecnológicas en uso**: `css3, fastapi, html5, javascript, ollama, python`.
- **Prohibición de Alucinación**: No agregue librerías arbitrarias sin registrar su justificación en este archivo o en los manifiestos oficiales.

---

## 📦 3. Inventario de Librerías & Estructuras Tecnológicas

Las siguientes librerías componen el núcleo técnico del proyecto y están mapeadas a sus respectivas estructuras:

| Librería / Paquete | Versión | Estructura Tecnológica | Propósito Arquitectónico |
| :--- | :---: | :--- | :--- |
| *(Sin dependencias externas explícitas)* | - | - | - |

---

## 🧠 4. Habilidades Requeridas de la Wiki (Skills)

El agente debe aplicar las mejores prácticas y directivas especificadas en las siguientes notas de Obsidian:

| Habilidad (Skill Wiki) | Tecnología | Motivo de Vinculación |
| :--- | :--- | :--- |
| [[arquitectura-hexagonal]] | Custom | Declarado explícitamente en la emergencia |
| [[estructuras-datos]] | Custom | Declarado explícitamente en la emergencia |
| [[flashcards-learning]] | Custom | Declarado explícitamente en la emergencia |

---

## 🛡️ 5. Reglas de Higiene y Gobernanza de la Fábrica

1. **Persistencia y Trazabilidad**: Todo cambio arquitectónico debe reflejarse en los manifiestos oficiales del proyecto.
2. **Documentación Viva**: Si se incorpora una nueva tecnología o patrón, se debe invocar el servidor MCP para sincronizar el mapa.
3. **Control de Versiones**: Realizar commits semánticos y descriptivos referenciando las capacidades construidas.

*(Documento generado automáticamente por el Motor de Emergencia de la Fábrica de Software Agéntica OKF)*
