const prisma = require('../config/database');

// GET /user/profile - Dados do perfil do usuário logado
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        xp: true,
        nivel: true
      }
    });

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({
      name: user.nome,
      email: user.email,
      role: user.role,
      xp: user.xp,
      level: user.nivel
    });
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro);
    res.status(500).json({ erro: 'Erro ao buscar perfil do usuário' });
  }
};

// GET /gamificacao/points - Pontos de gamificação do usuário
exports.getPoints = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, nivel: true }
    });

    if (!user) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({
      points: user.xp,
      level: user.nivel
    });
  } catch (erro) {
    console.error('Erro ao buscar pontos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
};

// GET /medidas/latest - Última medida registrada
exports.getLatestMeasure = async (req, res) => {
  try {
    // Por enquanto retorna null já que não temos modelo de medidas implementado
    // TODO: Implementar quando o modelo Medida for criado
    res.json({
      weight: null,
      height: null,
      date: null
    });
  } catch (erro) {
    console.error('Erro ao buscar medidas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar medidas' });
  }
};

// GET /aluno/planos-treino - Planos de treino do aluno logado
exports.getMeusPlanos = async (req, res) => {
  try {
    const userId = req.user.id;

    const planos = await prisma.planoTreino.findMany({
      where: { alunoId: userId },
      include: {
        professor: { select: { id: true, nome: true } },
        exercicios: {
          include: {
            exercicio: { 
              select: { 
                id: true, 
                nome: true, 
                descricao: true,
                musculosTrabalhados: true 
              } 
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ planos });
  } catch (erro) {
    console.error('Erro ao buscar planos do aluno:', erro);
    res.status(500).json({ erro: 'Erro ao buscar planos de treino' });
  }
};
