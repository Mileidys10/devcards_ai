@echo off
chcp 65001 > nul
title DevCards AI - Modo Web Autónomo Inmediato

echo ======================================================================
echo    DEVCARDS AI - Plataforma de Repaso Nemotécnico & Arquitectura
echo ======================================================================
echo.
echo [i] Abriendo DevCards AI directamente en tu navegador predeterminado...
echo [i] Modo: Autónomo Offline (1,295 flashcards interactivas cargadas)
echo.

if exist "docs\index.html" (
    start "" "docs\index.html"
) else if exist "app\static\index.html" (
    start "" "app\static\index.html"
) else (
    echo [ERROR] No se encontró el archivo index.html.
    pause
    exit /b 1
)

echo [OK] DevCards AI iniciado con éxito en tu navegador.
timeout /t 3 > nul
exit /b 0
