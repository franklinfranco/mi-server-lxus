// controllers/resultadosController.js
const db = require('../db');

const obtenerResultadosPorSemana = async (req, res) => {
  const participanteId = req.usuario.id;

  try {
    const resultados = await db.query(`
      SELECT
        semana,
        AVG(v.puntaje) AS promedio,
        COUNT(v.id) AS total_votos
      FROM votaciones v
      INNER JOIN presentaciones p ON v.presentacion_id = p.id
      WHERE p.usuario_id = $1
      GROUP BY semana
      ORDER BY semana ASC
    `, [participanteId]);

    res.json(resultados.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los resultados' });
  }
};

module.exports = {
  obtenerResultadosPorSemana
};
