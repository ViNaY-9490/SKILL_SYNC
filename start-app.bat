@echo off
title SkillSync Platform - Local Prototype Launcher
cls
echo ===================================================
echo     SkillSync Academia-Industry Platform (Local)
echo ===================================================
echo.
echo Starting SkillSync API (NestJS) and Web (Next.js)...
echo API: http://localhost:4000
echo Web: http://localhost:3000
echo.
cd /d "%~dp0"
npm run dev
pause
