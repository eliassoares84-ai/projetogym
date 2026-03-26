const prisma = require('../config/database');

// GET Exercícios da Academia
exports.getExercicios = async (req, res) => {
  try {
    const { academiaId } = req.user;

    const exercicios = await prisma.exercicio.findMany({
      where: { academiaId },
      select: { 
        id: true, 
        nome: true, 
        descricao: true,
        musculosTrabalhados: true
      }
    });

    res.json({ exercicios });
  } catch (erro) {
    console.error('Erro ao listar exercícios:', erro);
    res.status(500).json({ erro: 'Erro ao listar exercícios' });
  }
};

// POST Criar Exercício
exports.criarExercicio = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { nome, descricao, musculosTrabalhados } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome do exercício é obrigatório' });
    }

    const novoExercicio = await prisma.exercicio.create({
      data: {
        nome,
        descricao: descricao || '',
        musculosTrabalhados: musculosTrabalhados || '',
        academiaId
      },
      select: { 
        id: true, 
        nome: true, 
        descricao: true,
        musculosTrabalhados: true
      }
    });

    res.status(201).json({
      mensagem: 'Exercício criado com sucesso',
      exercicio: novoExercicio
    });
  } catch (erro) {
    console.error('Erro ao criar exercício:', erro);
    res.status(500).json({ erro: 'Erro ao criar exercício' });
  }
};

// GET Planos de Treino da Academia
exports.getPlanosTreino = async (req, res) => {
  try {
    const { academiaId } = req.user;

    const planos = await prisma.planoTreino.findMany({
      where: { academia: { id: academiaId } },
      include: {
        professor: { select: { id: true, nome: true } },
        exercicios: {
          include: {
            exercicio: { select: { id: true, nome: true, musculosTrabalhados: true } }
          }
        }
      }
    });

    res.json({ planos });
  } catch (erro) {
    console.error('Erro ao listar planos:', erro);
    res.status(500).json({ erro: 'Erro ao listar planos' });
  }
};

// GET Planos de Treino de um Aluno
exports.getPlanosAlunoTreino = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { alunoId } = req.params;

    // Verifica se o aluno pertence à academia
    const aluno = await prisma.user.findFirst({
      where: { id: alunoId, academiaId, role: 'ALUNO' }
    });

    if (!aluno) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }

    // Busca planos vinculados ao aluno específico
    const planos = await prisma.planoTreino.findMany({
      where: { 
        academiaId,
        alunoId  // Filtra apenas planos deste aluno
      },
      include: {
        professor: { select: { id: true, nome: true } },
        exercicios: {
          include: {
            exercicio: { select: { id: true, nome: true, musculosTrabalhados: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ planos, aluno: { id: aluno.id, nome: aluno.nome } });
  } catch (erro) {
    console.error('Erro ao listar planos do aluno:', erro);
    res.status(500).json({ erro: 'Erro ao listar planos do aluno' });
  }
};

// POST Criar Plano de Treino
exports.criarPlanoTreino = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { nome, descricao, exercicios, alunoId } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome do plano é obrigatório' });
    }

    // Se alunoId foi fornecido, verifica se o aluno existe e pertence à academia
    if (alunoId) {
      const aluno = await prisma.user.findFirst({
        where: { id: alunoId, academiaId, role: 'ALUNO' }
      });
      if (!aluno) {
        return res.status(404).json({ erro: 'Aluno não encontrado ou não pertence à academia' });
      }
    }

    // Cria o plano
    const novoPlano = await prisma.planoTreino.create({
      data: {
        nome,
        descricao: descricao || '',
        professorId: req.user.id, // Quem criou o plano
        academiaId,
        alunoId: alunoId || null, // Vincula ao aluno específico
        exercicios: {
          createMany: {
            data: (exercicios || []).map((ex) => ({
              exercicioId: ex.exercicioId,
              series: ex.series || 3,
              repeticoes: ex.repeticoes || 12
            }))
          }
        }
      },
      include: {
        professor: { select: { id: true, nome: true } },
        exercicios: {
          include: {
            exercicio: { select: { id: true, nome: true, musculosTrabalhados: true } }
          }
        }
      }
    });

    res.status(201).json({
      mensagem: 'Plano de treino criado com sucesso',
      plano: novoPlano
    });
  } catch (erro) {
    console.error('Erro ao criar plano:', erro);
    res.status(500).json({ erro: 'Erro ao criar plano de treino' });
  }
};

// PUT Atualizar Plano de Treino
exports.atualizarPlanoTreino = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;
    const { nome, descricao, exercicios } = req.body;

    // Verifica se o plano pertence à academia
    const plano = await prisma.planoTreino.findFirst({
      where: { id, academiaId }
    });

    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado' });
    }

    // Atualiza plano
    const planoAtualizado = await prisma.planoTreino.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(descricao !== undefined && { descricao })
      },
      include: {
        professor: { select: { id: true, nome: true } },
        exercicios: {
          include: {
            exercicio: { select: { id: true, nome: true, musculosTrabalhados: true } }
          }
        }
      }
    });

    // Se vieram exercícios, atualiza (deleta e recria)
    if (exercicios && exercicios.length > 0) {
      await prisma.exercicioEmPlano.deleteMany({
        where: { planoId: id }
      });

      await prisma.exercicioEmPlano.createMany({
        data: exercicios.map((ex) => ({
          planoId: id,
          exercicioId: ex.exercicioId,
          series: ex.series || 3,
          repeticoes: ex.repeticoes || 12
        }))
      });
    }

    res.json({
      mensagem: 'Plano atualizado com sucesso',
      plano: planoAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar plano:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar plano' });
  }
};

// DELETE Deletar Plano de Treino
exports.deletarPlanoTreino = async (req, res) => {
  try {
    const { academiaId } = req.user;
    const { id } = req.params;

    // Verifica se o plano pertence à academia
    const plano = await prisma.planoTreino.findFirst({
      where: { id, academiaId }
    });

    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado' });
    }

    // Deleta exercícios associados (cascade via Prisma)
    await prisma.planoTreino.delete({
      where: { id }
    });

    res.json({ mensagem: 'Plano deletado com sucesso' });
  } catch (erro) {
    console.error('Erro ao deletar plano:', erro);
    res.status(500).json({ erro: 'Erro ao deletar plano' });
  }
};

// POST Registrar Treino Completado (app do aluno)
exports.registrarTreinoCompletado = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const PONTOS_POR_TREINO = 50;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: PONTOS_POR_TREINO } },
      select: { xp: true, nivel: true }
    });

    const novoNivel = Math.floor(user.xp / 500) + 1;

    return res.status(200).json({
      treinoCompletadoId: `treino-${Date.now()}`,
      pontosGanhos: PONTOS_POR_TREINO,
      pontosTotal: user.xp,
      streak: {
        streakAtual: 1,
        nivel: novoNivel,
      }
    });
  } catch (erro) {
    console.error('Erro ao registrar treino completado:', erro);
    return res.status(500).json({ erro: 'Erro ao registrar treino' });
  }
};
