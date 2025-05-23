const express = require('express');
const { obtenerParticipantes } = require('../controllers/usuarioController');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

//router.get('/participantes', verificarToken, obtenerParticipantes); // 👈 ESTA LÍNEA ES CLAVE
router.get('/participantes', obtenerParticipantes); // 👈 ESTA LÍNEA ES CLAVE

module.exports = router;
