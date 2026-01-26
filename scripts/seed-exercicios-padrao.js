const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const EXERCICIOS_PADRAO = [
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

async function seedExercicios() {
  try {
    // Busca a primeira academia ou a academia de teste
    const academia = await prisma.academia.findFirst({
      where: { email: 'fitnesspro@example.com' }
    });

    if (!academia) {
      console.log('⚠️ Academia não encontrada. Crie a academia primeiro.');
      return;
    }

    // Verifica se já existem exercícios
    const exerciciosExistentes = await prisma.exercicio.count({
      where: { academiaId: academia.id }
    });

    if (exerciciosExistentes > 0) {
      console.log(`✓ Academia já possui ${exerciciosExistentes} exercícios`);
      return;
    }

    // Cria exercícios padrão
    const exerciciosCriados = await prisma.exercicio.createMany({
      data: EXERCICIOS_PADRAO.map(ex => ({
        ...ex,
        academiaId: academia.id
      }))
    });

    console.log(`✓ ${exerciciosCriados.count} exercícios padrão criados`);
  } catch (erro) {
    console.error('❌ Erro ao criar exercícios:', erro.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedExercicios();
