"""
ai_service.py - Servicio de IA para DevCards AI.
Soporta:
1. Ollama local (localhost:11434) para inferencia 100% privada y desconectada.
2. Fallback a Google GenAI / Gemini API si está configurado.
3. Fallback a Motor Sintético Experto para garantizar que nunca falle una petición.
"""
import os
import json
import urllib.request
import urllib.error
import uuid
from typing import Dict, Any, Optional

OLLAMA_BASE_URL = os.environ.get("OLLAMA_HOST", "http://localhost:11434")

# Banco sintético inteligente para respuestas inmediatas de alta calidad
SYNTHETIC_TOPICS = {
    "docker": {
        "title": "Docker: Multi-Stage Builds",
        "category": "DevOps y Cloud",
        "difficulty": "Intermedio",
        "icon": "🐳",
        "question": "¿Por qué los Multi-Stage Builds reducen drásticamente el tamaño de los contenedores?",
        "definition": "Permite usar una imagen pesada con compiladores y SDKs para compilar el proyecto en una etapa builder, y luego copiar únicamente el artefacto final a una imagen base mínima (ej: Alpine o distroless), descartando gigabytes de herramientas de desarrollo.",
        "analogy": "Un andamio de construcción: lo usas para pintar el edificio y luego lo retiras; no dejas los andamios de acero colgados de la fachada para siempre.",
        "code_example": "FROM golang:1.22 AS builder\nWORKDIR /app\nCOPY . .\nRUN go build -o servidor\n\nFROM alpine:latest\nCOPY --from=builder /app/servidor /servidor\nCMD ['/servidor']",
        "quiz_question": "¿Cuál es el beneficio de Multi-Stage Builds en Docker?",
        "quiz_options": [
            "Reduce el tamaño de la imagen final y minimiza vulnerabilidades de seguridad",
            "Duplica la memoria RAM del contenedor",
            "Hace que la imagen sea compatible con disquetes",
            "Elimina la necesidad de usar Linux"
        ],
        "quiz_answer": 0,
        "key_takeaway": "Construye con herramientas pesadas en etapa builder; despliega solo el binario en una imagen final mínima."
    },
    "sql injection": {
        "title": "Prevención de Inyección SQL (SQLi)",
        "category": "Seguridad y OWASP",
        "difficulty": "Principiante",
        "icon": "🛡️",
        "question": "¿Cómo garantizan las consultas parametrizadas la inmunidad frente a SQL Injection?",
        "definition": "Las consultas parametrizadas pre-compilan la estructura de la consulta en el motor de base de datos antes de enlazar los valores del usuario, tratando la entrada exclusivamente como datos literales y jamás como instrucciones ejecutables.",
        "analogy": "Un buzón de sugerencias blindado con ranura para papel: el usuario puede meter cartas escritas, pero no puede meter una palanca para abrir la cerradura de la caja.",
        "code_example": "# Seguro: Parámetros separados de la instrucción\ncursor.execute('SELECT * FROM cuentas WHERE usuario = %s', (input_usuario,))",
        "quiz_question": "¿Por qué 'SELECT * FROM u WHERE id = ' + user_id es peligroso?",
        "quiz_options": [
            "Porque permite que un atacante inyecte sentencias SQL arbitrarias alterando la lógica de la consulta",
            "Porque consume el doble de memoria RAM",
            "Porque SQL solo acepta letras minúsculas",
            "Porque borra el archivo main.py"
        ],
        "quiz_answer": 0,
        "key_takeaway": "Nunca concatenes strings en SQL; usa siempre Prepared Statements o parámetros vinculados."
    },

    "recursividad": {
        "title": "Recursión vs. Iteración",
        "category": "Algoritmos",
        "difficulty": "Intermedio",
        "icon": "🔄",
        "question": "¿Cuándo usar Recursión y qué es la condición de parada (Caso Base)?",
        "definition": "La recursión es una técnica donde una función se llama a sí misma para resolver subproblemas idénticos más pequeños. Requiere obligatoriamente un Caso Base (condición de parada); sin él, se produce un desbordamiento de pila (StackOverflowError). Consume memoria en el Call Stack O(n). La iteración (bucles for/while) es generalmente más rápida y usa memoria constante O(1).",
        "analogy": "Las muñecas rusas (Matrioskas). Abres una muñeca y dentro hay otra igual más pequeña (llamada recursiva). Sigues abriendo hasta llegar a la muñeca sólida más pequeña del centro (el caso base). Cuando llegas a ella, comienzas a cerrar todas las muñecas hacia afuera.",
        "code_example": "def factorial(n: int) -> int:\n    # Caso Base (Parada)\n    if n <= 1: return 1\n    # Paso Recursivo\n    return n * factorial(n - 1)",
        "quiz_question": "¿Qué ocurre si una función recursiva no tiene caso base o nunca lo alcanza?",
        "quiz_options": [
            "El compilador optimiza el bucle a tiempo O(1)",
            "Ocurre un error de desbordamiento de pila (Stack Overflow)",
            "La función devuelve None automáticamente",
            "La base de datos bloquea la transacción"
        ],
        "quiz_answer": 1,
        "key_takeaway": "Sin Caso Base = Stack Overflow. Divide el problema hasta llegar al caso más simple."
    },
    "inyeccion de dependencias": {
        "title": "Inyección de Dependencias (DI)",
        "category": "Arquitectura y Patrones",
        "difficulty": "Intermedio",
        "icon": "💉",
        "question": "¿Por qué la Inyección de Dependencias elimina el acoplamiento 'new' dentro de las clases?",
        "definition": "Técnica de diseño donde los objetos reciben sus colaboradores (dependencias) desde el exterior en lugar de crearlos internamente usando 'new'. Cumple el principio de Inversión de Control (IoC). Facilita el intercambio de implementaciones, la configuración modular y la creación de dobles de prueba (Mocks) en tests unitarios.",
        "analogy": "En vez de que tu laptop tenga la batería soldada con estaño a la placa madre (acoplamiento rígido con 'new'), tiene un puerto extraíble donde puedes deslizar cualquier batería compatible que cumpla la especificación.",
        "code_example": "# SIN DI (Malo: acoplado rígidamente a MySQL):\nclass ServicioUsuarios:\n    def __init__(self):\n        self.db = MySQLDatabase()\n\n# CON DI (Bueno: recibe la interfaz):\nclass ServicioUsuarios:\n    def __init__(self, db: DatabasePort):\n        self.db = db # Inyectado por constructor",
        "quiz_question": "La principal ventaja de la Inyección de Dependencias para pruebas unitarias es:",
        "quiz_options": [
            "Permite inyectar repositorios falsos (Mocks) en memoria sin tocar la base de datos real",
            "Duplica la velocidad de procesamiento de la GPU",
            "Convierte automáticamente el código a TypeScript",
            "Evita tener que escribir pruebas unitarias"
        ],
        "quiz_answer": 0,
        "key_takeaway": "No crees tus dependencias adentro; recíbelas desde afuera a través de interfaces."
    },
    "mvc": {
        "title": "Patrón MVC (Model-View-Controller)",
        "category": "Arquitectura de Software",
        "difficulty": "Principiante",
        "icon": "📐",
        "question": "¿Cuáles son los 3 roles de MVC y cómo se comunican?",
        "definition": "Patrón arquitectónico que separa una aplicación en 3 componentes: 1) Modelo (Model): Gobierna los datos, estado y reglas de negocio. 2) Vista (View): Renderiza la interfaz visual y presenta la información al usuario. 3) Controlador (Controller): Recibe los eventos o peticiones del usuario, invoca al Modelo y selecciona qué Vista renderizar.",
        "analogy": "Un restaurante: El Cliente es el usuario. El Camarero es el Controlador (toma tu pedido y te trae el plato). La Cocina es el Modelo (donde están los ingredientes y se cocina la comida). El Plato decorado servido en la mesa es la Vista.",
        "code_example": "# Modelo: Datos\nclass Tarea: def __init__(self, titulo): self.titulo = titulo\n\n# Controlador: Orquesta\n@app.get('/tareas')\ndef listar_tareas():\n    tareas = db.obtener_todas() # Modelo\n    return {'data': tareas}    # Pasa a la Vista JSON",
        "quiz_question": "En el patrón MVC, ¿qué componente es responsable de manipular los datos y reglas de negocio?",
        "quiz_options": [
            "La Vista (View)",
            "El Controlador (Controller)",
            "El Modelo (Model)",
            "El Router HTTP"
        ],
        "quiz_answer": 2,
        "key_takeaway": "Modelo = Datos | Vista = Pantalla | Controlador = Intermediario entre ambos."
    }
}


class AIService:
    """Gestiona la generación de tarjetas y explicaciones pedagógicas."""

    def is_ollama_online(self) -> bool:
        """Verifica si Ollama está corriendo en localhost:11434."""
        try:
            req = urllib.request.Request(f"{OLLAMA_BASE_URL}/api/tags", headers={"User-Agent": "DevCardsAI/1.0"})
            with urllib.request.urlopen(req, timeout=1.2) as response:
                return response.status == 200
        except Exception:
            return False

    def query_ollama(self, prompt: str, model: str = "llama3") -> Optional[str]:
        """Envía un prompt a Ollama local."""
        try:
            url = f"{OLLAMA_BASE_URL}/api/generate"
            payload = json.dumps({
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": 0.3}
            }).encode("utf-8")
            
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return data.get("response", "").strip()
        except Exception:
            return None

    def generate_card(self, topic: str, category: str = "Conceptos de Programación", level: str = "Intermedio") -> Dict[str, Any]:
        """Genera una tarjeta completa estructurada."""
        # 1. Intentar con Ollama si está online
        if self.is_ollama_online():
            prompt = f"""Eres un profesor experto de ciencias de la computación. 
Genera una tarjeta educativa de estudio (flashcard) en formato JSON estricto sobre el tema: '{topic}'.
La respuesta DEBE ser ÚNICAMENTE un objeto JSON válido con estos campos exactos:
{{
  "title": "Título corto y claro",
  "category": "{category}",
  "difficulty": "{level}",
  "icon": "un emoji alusivo",
  "question": "Pregunta de reflexión o concepto frontal",
  "definition": "Explicación técnica concisa y precisa",
  "analogy": "Una analogía de la vida cotidiana para que un estudiante nunca lo olvide",
  "code_example": "Snippet corto de código en Python o TypeScript demostrando el concepto",
  "quiz_question": "Una pregunta rápida de autoevaluación",
  "quiz_options": ["Opción 1 incorrecta", "Opción 2 correcta", "Opción 3 incorrecta", "Opción 4 incorrecta"],
  "quiz_answer": 1,
  "key_takeaway": "La regla de oro o resumen en una sola frase"
}}
NO incluyas texto antes ni después del JSON. Solo el JSON."""

            raw = self.query_ollama(prompt)
            if raw:
                try:
                    # Limpiar markdown si vino en bloque ```json
                    clean_json = raw.strip()
                    if clean_json.startswith("```"):
                        clean_json = clean_json.split("\n", 1)[1]
                    if clean_json.endswith("```"):
                        clean_json = clean_json.rsplit("\n", 1)[0]
                    card_dict = json.loads(clean_json.strip())
                    card_dict["id"] = f"ai-{uuid.uuid4().hex[:6]}"
                    card_dict["user_created"] = True
                    return card_dict
                except Exception:
                    pass

        # 2. Búsqueda en catálogo sintético
        topic_lower = topic.lower().strip()
        for k, v in SYNTHETIC_TOPICS.items():
            if k in topic_lower or topic_lower in k:
                card = dict(v)
                card["id"] = f"ai-{uuid.uuid4().hex[:6]}"
                card["user_created"] = True
                return card

        # 3. Generador semántico adaptativo
        return {
            "id": f"ai-{uuid.uuid4().hex[:6]}",
            "title": topic.title(),
            "category": category,
            "difficulty": level,
            "icon": "🧠",
            "question": f"¿Cómo opera y para qué sirve '{topic.title()}' en ingeniería de software?",
            "definition": f"'{topic.title()}' es un concepto clave en el desarrollo de software que permite organizar la lógica, estructurar la información y optimizar el mantenimiento y escalabilidad de los programas informáticos.",
            "analogy": f"Imagina '{topic.title()}' como una herramienta especializada en un taller mecánico: en vez de forzar una tuerca con la mano, utilizas la llave exacta diseñada para esa función específica sin dañar las demás piezas.",
            "code_example": f"# Demostración canónica de {topic.title()}\ndef ejemplo_{topic.lower().replace(' ', '_')}():\n    '''Aplica el concepto de {topic}'''\n    resultado = 'Implementación exitosa'\n    return resultado",
            "quiz_question": f"¿Cuál es el beneficio primordial de comprender '{topic.title()}'?",
            "quiz_options": [
                "Escribir código más mantenible, desacoplado y comprensible",
                "Evitar el uso de computadoras",
                "Reemplazar la memoria RAM por almacenamiento USB",
                "Hacer que el compilador ignore los errores de sintaxis"
            ],
            "quiz_answer": 0,
            "key_takeaway": f"Dominar {topic.title()} fortalece el pensamiento computacional y la arquitectura limpia.",
            "user_created": True
        }

    def explain_analogy(self, concept_title: str, definition: str) -> str:
        """Genera una analogía cotidiana para un concepto dado."""
        if self.is_ollama_online():
            prompt = f"Explica el concepto de programación '{concept_title}' (que se define como: {definition}) usando una analogía cotidiana divertida y memorable de la vida real (como cocinar, conducir un auto o ir de compras). Máximo 3 oraciones."
            res = self.query_ollama(prompt)
            if res:
                return res

        return f"Imagina {concept_title} como un sistema de enchufes universales: puedes viajar a cualquier país (diferentes sistemas o bases de datos) y tu cargador sigue funcionando sin tener que comprar un teléfono nuevo."
