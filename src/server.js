const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const loginRoutes = require('./routes/loginRoutes');
const academiaRoutes = require('./routes/academiaRoutes');
const treinoRoutes = require('./routes/treinoRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1', loginRoutes);
app.use('/api/v1', academiaRoutes);
app.use('/api/v1', treinoRoutes);
app.use('/api/v1', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    app: 'Projeto Fitness API',
    status: 'online',
    version: '1.0.0',
    docs: '/api/v1/login'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    mensagem: err.message 
  });
});

module.exports = app;
