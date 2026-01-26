const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  try {
    console.log('=== DEBUG: Planos de Treino ===\n');
    
    // Lista todos os planos com alunoId
    const todosPlanos = await prisma.planoTreino.findMany({
      select: {
        id: true,
        nome: true,
        alunoId: true,
        professorId: true,
        academiaId: true
      }
    });
    
    console.log('Total de planos:', todosPlanos.length);
    todosPlanos.forEach(p => {
      console.log(`  - ${p.nome}`);
      console.log(`    alunoId: ${p.alunoId || 'NULL'}`);
      console.log(`    professorId: ${p.professorId}`);
      console.log('');
    });
    
    // Testa query com filtro
    const alunoTestId = 'cmkh5p6rg000p8dxa3erspfre'; // Juarez
    console.log(`\nFiltrando planos do aluno ${alunoTestId}:`);
    const planosFiltrados = await prisma.planoTreino.findMany({
      where: {
        alunoId: alunoTestId
      },
      select: {
        id: true,
        nome: true
      }
    });
    
    console.log('Resultado:', planosFiltrados.length, 'plano(s)');
    planosFiltrados.forEach(p => console.log(`  - ${p.nome}`));
    
  } catch (erro) {
    console.error('Erro:', erro);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
