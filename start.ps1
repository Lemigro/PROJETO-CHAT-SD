# Script PowerShell para iniciar o projeto Chat SD
# Uso: .\start.ps1

Write-Host "🚀 Iniciando Projeto Chat SD..." -ForegroundColor Green
Write-Host ""

# Verificar se o Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js não encontrado. Por favor, instale o Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se as dependências estão instaladas
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "api-server\node_modules")) {
    Write-Host "📦 Instalando dependências do api-server..." -ForegroundColor Yellow
    Set-Location api-server
    npm install
    Set-Location ..
}

# Verificar se o concurrently está instalado na raiz
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências da raiz..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 Iniciando servidores (Backend + API Server)..." -ForegroundColor Cyan
Write-Host "   - Backend WebSocket: ws://localhost:8080" -ForegroundColor Gray
Write-Host "   - API Server: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para servir o frontend, abra outro terminal e execute:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   python -m http.server 8000" -ForegroundColor Gray
Write-Host "   ou" -ForegroundColor Gray
Write-Host "   npx http-server -p 8000" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Lembre-se de alterar o WebSocket no script.js para ws://localhost:8080" -ForegroundColor Yellow
Write-Host ""

# Iniciar os servidores
npm run start:all

