
@echo off
title INICIANDO LOREAI
color 0B

echo.
echo ==================================
echo       INICIANDO LOREAI
echo ==================================
echo.

:: Comprobar Ollama
echo [1/3] Comprobando inteligencia artificial...

powershell -NoProfile -Command "try { $null = Invoke-RestMethod 'http://127.0.0.1:11434/api/tags' -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1

if errorlevel 1 (
    echo Iniciando Ollama...
    start "Ollama - LoreAI" /min cmd /c "ollama serve"
    timeout /t 5 /nobreak >nul
) else (
    echo Ollama ya esta funcionando.
)

:: Iniciar Backend
echo.
echo [2/3] Iniciando Backend...

start "LoreAI - Backend" cmd /k "cd /d "%~dp0Backend" && node server.js"

timeout /t 2 /nobreak >nul

:: Iniciar Frontend
echo.
echo [3/3] Iniciando Frontend...

start "LoreAI - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ==================================
echo       LOREAI EN PROCESO
echo ==================================
echo.
echo Espera a que Vite indique que esta listo.
echo Abre http://localhost:5173
echo.
pause
