const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de produção...');

  try {
    // Criar Academia
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

    console.log('✅ Academia criada:', academia.id);

    // Criar usuário DONO
    const senhaHash = await bcrypt.hash('senha123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'dono@fitnesspro.com' },
      update: {},
      create: {
        email: 'dono@fitnesspro.com',
        password: senhaHash,
        nome: 'Dono Academia',
        role: 'DONO_ACADEMIA',
        academiaId: academia.id,
      },
    });

    console.log('✅ Usuário DONO criado:', user.id);
    console.log('📧 Email:', user.email);
    console.log('🔐 Senha: senha123');

    console.log('\n✨ Seed concluído com sucesso!');
    console.log('Você pode fazer login agora com:');
    console.log('  Email: dono@fitnesspro.com');
    console.log('  Senha: senha123');

  } catch (erro) {
    console.error('❌ Erro:', erro.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
