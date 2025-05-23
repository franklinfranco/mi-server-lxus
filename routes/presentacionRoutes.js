const express = require('express');
const router = express.Router();

const {
  crearPresentacion,
  activarPresentacion,
  guardarOrdenPresentacion,
  obtenerPresentacionesOrdenadas,
  obtenerParticipantesYOrden,
  obtenerPresentacionActual,
  activarSiguienteParticipante,
  finalizarPresentacionActual,
  finalizarPresentacion,
  obtenerResultadosTotales, // 👉 Agregado aquí
} = require('../controllers/presentacionController');

// Crear nueva presentación
router.post('/', crearPresentacion);

// Activar presentación por ID
router.put('/activar/:id', activarPresentacion);

// Finalizar presentación por ID
router.put('/finalizar/:id', finalizarPresentacion);

// Guardar orden de presentación
router.post('/ordenar', guardarOrdenPresentacion);

// Obtener presentaciones ordenadas
router.get('/ordenadas', obtenerPresentacionesOrdenadas);

// Obtener todos los participantes y su orden
router.get('/completo', obtenerParticipantesYOrden);

// Obtener presentación actual activa
router.get('/actual', obtenerPresentacionActual);

// Activar siguiente presentación
router.post('/activar-siguiente', activarSiguienteParticipante);

// Finalizar presentación actual
router.post('/finalizar-actual', finalizarPresentacionActual);

router.get('/resultados-totales', obtenerResultadosTotales);


// Exportar rutas
module.exports = router;
