# Guía Maestra: Cómo Compartir DevCards AI y Ejecutarlo de Inmediato

> **Estado**: 100% Optimizado para compartir sin fricción ni barreras técnicas.
> **Total de Tarjetas**: 1,295 Flashcards interactivas de Ingeniería de Software, Arquitectura Hexagonal, Inglés Técnico, Algoritmos, Estructuras de Datos y Principios SOLID.

---

## 1. ¿Es DevCards AI un buen proyecto para compartir?

**Sí, es un proyecto extraordinario**, tanto para compartir con amigos de la universidad, colegas de trabajo, comunidades de programadores o reclutadores técnicos:

1. **Utilidad Real Inmediata**: No es un prototipo vacío. Contiene **1,295 tarjetas técnicas** redactadas con preguntas de entrevista, definiciones formales, analogías nemotécnicas del mundo real, snippets de código y preguntas de examen tipo Quiz.
2. **Pedagogía de Vanguardia**: Implementa el algoritmo de **Repetición Espaciada Leitner** (Cajas 1, 2 y 3) con persistencia automática de rachas de estudio.
3. **Explorador Visual de Arquitectura Hexagonal**: Permite entender de forma interactiva la separación entre Dominio, Puertos y Adaptadores.
4. **Diseño Visual de Alto Impacto**: Interfaz moderna en modo oscuro, tarjetas con efecto 3D flip, atajos de teclado y tipografías para desarrolladores (*JetBrains Mono* e *Inter*).

---

## 2. ¿Si alguien lo descarga de GitHub, puede abrirlo de inmediato?

**SÍ, ahora sí puede abrirlo de inmediato con 1 solo clic.**

### ¿Qué ocurría antes?
Anteriormente, el archivo `app.js` dependía de hacer peticiones de red (`fetch('/api/cards')`) a un backend en Python/FastAPI. Si una persona descargaba el repositorio y abría `index.html` sin tener Python o sin levantar el servidor, el navegador mostraba 0 tarjetas y fallaba.

### ¿Cómo quedó resuelto ahora?
Se implementó una **arquitectura híbrida autónoma**:
- Todas las 1,295 tarjetas están pre-empaquetadas en `docs/js/cards_data.js`.
- La aplicación detecta automáticamente si el backend está apagado o si se abrió directamente desde el disco duro (`file:///`), cargando de inmediato todo el mazo.
- Se agregaron lanzadores automáticos en la raíz del repositorio (`.bat`) para que nadie tenga que escribir comandos en la terminal si no lo desea.

---

## 3. Las Tres Formas de Compartir DevCards AI

Elige la que mejor se adapte a la persona con quien lo vas a compartir:

| Método | Requisitos para tu amigo | ¿Requiere Python? | Dispositivos |
| :--- | :--- | :--- | :--- |
| **Opción A: Enlace Web (GitHub Pages)** | Cero. Solo dar clic en el link. | No | PC, Mac, Móviles, Tablets |
| **Opción B: Descarga ZIP / Clon local** | Descargar el repositorio y hacer doble clic. | No | PC (Windows / Linux / Mac) |
| **Opción C: Servidor Local con IA (Ollama)** | Tener Python 3.10+ y ejecutar el instalador. | Sí | PC / Laptop |

---

### Opción A (La más recomendada): Compartir por Enlace Web Directo (GitHub Pages)

Esta es la mejor opción para amigos que quieran probar la app sin descargar nada, o para ponerla en tu portafolio/LinkedIn:

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/devcards_ai`
2. Haz clic en la pestaña **Settings** (Configuración del repositorio).
3. En el menú lateral izquierdo, haz clic en **Pages**.
4. En la sección **Build and deployment**:
   - **Source**: Selecciona `Deploy from a branch`.
   - **Branch**: Selecciona `main` y en la carpeta elige **/docs**.
   - Haz clic en **Save**.
5. En unos 60 segundos, GitHub generará tu enlace público:
   `https://TU_USUARIO.github.io/devcards_ai/`
6. **¡Listo!** Le envías ese enlace a tu amigo por WhatsApp, Discord o correo y podrá estudiar las 1,295 tarjetas desde su computadora o teléfono celular al instante.

---

### Opción B: Compartir por Archivo ZIP o Clon de GitHub (Sin Instalar Nada)

Si tu amigo prefiere tener los archivos en su computadora o no tiene conexión a internet:

1. **Enviar el proyecto**:
   - Tu amigo puede clonar el repositorio: `git clone https://github.com/TU_USUARIO/devcards_ai.git`
   - O tú puedes comprimir la carpeta en un `.zip` y enviárselo directamente.
2. **Para abrirlo de inmediato**:
   - Simplemente hace doble clic en el archivo:
     `ABRIR_DIRECTO_EN_NAVEGADOR.bat`
   - O hace doble clic directo en el archivo `docs/index.html`.
3. **Resultado**: La aplicación se abre en Chrome/Edge/Firefox con sus 1,295 tarjetas, animaciones 3D, filtros por categoría, búsqueda instantánea, modo Quiz y repaso Leitner.

---

### Opción C: Modo Completo de Desarrollador con Servidor Local e IA (FastAPI + Ollama)

Si tu amigo es desarrollador y desea correr el servidor FastAPI localmente, conectar su modelo de IA (Ollama con Llama 3.2 o DeepSeek) o generar nuevas tarjetas dinámicamente con IA:

1. Abre la carpeta del proyecto en su equipo.
2. Hace doble clic en:
   `INSTALAR_Y_EJECUTAR.bat`
   *(Este script detecta Python, crea un entorno virtual `.venv` aislado, instala las dependencias de `requirements.txt` y levanta el servidor en `http://localhost:8000`).*
3. En las siguientes ocasiones, solo necesita hacer doble clic en:
   `iniciar_devcards.bat`
4. *(Opcional)* Si tiene **Ollama** instalado (`ollama run llama3.2`), DevCards AI se conectará automáticamente al modelo local para crear tarjetas sintéticas bajo demanda.

---

## 4. Atajos de Teclado para Estudiar a Máxima Velocidad

Una vez dentro de DevCards AI, puedes usar los siguientes atajos:

- **Espacio**: Voltear tarjeta (Giro 3D).
- **Flecha Derecha / Flecha Abajo**: Siguiente tarjeta.
- **Flecha Izquierda / Flecha Arriba**: Tarjeta anterior.
- **Tecla 1**: Calificar como "Difícil" (Permanece en Caja 1 Leitner).
- **Tecla 2**: Calificar como "Dudoso" (Pasa a Caja 2 Leitner).
- **Tecla 3**: Calificar como "Fácil / Dominado" (Avanza a Caja 3 Leitner).
- **Tecla Q**: Entrar o salir del Modo Quiz.

---

## 5. Resumen de Archivos Clave del Repositorio

- `docs/index.html`: Punto de entrada web autónomo y compatible con GitHub Pages.
- `docs/js/cards_data.js`: Base de datos precargada con 1,295 tarjetas de estudio.
- `ABRIR_DIRECTO_EN_NAVEGADOR.bat`: Lanzador 1-clic para abrir la app sin terminal ni Python.
- `iniciar_devcards.bat`: Lanzador inteligente con verificación automática de entorno.
- `INSTALAR_Y_EJECUTAR.bat`: Instalador automatizado para entornos virtuales de Python.
- `app/main.py`: Servidor backend de FastAPI para API REST y generación con IA.
- `run_devcards.py`: Script lanzador con apertura automática de navegador y detección de Ollama.
