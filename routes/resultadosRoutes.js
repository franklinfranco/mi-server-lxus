// routes/resultadosRoutes.js
const express = require('express');
const router = express.Router();
const { verificarToken, soloParticipante } = require('../middleware/authMiddleware');
const { obtenerResultadosPorSemana } = require('../controllers/resultadosController');

// Solo participantes pueden acceder a sus resultados
router.get('/', verificarToken, soloParticipante, obtenerResultadosPorSemana);

module.exports = router;
