# Quick Deploy Script - Run after Hardhat node is started

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying Healthcare Smart Contract" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "contracts/HealthcareRegistry.sol")) {
    Write-Host "✗ Error: Please run this script from the project root directory!" -ForegroundColor Red
    exit 1
}

Set-Location contracts

Write-Host "Deploying contract to local Hardhat network..." -ForegroundColor Yellow
npx hardhat run scripts/deploy.js --network localhost

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Contract deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Contract artifacts copied to frontend/src/contracts/" -ForegroundColor Green
    Write-Host "You can now start the frontend!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed! Make sure Hardhat node is running." -ForegroundColor Red
    Write-Host "Run: npx hardhat node (in another terminal)" -ForegroundColor Yellow
}

Set-Location ..
