@echo off
chcp 65001 > nul
title DevCards AI - Plataforma de Repaso & Arquitectura Hexagonal

echo ======================================================================
echo    DEVCARDS AI - Plataforma Interactiva con IA Local y Repaso
echo ======================================================================
echo.

:: 1. Verificar si Python está instalado
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] No se detectó Python en el sistema o en la variable PATH.
    echo.
    echo ¿Deseas abrir la versión web autónoma sin instalar nada?
    echo [1] Sí, abrir DevCards en el navegador de inmediato
    echo [2] Salir
    set /p opcion="Elige una opción [1 o 2]: "
    if "%opcion%"=="1" (
        start "" "docs\index.html"
        exit /b 0
    )
    exit /b 1
)

:: 2. Verificar dependencias mínimas (uvicorn, fastapi, requests)
python -c "import fastapi, uvicorn, requests" >nul 2>nul
if %errorlevel% neq 0 (
    echo [i] Detectamos que faltan dependencias de Python. Instalando requisitos...
    python -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo.
        echo [!] Hubo un inconveniente instalando las dependencias.
        echo [i] Abriendo versión web autónoma de respaldo...
        start "" "docs\index.html"
        pause
        exit /b 1
    )
)

echo [*] Iniciando servidor web y abriendo interfaz...
python run_devcards.py
pause
