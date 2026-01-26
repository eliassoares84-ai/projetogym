const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

// Perfil e dados do usuário
router.get('/user/profile', authenticateToken, userController.getProfile);
router.get('/gamificacao/points', authenticateToken, userController.getPoints);
router.get('/medidas/latest', authenticateToken, userController.getLatestMeasure);

// Planos de treino do aluno logado
router.get('/aluno/planos-treino', authenticateToken, userController.getMeusPlanos);

module.exports = router;
