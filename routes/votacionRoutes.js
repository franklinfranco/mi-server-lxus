// backend/routes/votacionRoutes.js

const express = require('express');
const router = express.Router();
// Importa SOLO las funciones necesarias del controlador de votaciones
const { votar, obtenerVotacionesPorPresentacion } = require('../controllers/votacionController');
const { verificarToken, soloJurado } = require('../middleware/authMiddleware');

// Solo jurados pueden acceder a esta ruta para votar
router.post('/', verificarToken, soloJurado, votar);

// Ruta para obtener votaciones por presentación específica
router.get('/por-presentacion/:id', obtenerVotacionesPorPresentacion);

// ---
// ❌ ¡IMPORTANTE! REMOVER la ruta de resultados totales de aquí:
// router.get('/presentaciones/resultados-totales', obtenerResultadosTotales);
// ---

module.exports = router;