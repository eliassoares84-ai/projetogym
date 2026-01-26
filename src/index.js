require('dotenv').config();
const app = require('./server');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

const PORT = process.env.PORT || 3001;

// Run migrations on startup (Railway compatible)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProdution() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'dono@fitnesspro.com' }
    });

    if (existingUser) {
      console.log('✓ Usuário de produção já existe');
      await seedExerciciosPadrao();
      return;
    }

    // Create academy
    const academia = await prisma.academia.upsert({
      where: { email: 'fitnesspro@example.com' },
      update: {},
      create: {
        nome: 'Fitness Pro',
        email: 'fitnesspro@example.com',
        telefone: '11987654321',
        endereco: 'Rua Principal, 123',
        descricao: 'Academia de Fitness Premium',
        plano: 'PRO',
      },
    });

    // Create dono user
    const senhaHash = await bcrypt.hash('senha123', 10);
    await prisma.user.create({
      data: {
        email: 'dono@fitnesspro.com',
        password: senhaHash,
        nome: 'Dono Academia',
        role: 'DONO_ACADEMIA',
        academiaId: academia.id,
      },
    });

    console.log('✓ Usuário de produção criado (dono@fitnesspro.com)');
    
    // Seed exercícios padrão
    await seedExerciciosPadrao();
  } catch (erro) {
    console.error('⚠ Seed error:', erro.message);
  }
}

async function seedExerciciosPadrao() {
  try {
    const academia = await prisma.academia.findUnique({
      where: { email: 'fitnesspro@example.com' }
    });

    if (!academia) return;

    // Verifica se já existem exercícios
    const count = await prisma.exercicio.count({
      where: { academiaId: academia.id }
    });

    if (count > 0) {
      console.log(`✓ Academia já possui ${count} exercícios`);
      return;
    }

    const exercicios = [
      // Peito
      { nome: 'Supino Reto', descricao: 'Exercício fundamental para peito', musculosTrabalhados: 'Peito, Tríceps, Ombro Anterior' },
      { nome: 'Supino Inclinado', descricao: 'Foca na porção superior do peito', musculosTrabalhados: 'Peito Superior, Ombro Anterior' },
      { nome: 'Fly no Pec Deck', descricao: 'Isolamento de peito', musculosTrabalhados: 'Peito' },
      
      // Costas
      { nome: 'Rosca Direta', descricao: 'Exercício fundamental para costas', musculosTrabalhados: 'Costas, Bíceps' },
      { nome: 'Puxada Frontal', descricao: 'Trabalha largura das costas', musculosTrabalhados: 'Costas Larga, Bíceps' },
      { nome: 'Remada Curvada', descricao: 'Força e espessura de costas', musculosTrabalhados: 'Costas, Bíceps' },
      
      // Ombro
      { nome: 'Desenvolvimento Militar', descricao: 'Exercício composto para ombro', musculosTrabalhados: 'Ombro, Tríceps' },
      { nome: 'Elevação Lateral', descricao: 'Isolamento lateral de ombro', musculosTrabalhados: 'Ombro Médio' },
      { nome: 'Elevação Frontal', descricao: 'Foca na porção anterior do ombro', musculosTrabalhados: 'Ombro Anterior' },
      
      // Braço
      { nome: 'Rosca Direta com Barra', descricao: 'Exercício principal para bíceps', musculosTrabalhados: 'Bíceps' },
      { nome: 'Rosca Scott', descricao: 'Isolamento de bíceps', musculosTrabalhados: 'Bíceps' },
      { nome: 'Tríceps Corda', descricao: 'Exercício de isolamento para tríceps', musculosTrabalhados: 'Tríceps' },
      { nome: 'Mergulho', descricao: 'Exercício composto para tríceps e peito', musculosTrabalhados: 'Tríceps, Peito' },
      
      // Perna
      { nome: 'Agachamento Livre', descricao: 'Exercício fundamental para perna', musculosTrabalhados: 'Quadríceps, Glúteo, Posterior da Coxa' },
      { nome: 'Leg Press', descricao: 'Exercício composto na máquina', musculosTrabalhados: 'Quadríceps, Glúteo' },
      { nome: 'Leg Curl', descricao: 'Isolamento de posterior da coxa', musculosTrabalhados: 'Posterior da Coxa, Bíceps Femoral' },
      { nome: 'Extensão de Perna', descricao: 'Isolamento de quadríceps', musculosTrabalhados: 'Quadríceps' },
      { nome: 'Supino de Perna', descricao: 'Força para quadríceps e glúteo', musculosTrabalhados: 'Quadríceps, Glúteo, Posterior' },
      
      // Core
      { nome: 'Abdominal na Máquina', descricao: 'Trabalha reto abdominal', musculosTrabalhados: 'Abdômen' },
      { nome: 'Prancha', descricao: 'Exercício isométrico para core', musculosTrabalhados: 'Core, Abdômen' },
      { nome: 'Rosca Abdominal', descricao: 'Flexão do tronco', musculosTrabalhados: 'Abdômen' },
    ];

    await prisma.exercicio.createMany({
      data: exercicios.map(ex => ({
        ...ex,
        academiaId: academia.id
      }))
    });

    console.log(`✓ ${exercicios.length} exercícios padrão criados`);
  } catch (erro) {
    console.error('⚠ Erro ao criar exercícios:', erro.message);
  }
}

async function startServer() {
  try {
    console.log('📦 Sincronizando schema com banco de dados...');
    // Use db push with force reset for production (all data will be lost)
    try {
      if (process.env.NODE_ENV === 'production') {
        execSync('npx prisma db push --skip-generate --force-reset', { stdio: 'inherit' });
      } else {
        execSync('npx prisma db push --skip-generate', { stdio: 'inherit' });
      }
    } catch (e) {
      console.log('⚠ db push warning:', e.message.substring(0, 100));
    }
    
    // Test database connection
    await prisma.$executeRawUnsafe('SELECT 1');
    console.log('✓ Database connection successful');
    
    // Run seed in production
    if (process.env.NODE_ENV === 'production') {
      await seedProdution();
    }
    
    app.listen(PORT, () => {
      console.log(`✓ Servidor rodando na porta ${PORT}`);
      console.log(`✓ Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
