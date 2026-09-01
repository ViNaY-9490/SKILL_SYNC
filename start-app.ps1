# SkillSync Platform - Local Prototype Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    SkillSync Academia-Industry Platform (Local)" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting SkillSync API (NestJS) on http://localhost:4000..." -ForegroundColor Yellow
Write-Host "Starting SkillSync Web (Next.js) on http://localhost:3000..." -ForegroundColor Yellow
Write-Host "AI Provider set to Ollama / Local fallback" -ForegroundColor Magenta
Write-Host ""

Set-Location -Path $PSScriptRoot
npm run dev
