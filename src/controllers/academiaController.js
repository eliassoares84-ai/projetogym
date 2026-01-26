const prisma = require('../config/database');
const bcrypt = require('bcryptjs');

// GET Dashboard - Informações da Academia
exports.getDashboard = async (req, res) => {
  try {
    const { academiaId } = req.user;

    const academia = await prisma.academia.findUnique({
      where: { id: academiaId },
      include: {
        usuarios: {
          where: { role: 'ALUNO' },
          select: { id: true, nome: true, email: true, xp: true, nivel: true }
        }
      }
    });

    if (!academia) {
      return res.status(404).json({ erro: 'Academia não encontrada' });
    }

    const totalAlunos = await prisma.user.count({
      where: { academiaId, role: 'ALUNO' }
    });

    const totalProfessores = await prisma.user.count({
      where: { academiaId, role: 'PROFESSOR' }
    });

    res.json({
      academia: {
        id: academia.id,
        nome: academia.nome,
        plano: academia.plano,
        telefone: academia.telefone,
        endereco: academia.endereco,
        descricao: academia.descricao,
        logoUrl: academia.logoUrl
      },
      estatisticas: {
        totalAlunos,
        totalProfessores,
        alunosTop: academia.usuarios.slice(0, 5)
      }
    });
  } catch (erro) {
    console.error('Erro no dashboard:', erro);
    res.status(500).json({ erro: 'Erro ao buscar dashboard' });
  }
};

// GET Alunos da Academia
exports.getAlunos = async (req, res) => {
  try {
    const { academiaId } = req.user;

    const alunos = await prisma.user.findMany({
      where: { academiaId, role: 'ALUNO' },
      select: { id: true, nome: true, email: true, xp: true, nivel: true, createdAt: true }
    });

    res.json({ alunos });
  } catch (erro) {
    console.error('Erro ao listar alunos:', erro);
    res.status(500).json({ erro: 'Erro ao listar alunos' });
  }
};

// POST Criar Aluno
exports.criarAluno = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { nome, email, senha = 'aluno123' } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }

    // Verificar se email já existe
    const emailExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExistente) {
      return res.status(400).json({ erro: 'Email já registrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoAluno = await prisma.user.create({
      data: {
        nome,
        email,
        password: senhaHash,
        role: 'ALUNO',
        academiaId
      },
      select: { id: true, nome: true, email: true, xp: true, nivel: true }
    });

    res.status(201).json({
      mensagem: 'Aluno criado com sucesso',
      aluno: novoAluno
    });
  } catch (erro) {
    console.error('Erro ao criar aluno:', erro);
    res.status(500).json({ erro: 'Erro ao criar aluno' });
  }
};

// PUT Atualizar Aluno
exports.atualizarAluno = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;
    const { nome, email } = req.body;

    // Verificar se aluno existe e pertence à academia
    const aluno = await prisma.user.findFirst({
      where: { id, academiaId, role: 'ALUNO' }
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    // Se alterar email, verificar se já existe
    if (email && email !== aluno.email) {
      const emailExistente = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExistente) {
        return res.status(400).json({ erro: 'Email já registrado' });
      }
    }

    const atualizacoes = {};
    if (nome) atualizacoes.nome = nome;
    if (email) atualizacoes.email = email;

    const alunoAtualizado = await prisma.user.update({
      where: { id },
      data: atualizacoes,
      select: { id: true, nome: true, email: true, xp: true, nivel: true }
    });

    res.json({
      mensagem: 'Aluno atualizado com sucesso',
      aluno: alunoAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar aluno:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar aluno' });
  }
};

// DELETE Deletar Aluno
exports.deletarAluno = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;

    // Verificar se aluno existe e pertence à academia
    const aluno = await prisma.user.findFirst({
      where: { id, academiaId, role: 'ALUNO' }
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ mensagem: 'Aluno deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar aluno:', erro);
    res.status(500).json({ erro: 'Erro ao deletar aluno' });
  }
};

// GET Professores da Academia
exports.getProfessores = async (req, res) => {
  try {
    const { academiaId } = req.user;

    const professores = await prisma.user.findMany({
      where: { academiaId, role: 'PROFESSOR' },
      select: { 
        id: true, 
        nome: true, 
        email: true, 
        createdAt: true
      }
    });

    res.json({ professores });
  } catch (erro) {
    console.error('Erro ao listar professores:', erro);
    res.status(500).json({ erro: 'Erro ao listar professores' });
  }
};

// POST Criar Professor (Convidar)
exports.criarProfessor = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
    }

    // Verificar se email já existe
    const emailExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (emailExistente) {
      return res.status(400).json({ erro: 'Email já registrado' });
    }

    // Gerar senha temporária
    const senhaTemporaria = Math.random().toString(36).slice(-8);
    const senhaHash = await bcrypt.hash(senhaTemporaria, 10);

    const novoProfessor = await prisma.user.create({
      data: {
        nome,
        email,
        password: senhaHash,
        role: 'PROFESSOR',
        academiaId
      },
      select: { id: true, nome: true, email: true }
    });

    res.status(201).json({
      mensagem: 'Professor criado com sucesso',
      professor: novoProfessor,
      senhaTemporaria: senhaTemporaria,
      aviso: 'Compartilhe a senha temporária com o professor'
    });
  } catch (erro) {
    console.error('Erro ao criar professor:', erro);
    res.status(500).json({ erro: 'Erro ao criar professor' });
  }
};

// PUT Atualizar Professor
exports.atualizarProfessor = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;
    const { nome, email } = req.body;

    // Verificar se professor existe e pertence à academia
    const professor = await prisma.user.findFirst({
      where: { id, academiaId, role: 'PROFESSOR' }
    });

    if (!professor) {
      return res.status(404).json({ erro: 'Professor não encontrado' });
    }

    // Se alterar email, verificar se já existe
    if (email && email !== professor.email) {
      const emailExistente = await prisma.user.findUnique({
        where: { email }
      });
      if (emailExistente) {
        return res.status(400).json({ erro: 'Email já registrado' });
      }
    }

    const atualizacoes = {};
    if (nome) atualizacoes.nome = nome;
    if (email) atualizacoes.email = email;

    const professorAtualizado = await prisma.user.update({
      where: { id },
      data: atualizacoes,
      select: { id: true, nome: true, email: true }
    });

    res.json({
      mensagem: 'Professor atualizado com sucesso',
      professor: professorAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar professor:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar professor' });
  }
};

// DELETE Deletar Professor
exports.deletarProfessor = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;

    // Verificar se professor existe e pertence à academia
    const professor = await prisma.user.findFirst({
      where: { id, academiaId, role: 'PROFESSOR' }
    });

    if (!professor) {
      return res.status(404).json({ erro: 'Professor não encontrado' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ mensagem: 'Professor deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar professor:', erro);
    res.status(500).json({ erro: 'Erro ao deletar professor' });
  }
};

// PUT Atualizar Academia
exports.atualizarAcademia = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { nome, descricao, telefone, endereco, logoUrl } = req.body;

    const atualizacoes = {};
    if (nome) atualizacoes.nome = nome;
    if (descricao !== undefined) atualizacoes.descricao = descricao;
    if (telefone) atualizacoes.telefone = telefone;
    if (endereco) atualizacoes.endereco = endereco;
    if (logoUrl) atualizacoes.logoUrl = logoUrl;

    const academiaAtualizada = await prisma.academia.update({
      where: { id: academiaId },
      data: atualizacoes
    });

    res.json({
      mensagem: 'Academia atualizada com sucesso',
      academia: academiaAtualizada
    });
  } catch (erro) {
    console.error('Erro ao atualizar academia:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar academia' });
  }
};

// PUT Atualizar Plano
exports.atualizarPlano = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { plano } = req.body;

    if (!['BASICO', 'PROFISSIONAL', 'PRO'].includes(plano)) {
      return res.status(400).json({ erro: 'Plano inválido' });
    }

    const academia = await prisma.academia.update({
      where: { id: academiaId },
      data: { plano }
    });

    res.json({
      mensagem: 'Plano atualizado com sucesso',
      academia
    });
  } catch (erro) {
    console.error('Erro ao atualizar plano:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar plano' });
  }
};
