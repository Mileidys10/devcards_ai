"""
Pruebas automatizadas de DevCards AI
Verifica integridad de endpoints, mazo de 40+ tarjetas, export/import JSON y fallback de IA.
"""

import sys
import os
import json
import unittest

BASE_DIR = r"C:\Users\POWER\Documents\GitHub\devcards_ai"
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from app.main import app

class TestDevCardsAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_status(self):
        res = self.client.get("/api/status")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data.get("app"), "DevCards AI")
        self.assertIn("ollama_running", data)
        self.assertIn("total_cards", data)
        self.assertGreaterEqual(data.get("total_cards", 0), 40, "Debe tener al menos 40 tarjetas según RF-01")

    def test_02_categories(self):
        res = self.client.get("/api/categories")
        self.assertEqual(res.status_code, 200)
        cats = res.json()
        cat_names = [c["name"] for c in cats]
        # Materias principales solicitadas
        self.assertIn("Java (Completo)", cat_names)
        self.assertIn("Inteligencia Artificial", cat_names)
        self.assertIn("Angular", cat_names)
        self.assertIn("TypeScript", cat_names)
        self.assertIn("HTML y Web", cat_names)
        self.assertIn("Python y Backend", cat_names)
        self.assertIn("Bases de Datos y SQL", cat_names)
        self.assertIn("DevOps y Cloud", cat_names)
        self.assertIn("Seguridad y OWASP", cat_names)
        self.assertIn("Git y Control de Versiones", cat_names)
        # Categorías pedagógicas base
        self.assertIn("POO", cat_names)
        self.assertIn("Estructuras de Datos", cat_names)
        self.assertIn("Arquitectura Hexagonal", cat_names)
        self.assertIn("Principios SOLID", cat_names)
        self.assertIn("Patrones de Diseño", cat_names)
        self.assertIn("Algoritmos y Big O", cat_names)

    def test_03_cards_catalog_completeness(self):
        res = self.client.get("/api/cards")
        self.assertEqual(res.status_code, 200)
        cards = res.json()
        self.assertGreaterEqual(len(cards), 40, "El mazo debe contener al menos 40 tarjetas pedagógicas")
        
        # Verificar conceptos clave solicitados expresamente
        titulos = [c.get("title", "").lower() for c in cards]
        self.assertTrue(any("objeto" in t for t in titulos), "Falta tarjeta de Objeto")
        self.assertTrue(any("nodo" in t for t in titulos), "Falta tarjeta de Nodo")
        self.assertTrue(any("hexagonal" in t for t in titulos), "Falta tarjeta de Arquitectura Hexagonal")
        self.assertTrue(any("puerto" in t for t in titulos), "Falta tarjeta de Puertos")
        self.assertTrue(any("solid" in t or "srp" in t or "single" in t for t in titulos), "Falta tarjeta SOLID")
        self.assertTrue(any("big o" in t or "complejidad" in t for t in titulos), "Falta tarjeta Big O")
        self.assertTrue(any("circular" in t for t in titulos), "Falta tarjeta Lista Circular")
        self.assertTrue(any("heap" in t or "prioridad" in t for t in titulos), "Falta tarjeta Cola de Prioridad")
        self.assertTrue(any("bfs" in t or "amplitud" in t for t in titulos), "Falta tarjeta BFS")
        self.assertTrue(any("dfs" in t or "profundidad" in t for t in titulos), "Falta tarjeta DFS")

        # Verificar conceptos de las nuevas materias
        # 1. Inteligencia Artificial
        self.assertTrue(any("llm" in t or "lenguaje grande" in t for t in titulos), "Falta tarjeta de LLM")
        self.assertTrue(any("rag" in t for t in titulos), "Falta tarjeta de RAG")
        self.assertTrue(any("transformer" in t or "atención" in t or "attention" in t for t in titulos), "Falta tarjeta de Transformer")
        self.assertTrue(any("mcp" in t or "model context" in t for t in titulos), "Falta tarjeta de MCP")
        # 2. Angular
        self.assertTrue(any("signals" in t or "signal" in t for t in titulos), "Falta tarjeta de Signals")
        self.assertTrue(any("standalone" in t for t in titulos), "Falta tarjeta de Standalone Components")
        self.assertTrue(any("control flow" in t or "@if" in t for t in titulos), "Falta tarjeta de Control Flow")
        # 3. TypeScript
        self.assertTrue(any("interfaces vs type" in t or "type alias" in t for t in titulos), "Falta tarjeta de Interfaces vs Types")
        self.assertTrue(any("genéricos" in t or "generics" in t for t in titulos), "Falta tarjeta de Generics")
        self.assertTrue(any("utility types" in t or "partial" in t for t in titulos), "Falta tarjeta de Utility Types")
        # 4. HTML y Web
        self.assertTrue(any("semántico" in t or "html5 semántico" in t for t in titulos), "Falta tarjeta de HTML5 Semántico")
        self.assertTrue(any("accesibilidad" in t or "aria" in t for t in titulos), "Falta tarjeta de Accesibilidad / ARIA")
        self.assertTrue(any("web storage" in t or "localstorage" in t for t in titulos), "Falta tarjeta de Web Storage")

        # 5. Python y Backend
        self.assertTrue(any("mutabilidad" in t or "operadores 'is'" in t for t in titulos), "Falta tarjeta de Mutabilidad en Python")
        self.assertTrue(any("yield" in t or "generador" in t for t in titulos), "Falta tarjeta de Generadores en Python")
        self.assertTrue(any("pydantic" in t for t in titulos), "Falta tarjeta de Pydantic")
        # 6. Bases de Datos y SQL
        self.assertTrue(any("b-tree" in t or "índice" in t for t in titulos), "Falta tarjeta de Índices B-Tree")
        self.assertTrue(any("acid" in t for t in titulos), "Falta tarjeta de ACID")
        self.assertTrue(any("joins" in t or "join" in t for t in titulos), "Falta tarjeta de JOINs")
        # 7. DevOps y Cloud
        self.assertTrue(any("docker" in t for t in titulos), "Falta tarjeta de Docker")
        self.assertTrue(any("kubernetes" in t or "pod" in t for t in titulos), "Falta tarjeta de Kubernetes")
        self.assertTrue(any("ci/cd" in t or "pipeline" in t for t in titulos), "Falta tarjeta de CI/CD")
        # 8. Seguridad y OWASP
        self.assertTrue(any("inyección sql" in t or "sqli" in t for t in titulos), "Falta tarjeta de SQL Injection")
        self.assertTrue(any("xss" in t or "cross-site scripting" in t for t in titulos), "Falta tarjeta de XSS")
        self.assertTrue(any("jwt" in t or "json web token" in t for t in titulos), "Falta tarjeta de JWT")
        # 9. Git y Control de Versiones
        self.assertTrue(any("blobs" in t or "dag" in t for t in titulos), "Falta tarjeta de Objetos Git")
        self.assertTrue(any("cherry-pick" in t for t in titulos), "Falta tarjeta de Git Cherry-Pick")
        self.assertTrue(any("bisect" in t for t in titulos), "Falta tarjeta de Git Bisect")

    def test_04_hexagonal_info(self):
        res = self.client.get("/api/hexagonal-info")
        self.assertEqual(res.status_code, 200)
        hex_data = res.json()
        self.assertIn("layers", hex_data)
        layer_ids = [l["id"] for l in hex_data["layers"]]
        self.assertIn("domain", layer_ids)
        self.assertIn("ports", layer_ids)
        self.assertIn("adapters", layer_ids)

    def test_05_create_custom_card(self):
        payload = {
            "title": "Clean Architecture de Robert C. Martin",
            "category": "Arquitectura Hexagonal",
            "question": "¿Cuál es la Regla de Dependencia en Clean Architecture?",
            "definition": "Las dependencias de código fuente solo pueden apuntar hacia adentro, hacia las políticas de nivel superior.",
            "analogy": "Una cebolla: puedes quitar las capas exteriores sin dañar el centro.",
            "code_example": "# Dependencia hacia adentro\nfrom domain.entities import User",
            "key_takeaway": "El código externo depende del interno; el centro nunca conoce el exterior.",
            "difficulty": "Avanzado"
        }
        res = self.client.post("/api/cards", json=payload)
        self.assertEqual(res.status_code, 200)
        created = res.json()
        self.assertEqual(created["title"], payload["title"])
        self.assertEqual(created["box"], 1)

    def test_06_explain_analogy(self):
        payload = {
            "concept_title": "Árbol Binario de Búsqueda",
            "definition": "Estructura de datos jerárquica donde el hijo izquierdo es menor y el derecho mayor."
        }
        res = self.client.post("/api/explain-analogy", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("analogy", data)
        self.assertGreater(len(data["analogy"]), 10)

    def test_07_generate_ai_card(self):
        payload = {
            "topic": "Microservicios vs Monolito",
            "category": "Arquitectura Hexagonal",
            "level": "Intermedio"
        }
        res = self.client.post("/api/generate-ai", json=payload)
        self.assertEqual(res.status_code, 200)
        card = res.json()
        self.assertEqual(card["category"], "Arquitectura Hexagonal")
        self.assertTrue(len(card["definition"]) > 10)
        self.assertTrue(len(card["analogy"]) > 10)

    def test_08_leitner_progress(self):
        cards = self.client.get("/api/cards").json()
        first_id = cards[0]["id"]
        
        # Calificar como dominado (caja 3)
        res = self.client.post(f"/api/cards/{first_id}/progress", json={"is_correct": True})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["box"], [2, 3])
        
        # Calificar como difícil (debe volver a caja 1)
        res2 = self.client.post(f"/api/cards/{first_id}/progress", json={"is_correct": False})
        self.assertEqual(res2.status_code, 200)
        data2 = res2.json()
        self.assertEqual(data2["box"], 1)

    def test_09_export_deck(self):
        """RF-11: Verificar exportación de mazo a JSON descargable."""
        res = self.client.get("/api/export")
        self.assertEqual(res.status_code, 200)
        self.assertIn("application/json", res.headers.get("content-type", ""))
        self.assertIn("attachment; filename=devcards_deck.json", res.headers.get("content-disposition", ""))
        data = res.json()
        self.assertEqual(data.get("app"), "DevCards AI")
        self.assertGreaterEqual(data.get("total_cards", 0), 40)
        self.assertIsInstance(data.get("cards"), list)

    def test_10_import_deck(self):
        """RF-11: Verificar importación de tarjetas personalizadas."""
        test_import_payload = {
            "cards": [
                {
                    "title": "CQRS (Command Query Responsibility Segregation)",
                    "category": "Arquitectura Hexagonal",
                    "difficulty": "Avanzado",
                    "question": "¿Qué separa el patrón CQRS?",
                    "definition": "Separa los modelos de lectura (Queries) de los modelos de escritura (Commands) para optimizar rendimiento y escalabilidad.",
                    "analogy": "Un periódico: los periodistas que escriben las noticias (Commands) usan un sistema distinto al que usan los lectores para leerlo (Queries)."
                }
            ]
        }
        res = self.client.post("/api/import", json=test_import_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertGreaterEqual(data.get("total_cards", 0), 40)

    def test_11_subject_filtering(self):
        """Verifica que el filtrado por materias (Java, IA, Angular, TypeScript, HTML) funcione correctamente."""
        # 1. Filtrado por IA
        res_ia = self.client.get("/api/cards?category=IA")
        self.assertEqual(res_ia.status_code, 200)
        cards_ia = res_ia.json()
        self.assertGreaterEqual(len(cards_ia), 15, "Debe retornar al menos 15 tarjetas de IA")
        for c in cards_ia:
            self.assertTrue(c.get("category") == "Inteligencia Artificial" or c.get("id", "").startswith("ia-"))

        # 2. Filtrado por Angular
        res_ng = self.client.get("/api/cards?category=Angular")
        self.assertEqual(res_ng.status_code, 200)
        cards_ng = res_ng.json()
        self.assertGreaterEqual(len(cards_ng), 15, "Debe retornar al menos 15 tarjetas de Angular")
        for c in cards_ng:
            self.assertTrue(c.get("category") == "Angular" or c.get("id", "").startswith("ng-"))

        # 3. Filtrado por TypeScript
        res_ts = self.client.get("/api/cards?category=TypeScript")
        self.assertEqual(res_ts.status_code, 200)
        cards_ts = res_ts.json()
        self.assertGreaterEqual(len(cards_ts), 15, "Debe retornar al menos 15 tarjetas de TypeScript")
        for c in cards_ts:
            self.assertTrue(c.get("category") == "TypeScript" or c.get("id", "").startswith("ts-"))

        # 4. Filtrado por HTML
        res_html = self.client.get("/api/cards?category=HTML")
        self.assertEqual(res_html.status_code, 200)
        cards_html = res_html.json()
        self.assertGreaterEqual(len(cards_html), 15, "Debe retornar al menos 15 tarjetas de HTML y Web")
        for c in cards_html:
            self.assertTrue(c.get("category") == "HTML y Web" or c.get("id", "").startswith("html-"))

        # 5. Filtrado por Java (Completo)
        res_java = self.client.get("/api/cards?category=Java")
        self.assertEqual(res_java.status_code, 200)
        cards_java = res_java.json()
        self.assertGreaterEqual(len(cards_java), 100, "Debe retornar más de 100 tarjetas del ecosistema Java")

        # 6. Filtrado por Python y Backend
        res_py = self.client.get("/api/cards?category=Python")
        self.assertEqual(res_py.status_code, 200)
        cards_py = res_py.json()
        self.assertGreaterEqual(len(cards_py), 14, "Debe retornar al menos 14 tarjetas de Python")
        for c in cards_py:
            self.assertTrue(c.get("category") == "Python y Backend" or c.get("id", "").startswith("py-"))

        # 7. Filtrado por Bases de Datos y SQL
        res_db = self.client.get("/api/cards?category=Bases de Datos")
        self.assertEqual(res_db.status_code, 200)
        cards_db = res_db.json()
        self.assertGreaterEqual(len(cards_db), 14, "Debe retornar al menos 14 tarjetas de Bases de Datos")
        for c in cards_db:
            self.assertTrue(c.get("category") == "Bases de Datos y SQL" or c.get("id", "").startswith("db-"))

        # 8. Filtrado por DevOps y Cloud
        res_ops = self.client.get("/api/cards?category=DevOps")
        self.assertEqual(res_ops.status_code, 200)
        cards_ops = res_ops.json()
        self.assertGreaterEqual(len(cards_ops), 14, "Debe retornar al menos 14 tarjetas de DevOps")
        for c in cards_ops:
            self.assertTrue(c.get("category") == "DevOps y Cloud" or c.get("id", "").startswith("ops-"))

        # 9. Filtrado por Seguridad y OWASP
        res_sec = self.client.get("/api/cards?category=Seguridad")
        self.assertEqual(res_sec.status_code, 200)
        cards_sec = res_sec.json()
        self.assertGreaterEqual(len(cards_sec), 12, "Debe retornar al menos 12 tarjetas de Seguridad")
        for c in cards_sec:
            self.assertTrue(c.get("category") == "Seguridad y OWASP" or c.get("id", "").startswith("sec-"))

        # 10. Filtrado por Git y Control de Versiones
        res_git = self.client.get("/api/cards?category=Git")
        self.assertEqual(res_git.status_code, 200)
        cards_git = res_git.json()
        self.assertGreaterEqual(len(cards_git), 12, "Debe retornar al menos 12 tarjetas de Git")
        for c in cards_git:
            self.assertTrue(c.get("category") == "Git y Control de Versiones" or c.get("id", "").startswith("git-"))

if __name__ == "__main__":
    unittest.main()
