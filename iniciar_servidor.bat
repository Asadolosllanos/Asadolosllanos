@echo off
echo ===================================================
echo Iniciando Servidor Local Seguro para Asados Web...
echo ===================================================
echo Por favor, NO CIERRES esta ventana negra mientras estes trabajando.
echo.
echo Tu pagina se abrira automaticamente en tu navegador web.
echo.
start http://localhost:8080
npx serve -p 8080
pause
