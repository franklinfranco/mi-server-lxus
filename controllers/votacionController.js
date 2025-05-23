// backend/controllers/votacionController.js

const db = require('../db');
const jwt = require('jsonwebtoken');

const votar = async (req, res) => {
  try {
    // Verificar token y obtener ID del jurado
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.rol !== 'jurado') {
      return res.status(403).json({ mensaje: 'Solo los jurados pueden votar' });
    }

    const jurado_id = decoded.id;
    const { puntaje } = req.body;

    // Obtener presentación activa
    const result = await db.query(`
      SELECT id AS presentacion_id, usuario_id AS participante_id
      FROM presentaciones
      WHERE estado = 'activo'
      LIMIT 1
    `);

    if (result.rowCount === 0) {
      return res.status(400).json({ mensaje: 'No hay participante activo' });
    }

    const { presentacion_id, participante_id } = result.rows[0];

    // Insertar voto
    await db.query(
      `INSERT INTO votaciones (jurado_id, participante_id, presentacion_id, puntaje)
        VALUES ($1, $2, $3, $4)`,
      [jurado_id, participante_id, presentacion_id, puntaje]
    );

    // Verificar si todos los jurados ya votaron por esta presentación
    const jurados = await db.query(`SELECT COUNT(*) FROM usuarios WHERE rol = 'jurado'`);
    const votos = await db.query(`
      SELECT COUNT(*)
      FROM votaciones
      WHERE presentacion_id = $1
    `, [presentacion_id]);

    const totalJurados = parseInt(jurados.rows[0].count);
    const totalVotos = parseInt(votos.rows[0].count);

    if (totalJurados === totalVotos) {
      // Marcar presentación actual como finalizada
      await db.query(`
        UPDATE presentaciones
        SET estado = 'finalizado'
        WHERE id = $1
      `, [presentacion_id]);

      // Activar la siguiente presentación (por orden)
      await db.query(`
        UPDATE presentaciones
        SET estado = 'activo'
        WHERE estado = 'pendiente'
        ORDER BY orden ASC
        LIMIT 1
      `);
    }

    res.json({ mensaje: 'Voto registrado correctamente' });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ mensaje: 'Ya votaste por este participante' });
    }

    console.error('Error al votar:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};


const obtenerVotacionesPorPresentacion = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query(
      `SELECT
        v.jurado_id,
        u.nombre AS nombre_jurado,
        u.foto AS foto_jurado,
        v.puntaje
      FROM votaciones v
      JOIN usuarios u ON u.id = v.jurado_id
      WHERE v.presentacion_id = $1
      ORDER BY u.id`,
      [id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener votaciones:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


// Exporta SOLO las funciones que maneja este controlador
module.exports = { votar, obtenerVotacionesPorPresentacion };