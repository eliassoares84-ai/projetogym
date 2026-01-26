const express = require('express');
const router = express.Router();
const academiaController = require('../controllers/academiaController');
const authenticateToken = require('../middlewares/authMiddleware');

// Dashboard
router.get('/academia/dashboard', authenticateToken, academiaController.getDashboard);

// Alunos - CRUD
router.get('/academia/alunos', authenticateToken, academiaController.getAlunos);
router.post('/academia/alunos', authenticateToken, academiaController.criarAluno);
router.put('/academia/alunos/:id', authenticateToken, academiaController.atualizarAluno);
router.delete('/academia/alunos/:id', authenticateToken, academiaController.deletarAluno);

// Professores - CRUD
router.get('/academia/professores', authenticateToken, academiaController.getProfessores);
router.post('/academia/professores', authenticateToken, academiaController.criarProfessor);
router.put('/academia/professores/:id', authenticateToken, academiaController.atualizarProfessor);
router.delete('/academia/professores/:id', authenticateToken, academiaController.deletarProfessor);

// Academia Settings
router.put('/academia/atualizar', authenticateToken, academiaController.atualizarAcademia);
router.put('/academia/plano', authenticateToken, academiaController.atualizarPlano);

module.exports = router;
