"""
main.py - Servidor Backend FastAPI para DevCards AI.
"""
import os
import json
import uuid
import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Query, Body, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, Response

from app.models import (
    Flashcard,
    CardCreateRequest,
    AIGenerateCardRequest,
    AIAnalogyRequest,
    LeitnerUpdateRequest
)
from app.ai_service import AIService

ROOT_DIR = Path(__file__).parent.parent
DATA_DIR = Path(__file__).parent / "data"
STATIC_DIR = Path(__file__).parent / "static"
SEED_FILE = DATA_DIR / "seed_cards.json"
USER_CARDS_FILE = DATA_DIR / "user_cards.json"
PROGRESS_FILE = DATA_DIR / "user_progress.json"

app = FastAPI(
    title="DevCards AI API",
    description="Backend de aprendizaje interactivo y nemotecnia de programación asistido por IA",
    version="1.1.0"
)

# CORS habilitado para desarrollo y consumo local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_service = AIService()


def load_progress_map() -> Dict[str, int]:
    """Carga el mapa de progreso Leitner guardado en backend."""
    if PROGRESS_FILE.exists():
        try:
            return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_progress_map(progress: Dict[str, int]) -> None:
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2, ensure_ascii=False), encoding="utf-8")


def load_all_cards() -> List[dict]:
    """Carga las tarjetas semilla y las tarjetas personalizadas del usuario."""
    cards = []
    if SEED_FILE.exists():
        try:
            cards.extend(json.loads(SEED_FILE.read_text(encoding="utf-8")))
        except Exception:
            pass

    if USER_CARDS_FILE.exists():
        try:
            user_cards = json.loads(USER_CARDS_FILE.read_text(encoding="utf-8"))
            cards.extend(user_cards)
        except Exception:
            pass

    # Aplicar estado Leitner si existe
    progress = load_progress_map()
    for c in cards:
        cid = c.get("id")
        if cid in progress:
            c["box"] = progress[cid]

    return cards


def save_user_card(new_card: dict) -> None:
    """Guarda una tarjeta creada por el usuario."""
    user_cards = []
    if USER_CARDS_FILE.exists():
        try:
            user_cards = json.loads(USER_CARDS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    user_cards.append(new_card)
    USER_CARDS_FILE.write_text(json.dumps(user_cards, indent=2, ensure_ascii=False), encoding="utf-8")


@app.get("/api/status")
def get_system_status():
    """Estado del servidor y detección de Ollama local."""
    ollama_ok = ai_service.is_ollama_online()
    cards_count = len(load_all_cards())
    return {
        "status": "online",
        "app": "DevCards AI",
        "app_name": "DevCards AI",
        "version": "1.1.0",
        "total_cards": cards_count,
        "ollama_running": ollama_ok,
        "ollama_connected": ollama_ok,
        "engine": "Ollama Local (11434)" if ollama_ok else "Motor Sintético Experto (Offline First)"
    }


@app.get("/api/categories")
def get_categories():
    """Devuelve el inventario dinámico de todas las categorías con conteo de tarjetas."""
    cards = load_all_cards()
    counts = {}
    for c in cards:
        cat = c.get("category", "Otros")
        counts[cat] = counts.get(cat, 0) + 1

    category_icons = {
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
    }

    java_categories = {
        "Java Core y JVM", "POO Avanzada en Java", "Colecciones y Generics",
        "Hilos y Concurrencia", "Sockets Avanzados en Java", "Redes y Protocolos TCP/IP",
        "Networking y Sockets", "Java RMI", "Acceso a Datos y JDBC",
        "Java I/O y Compresión", "Java NIO y Alta Concurrencia", "Sistemas Distribuidos",
        "CORBA y RMI-IIOP", "Persistencia y JPA", "Inversión de Control y Spring",
        "Java 8 Funcional", "Reflexión e Introspección", "Entrada/Salida y Serialización"
    }
    java_count = sum(1 for c in cards if c.get("category") in java_categories or "java" in c.get("category", "").lower() or c.get("id", "").startswith(("java-", "net-", "rmi-", "corba-")))

    result = [
        {"name": "Todos", "count": len(cards), "icon": "🌐"},
        {"name": "Java (Completo)", "count": java_count, "icon": "☕"}
    ]

    preferred_order = [
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
    ]
    added = {"Todos"}
    for cat in preferred_order:
        if cat in counts:
            result.append({"name": cat, "count": counts[cat], "icon": category_icons.get(cat, "🏷️")})
            added.add(cat)

    for cat in sorted(counts.keys()):
        if cat not in added:
            result.append({"name": cat, "count": counts[cat], "icon": category_icons.get(cat, "🏷️")})

    return result


@app.get("/api/cards")
def get_cards(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """Devuelve la lista de tarjetas con filtros opcionales."""
    cards = load_all_cards()
    
    cat_val = category if isinstance(category, str) else None
    diff_val = difficulty if isinstance(difficulty, str) else None
    search_val = search if isinstance(search, str) else None
    
    if cat_val and cat_val.lower() != "todos":
        if cat_val.lower() in ["java (completo)", "java", "ecosistema java"]:
            java_categories = {
                "java core y jvm", "poo avanzada en java", "colecciones y generics",
                "hilos y concurrencia", "sockets avanzados en java", "redes y protocolos tcp/ip",
                "networking y sockets", "java rmi", "acceso a datos y jdbc",
                "java i/o y compresión", "java nio y alta concurrencia", "sistemas distribuidos",
                "corba y rmi-iiop", "persistencia y jpa", "inversión de control y spring",
                "java 8 funcional", "reflexión e introspección", "entrada/salida y serialización"
            }
            cards = [c for c in cards if (c.get("category", "").lower() in java_categories) or ("java" in c.get("category", "").lower()) or c.get("id", "").startswith(("java-", "net-", "rmi-", "corba-"))]
        else:
            cards = [c for c in cards if c.get("category", "").lower() == cat_val.lower()]

    if diff_val:
        cards = [c for c in cards if c.get("difficulty", "").lower() == diff_val.lower()]

    if search_val:
        s = search_val.lower().strip()
        cards = [
            c for c in cards
            if s in c.get("title", "").lower()
            or s in c.get("concept", "").lower()
            or s in c.get("question", "").lower()
            or s in c.get("definition", "").lower()
            or s in c.get("category", "").lower()
        ]

    return cards


@app.get("/api/cards/{card_id}")
def get_card_by_id(card_id: str):
    cards = load_all_cards()
    for c in cards:
        if c.get("id") == card_id:
            return c
    raise HTTPException(status_code=404, detail="Tarjeta no encontrada")


@app.post("/api/cards")
def create_card(card_data: CardCreateRequest):
    """Crea una nueva tarjeta manualmente."""
    new_card = card_data.model_dump()
    new_card["id"] = f"usr-{uuid.uuid4().hex[:6]}"
    new_card["user_created"] = True
    new_card["box"] = 1
    save_user_card(new_card)
    return new_card


@app.post("/api/cards/{card_id}/progress")
def update_card_progress(card_id: str, body: Dict[str, Any] = Body(...)):
    """Actualiza la caja de Leitner según acierto o calificación."""
    cards = load_all_cards()
    target_card = None
    for c in cards:
        if c.get("id") == card_id:
            target_card = c
            break

    if not target_card:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")

    current_box = target_card.get("box", 1)
    
    if "box" in body:
        new_box = int(body["box"])
    elif body.get("is_correct") is True or body.get("rating") == "facil":
        new_box = min(current_box + 1, 3)
    elif body.get("is_correct") is False or body.get("rating") == "dificil":
        new_box = 1
    elif body.get("rating") == "dudoso":
        new_box = 2
    else:
        new_box = current_box

    progress = load_progress_map()
    progress[card_id] = new_box
    save_progress_map(progress)

    target_card["box"] = new_box
    return target_card


@app.get("/api/export")
def export_cards_deck():
    """RF-11: Exporta el mazo completo de tarjetas a un JSON descargable."""
    cards = load_all_cards()
    export_payload = {
        "app": "DevCards AI",
        "standard": "Google Cloud OKF v0.2",
        "exported_at": datetime.datetime.now().isoformat(),
        "total_cards": len(cards),
        "cards": cards
    }
    content = json.dumps(export_payload, indent=2, ensure_ascii=False)
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=devcards_deck.json"}
    )


@app.post("/api/import")
def import_cards_deck(payload: Dict[str, Any] = Body(...)):
    """RF-11: Importa tarjetas personalizadas desde un archivo JSON."""
    imported_cards = payload.get("cards")
    if not imported_cards and isinstance(payload, list):
        imported_cards = payload

    if not isinstance(imported_cards, list):
        raise HTTPException(status_code=400, detail="Formato inválido: se esperaba una lista de tarjetas o un objeto con clave 'cards'")

    existing_cards = load_all_cards()
    existing_titles = {c.get("title", "").strip().lower() for c in existing_cards}
    
    user_cards = []
    if USER_CARDS_FILE.exists():
        try:
            user_cards = json.loads(USER_CARDS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass

    added_count = 0
    for card in imported_cards:
        if not isinstance(card, dict):
            continue
        title = card.get("title", "").strip()
        if not title or title.lower() in existing_titles:
            continue
            
        new_card = {
            "id": card.get("id") or f"usr-{uuid.uuid4().hex[:6]}",
            "title": title,
            "category": card.get("category", "Otros"),
            "difficulty": card.get("difficulty", "Intermedio"),
            "icon": card.get("icon", "💡"),
            "question": card.get("question", f"¿Qué es {title}?"),
            "definition": card.get("definition", ""),
            "analogy": card.get("analogy", ""),
            "code_example": card.get("code_example", ""),
            "quiz_question": card.get("quiz_question"),
            "quiz_options": card.get("quiz_options"),
            "quiz_answer": card.get("quiz_answer"),
            "key_takeaway": card.get("key_takeaway"),
            "box": 1,
            "user_created": True
        }
        user_cards.append(new_card)
        existing_titles.add(title.lower())
        added_count += 1

    USER_CARDS_FILE.write_text(json.dumps(user_cards, indent=2, ensure_ascii=False), encoding="utf-8")
    return {
        "success": True,
        "added_count": added_count,
        "total_cards": len(load_all_cards())
    }


@app.post("/api/generate-ai")
def generate_ai_card(req: AIGenerateCardRequest):
    """Genera una nueva tarjeta usando Ollama o motor inteligente."""
    card = ai_service.generate_card(
        topic=req.topic,
        category=req.category or "Conceptos de Programación",
        level=req.level or "Intermedio"
    )
    save_user_card(card)
    return card


@app.post("/api/explain-analogy")
def explain_analogy(req: AIAnalogyRequest):
    """Genera una analogía pedagógica para reforzar la memoria."""
    analogy = ai_service.explain_analogy(req.concept_title, req.definition)
    return {"analogy": analogy}


@app.get("/api/hexagonal-info")
def get_hexagonal_info():
    """Datos pedagógicos interactivos para el explorador visual de Arquitectura Hexagonal."""
    return {
        "title": "Arquitectura Hexagonal (Ports & Adapters)",
        "creator": "Alistair Cockburn (2005)",
        "golden_rule": "El Dominio no debe depender de nada externo. La tecnología es solo un detalle intercambiable.",
        "layers": [
            {
                "id": "domain",
                "name": "Núcleo de Dominio (Domain Core)",
                "color": "#6366f1",
                "icon": "💎",
                "description": "El corazón de tu aplicación. Contiene Entidades de Negocio, Objetos de Valor (Value Objects) y Reglas de Negocio Puras. No tiene anotaciones de frameworks ni sentencias SQL.",
                "examples": ["Entidad 'Cuenta'", "Entidad 'Pedido'", "Regla 'Saldo no puede ser negativo'"]
            },
            {
                "id": "ports",
                "name": "Capa de Puertos (Interfaces)",
                "color": "#06b6d4",
                "icon": "🔌",
                "description": "Son contratos o interfaces que definen QUÉ hace el sistema. Los Puertos Primarios (Driving) exponen los Casos de Uso. Los Puertos Secundarios (Driven) definen qué servicios de infraestructura necesita el Dominio.",
                "examples": ["CrearPedidoUseCase (Inbound)", "RepositorioCuentasPort (Outbound)", "NotificadorEmailPort (Outbound)"]
            },
            {
                "id": "adapters",
                "name": "Capa de Adaptadores (Infraestructura)",
                "color": "#10b981",
                "icon": "⚙️",
                "description": "Implementaciones tecnológicas concretas que traducen el exterior hacia los puertos. Si cambias PostgreSQL por MongoDB o FastAPI por Spring Boot, SOLO tocas esta capa.",
                "examples": ["Controlador REST FastAPI", "PostgresRepositoryAdapter", "StripePaymentAdapter", "RabbitMQListener"]
            }
        ]
    }


# Montar archivos estáticos para la interfaz web
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

    @app.get("/")
    def serve_index():
        return FileResponse(str(STATIC_DIR / "index.html"))
