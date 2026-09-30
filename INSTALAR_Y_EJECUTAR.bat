@echo off
chcp 65001 > nul
title DevCards AI - Instalador y Ejecutor Automático

echo ======================================================================
echo    DEVCARDS AI - Instalador Automático y Ejecutor 1-Click
echo ======================================================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python no está instalado en este equipo.
    echo Puedes descargarlo gratis desde https://www.python.org/downloads/
    echo Asegúrate de marcar la casilla "Add Python to PATH" durante la instalación.
    echo.
    echo Presiona cualquier tecla para abrir DevCards en Modo Web Autónomo sin Python...
    pause > nul
    start "" "docs\index.html"
    exit /b 0
)

if not exist ".venv" (
    echo [*] Creando entorno virtual aislado (.venv)...
    python -m venv .venv
)

echo [*] Activando entorno virtual e instalando librerías...
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ======================================================================
echo [OK] Instalación completada con éxito.
echo ======================================================================
echo [*] Iniciando DevCards AI...
python run_devcards.py
pause
