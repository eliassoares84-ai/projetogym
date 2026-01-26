const bcrypt = require('bcryptjs');

// Testar se o hash de 'senha123' funciona
async function testPassword() {
  const senhaPlana = 'senha123';
  const senhaHash = await bcrypt.hash(senhaPlana, 10);
  
  console.log('Senha plana:', senhaPlana);
  console.log('Senha hash:', senhaHash);
  
  const valida = await bcrypt.compare(senhaPlana, senhaHash);
  console.log('Comparação válida?', valida);
  
  // Testa também com um hash fixo (da produção anterior)
  const hashFixo = '$2a$10$k1d2b3c4e5f6g7h8i9j0k1d2b3c4e5f6g7h8i9j0';
  const validaFixo = await bcrypt.compare(senhaPlana, hashFixo);
  console.log('Comparação com hash fixo?', validaFixo);
}

testPassword();
