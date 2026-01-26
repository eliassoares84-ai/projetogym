#!/bin/bash
set -e

echo "🔧 Iniciando setup de produção..."

echo "📦 Step 1: Gerando Prisma Client..."
npx prisma generate

echo "🗄️  Step 2: Rodando migrations..."
npx prisma migrate deploy --skip-generate

echo "🌱 Step 3: Fazendo seed do usuário..."
node scripts/seed-production.js

echo "✅ Setup concluído!"
