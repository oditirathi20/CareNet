# Start All Services Script
# This will open multiple terminal windows for each service

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Healthcare DApp Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Get-Location

Write-Host "This will open 3 new terminal windows:" -ForegroundColor Yellow
Write-Host "1. Hardhat Node (Blockchain)" -ForegroundColor Cyan
Write-Host "2. AI Backend Server" -ForegroundColor Cyan
Write-Host "3. React Frontend" -ForegroundColor Cyan
Write-Host ""

# Check if OpenAI key is set
if (Test-Path "server/.env") {
    $envContent = Get-Content "server/.env" -Raw
    if ($envContent -match "OPENAI_API_KEY=your_openai_api_key_here") {
        Write-Host "⚠ WARNING: OPENAI_API_KEY not set in server/.env" -ForegroundColor Yellow
        Write-Host "AI analysis will not work without a valid API key!" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "⚠ WARNING: server/.env file not found!" -ForegroundColor Yellow
    Write-Host "Please run setup.ps1 first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting services in 3 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Start Hardhat Node
Write-Host "Starting Hardhat Node..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\contracts'; Write-Host 'Hardhat Blockchain Node' -ForegroundColor Green; npx hardhat node"

# Wait a bit for the node to start
Start-Sleep -Seconds 5

# Deploy contract
Write-Host "Deploying smart contract..." -ForegroundColor Cyan
Set-Location contracts
npx hardhat run scripts/deploy.js --network localhost
Set-Location ..

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Contract deployment failed!" -ForegroundColor Red
    exit 1
}

# Start AI Backend
Write-Host "Starting AI Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\server'; Write-Host 'AI Backend Server' -ForegroundColor Green; npm start"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "Starting React Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'React Frontend' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services started! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "- Blockchain: http://localhost:8545" -ForegroundColor Cyan
Write-Host "- AI Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000 (will open automatically)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop services" -ForegroundColor Yellow
