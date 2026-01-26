# Setup GitHub e Railway para ProjetoGym

Write-Host "=== Setup ProjetoGym Backend ===" -ForegroundColor Cyan

# 1. Verificar se package.json está correto
Write-Host "`n1. Verificando package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($packageJson.scripts.build -eq "prisma generate") {
    Write-Host "   ✓ Build script correto (sem migrate)" -ForegroundColor Green
} else {
    Write-Host "   ✗ Build script incorreto!" -ForegroundColor Red
    exit 1
}

# 2. Criar .gitignore se não existir
Write-Host "`n2. Configurando .gitignore..." -ForegroundColor Yellow
if (-not (Test-Path ".gitignore")) {
    @"
node_modules/
.env
.env.local
dist/
*.log
.DS_Store
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "   ✓ .gitignore criado" -ForegroundColor Green
} else {
    Write-Host "   ✓ .gitignore já existe" -ForegroundColor Green
}

# 3. Inicializar Git se necessário
Write-Host "`n3. Configurando Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "   ✓ Git inicializado" -ForegroundColor Green
} else {
    Write-Host "   ✓ Git já inicializado" -ForegroundColor Green
}

# 4. Adicionar remote do GitHub
Write-Host "`n4. Qual é o SEU usuário do GitHub?" -ForegroundColor Yellow
Write-Host "   (Exemplo: eliasbusatto)" -ForegroundColor Gray
$githubUser = Read-Host "   Usuário"

$remoteUrl = "https://github.com/$githubUser/projetogym.git"
Write-Host "`n   Adicionando remote: $remoteUrl" -ForegroundColor Gray

try {
    git remote add origin $remoteUrl 2>$null
    Write-Host "   ✓ Remote adicionado" -ForegroundColor Green
} catch {
    # Remote já existe, atualizar
    git remote set-url origin $remoteUrl
    Write-Host "   ✓ Remote atualizado" -ForegroundColor Green
}

# 5. Fazer commit inicial
Write-Host "`n5. Fazendo commit..." -ForegroundColor Yellow
git add -A
git commit -m "feat: backend fitness app with Prisma + PostgreSQL" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Commit criado" -ForegroundColor Green
} else {
    Write-Host "   ✓ Nada para commitar (já commitado)" -ForegroundColor Green
}

# 6. Renomear branch para main
Write-Host "`n6. Configurando branch main..." -ForegroundColor Yellow
git branch -M main
Write-Host "   ✓ Branch renomeada para main" -ForegroundColor Green

# 7. Push para GitHub
Write-Host "`n7. Fazendo push para GitHub..." -ForegroundColor Yellow
Write-Host "   (Pode pedir suas credenciais do GitHub)" -ForegroundColor Gray
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n   ✓ Push concluído com sucesso!" -ForegroundColor Green
    Write-Host "`n=== PRÓXIMO PASSO ===" -ForegroundColor Cyan
    Write-Host "1. Vá para Railway: https://railway.com/project/0bca987f-3e7d-408e-89ac-b93731caf21b" -ForegroundColor White
    Write-Host "2. Clique em 'ProjectGym Legado' → Settings" -ForegroundColor White
    Write-Host "3. Em 'Source', clique 'Connect Repo'" -ForegroundColor White
    Write-Host "4. Selecione: $githubUser/projetogym" -ForegroundColor White
    Write-Host "5. Branch: main" -ForegroundColor White
    Write-Host "6. Railway fará redeploy automático do GitHub!" -ForegroundColor White
} else {
    Write-Host "`n   ✗ Erro no push. Verifique suas credenciais." -ForegroundColor Red
    Write-Host "   Repositório: $remoteUrl" -ForegroundColor Gray
}
