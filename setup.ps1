# Healthcare DApp Quick Start Script
# Run this script to set up all dependencies

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Healthcare DApp - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check npm
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "✓ npm found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install contract dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Installing Smart Contract Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location contracts
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install contracts dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✓ Contract dependencies installed!" -ForegroundColor Green
Write-Host ""

# Install server dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Installing AI Backend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install server dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠ IMPORTANT: Edit server/.env and add your OPENAI_API_KEY!" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Set-Location ..
Write-Host "✓ Server dependencies installed!" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..
Write-Host "✓ Frontend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Done
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit server\.env and add your OPENAI_API_KEY" -ForegroundColor White
Write-Host "2. Open 4 terminals and run:" -ForegroundColor White
Write-Host "   Terminal 1: cd contracts; npx hardhat node" -ForegroundColor White
Write-Host "   Terminal 2: cd contracts; npx hardhat run scripts\deploy.js --network localhost" -ForegroundColor White
Write-Host "   Terminal 3: cd server; npm start" -ForegroundColor White
Write-Host "   Terminal 4: cd frontend; npm start" -ForegroundColor White
Write-Host ""
Write-Host "Read README.md for complete instructions!" -ForegroundColor Cyan
