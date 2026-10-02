# -*- coding: utf-8 -*-
"""
ingest_book.py - Pipeline Oficial de Ingesta de Libros Técnicos para DevCards AI
Ingeniería de Software - Mileidys Agamez
"""

import sys
import json
import argparse
from pathlib import Path

BASE_DIR = Path(__file__).parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

try:
    import pypdf
except ImportError:
    pypdf = None

from app.models import Flashcard

def inspect_pdf(pdf_path: Path):
    if not pdf_path.exists():
        print(f"[!] Error: El archivo PDF no existe en: {pdf_path}")
        return False
    if not pypdf:
        print("[!] Advertencia: pypdf no está instalado en el entorno.")
        return False
    
    reader = pypdf.PdfReader(str(pdf_path))
    print(f"[*] Libro detectado: {pdf_path.name}")
    print(f"[*] Total de páginas: {len(reader.pages)}")
    return True

def verify_and_report_catalog():
    seed_file = BASE_DIR / "app" / "data" / "seed_cards.json"
    if not seed_file.exists():
        print("[!] No se encontró seed_cards.json")
        return
    
    with open(seed_file, "r", encoding="utf-8") as f:
        cards = json.load(f)
        
    print(f"\n=======================================================")
    print(f"  CATALOGO DE CARDS DEVCARDS AI - REPORTE DE INGESTA")
    print(f"=======================================================")
    print(f"Total de flashcards activas en seed: {len(cards)}")
    
    categories = {}
    for c in cards:
        cat = c.get("category", "Otros")
        categories[cat] = categories.get(cat, 0) + 1
        
    print("\nDistribución por Categorías:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {cat:32}: {count:3} tarjetas")
    print("=======================================================\n")

def main():
    parser = argparse.ArgumentParser(description="Ingesta y verificación de libros para DevCards AI")
    parser.add_argument("--pdf", type=str, default=r"C:\Users\POWER\Downloads\java a fondo.pdf", help="Ruta al PDF")
    parser.add_argument("--verify-only", action="store_true", help="Solo verificar el catálogo actual")
    args = parser.parse_args()

    pdf_file = Path(args.pdf)
    if not args.verify_only:
        inspect_pdf(pdf_file)
        
    verify_and_report_catalog()

if __name__ == "__main__":
    main()
