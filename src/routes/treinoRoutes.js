const express = require('express');
const router = express.Router();
const treinoController = require('../controllers/treinoController');
const authenticateToken = require('../middlewares/authMiddleware');

// Exercícios
router.get('/academia/exercicios', authenticateToken, treinoController.getExercicios);
router.post('/academia/exercicios', authenticateToken, treinoController.criarExercicio);

// Planos de Treino
router.get('/academia/planos-treino', authenticateToken, treinoController.getPlanosTreino);
router.get('/academia/alunos/:alunoId/planos-treino', authenticateToken, treinoController.getPlanosAlunoTreino);
router.post('/academia/planos-treino', authenticateToken, treinoController.criarPlanoTreino);
router.put('/academia/planos-treino/:id', authenticateToken, treinoController.atualizarPlanoTreino);
router.delete('/academia/planos-treino/:id', authenticateToken, treinoController.deletarPlanoTreino);

// Treino completado (app do aluno)
router.post('/treino/completado', authenticateToken, treinoController.registrarTreinoCompletado);

module.exports = router;
