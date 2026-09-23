"""
Launcher oficial de DevCards AI
Plataforma de Tarjetas de Aprendizaje y Repaso de Conceptos de Programación & Arquitectura Hexagonal
"""

import sys
import os
import webbrowser
import threading
import time
import requests
import uvicorn

# Asegurar que el directorio raíz del proyecto esté en sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

def check_ollama_status():
    try:
        r = requests.get("http://localhost:11434/api/tags", timeout=1.5)
        if r.status_code == 200:
            models = [m.get("name") for m in r.json().get("models", [])]
            print(f"[*] Ollama detectado localmente: ONLINE (Modelos: {', '.join(models) if models else 'Sin modelos'})")
            return True
    except Exception:
        pass
    print("[i] Ollama local no responde en localhost:11434.")
    print("    -> No te preocupes: DevCards AI cuenta con un Generador Sintético Experto incorporado")
    print("    -> Si deseas IA local con Ollama: 'ollama run qwen2.5:1.5b' o 'ollama run llama3.2'")
    return False

def open_browser():
    time.sleep(1.2)
    url = "http://localhost:8000"
    print(f"[*] Abriendo navegador en {url} ...")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[!] No se pudo abrir automáticamente el navegador: {e}")

if __name__ == "__main__":
    print("=" * 70)
    print("    🧠 DEVCARDS AI - PLATAFORMA DE REPASO & ARQUITECTURA HEXAGONAL")
    print("    Gobernado por la Fábrica de Software Agéntica OKF v0.2")
    print("=" * 70)
    
    check_ollama_status()
    
    # Iniciar apertura automática del navegador en segundo plano
    threading.Thread(target=open_browser, daemon=True).start()
    
    print("\n🚀 Servidor web listo en: http://localhost:8000")
    print("Presiona CTRL+C para detener el servidor.\n")
    
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False, log_level="info")
