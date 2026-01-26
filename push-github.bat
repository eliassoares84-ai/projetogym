@echo off
cd /d "c:\Users\admin\Desktop\projeto-fitness - antes do ERP\projeto-fitness-backend"
echo === Configurando GitHub ===
git init
git remote add origin https://github.com/eliassoares84-ai/projetogym.git
git add .
git commit -m "feat: backend fitness app with Prisma + PostgreSQL"
git branch -M main
echo === Fazendo push para GitHub ===
git push -u origin main
pause
