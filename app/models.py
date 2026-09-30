"""
models.py - Modelos de datos Pydantic para DevCards AI.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class Flashcard(BaseModel):
    id: str
    title: str
    category: str  # POO, Estructuras de Datos, Arquitectura Hexagonal, Principios SOLID, etc.
    difficulty: str  # Principiante, Intermedio, Avanzado
    icon: str = "💡"
    question: str
    definition: str
    analogy: str
    code_example: Optional[str] = None
    quiz_question: Optional[str] = None
    quiz_options: Optional[List[str]] = None
    quiz_answer: Optional[int] = None
    key_takeaway: Optional[str] = None
    box: int = 1  # Caja Leitner (1: Difícil, 2: Dudoso, 3: Dominado)
    user_created: bool = False
    is_english: Optional[bool] = False


class CardCreateRequest(BaseModel):
    title: str
    category: str
    difficulty: str = "Principiante"
    icon: str = "💡"
    question: str
    definition: str
    analogy: str
    code_example: Optional[str] = None
    quiz_question: Optional[str] = None
    quiz_options: Optional[List[str]] = None
    quiz_answer: Optional[int] = None
    key_takeaway: Optional[str] = None


class AIGenerateCardRequest(BaseModel):
    topic: str
    category: Optional[str] = "Conceptos de Programación"
    level: Optional[str] = "Intermedio"
    provider: Optional[str] = "auto"  # 'ollama', 'gemini', 'auto'


class AIAnalogyRequest(BaseModel):
    concept_title: str
    definition: str


class LeitnerUpdateRequest(BaseModel):
    card_id: str
    rating: str  # 'dificil', 'dudoso', 'facil'
