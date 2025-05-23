const pool = require('../db/index.js');

const obtenerParticipantes = async (req, res) => {
  try {
    const resultado = await pool.query("SELECT id, nombre, email, foto FROM usuarios WHERE rol = 'participante'");
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener participantes', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

module.exports = {
  obtenerParticipantes
};
