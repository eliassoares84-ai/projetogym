#!/bin/bash
# Script para resetar o banco e fazer seed forçado

cd "c:\Users\admin\Desktop\projeto-fitness - antes do ERP\projeto-fitness-backend"

echo "🔧 Resetando banco de dados no Railway..."
# Faz push e força reset (apaga tudo!)
npx prisma db push --force-reset --skip-generate

echo "✅ Banco resetado!"
echo ""
echo "Agora o próximo deploy do Railway vai rodar o seed automaticamente."
echo "Ou execute: npm run seed:prod"
