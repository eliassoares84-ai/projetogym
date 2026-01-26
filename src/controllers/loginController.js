const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { academia: true }
    });

    if (!user) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, academiaId: user.academiaId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token: `Bearer ${token}`,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
        academia: user.academia
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};
