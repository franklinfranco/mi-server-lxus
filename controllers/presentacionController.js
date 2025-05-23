const db = require('../db');

// ✅ Crea una presentación individual (opcional si usas ordenamiento masivo)
const crearPresentacion = async (req, res) => {
  const { usuario_id, fecha, orden } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM usuarios WHERE id = $1 AND rol = $2',
      [usuario_id, 'participante']
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Participante no encontrado o inválido' });
    }

    await db.query(
      'INSERT INTO presentaciones (usuario_id, fecha, orden) VALUES ($1, $2, $3)',
      [usuario_id, fecha, orden]
    );

    res.status(201).json({ mensaje: 'Presentación creada exitosamente' });
  } catch (error) {
    console.error('Error al crear presentación:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// ✅ Activa una presentación (y marca otras como finalizadas o pendientes)
const activarPresentacion = async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await db.query('SELECT * FROM presentaciones WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'Presentación no encontrada' });
    }

    await db.query(`UPDATE presentaciones SET estado = 'pendiente'`); // resetea estados
    await db.query(`UPDATE presentaciones SET estado = 'activo' WHERE id = $1`, [id]);

    res.json({ mensaje: 'Participante activado correctamente' });
  } catch (error) {
    console.error('Error al activar presentación:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

// ✅ Guarda el orden completo desde React en la tabla `presentaciones`
const guardarOrdenPresentacion = async (req, res) => {
  const { orden } = req.body;

  if (!Array.isArray(orden)) {
    return res.status(400).json({ mensaje: 'El orden debe ser un arreglo de IDs de usuarios.' });
  }

  try {
    // Elimina presentaciones existentes
    await db.query('DELETE FROM presentaciones');

    const fechaHoy = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    for (let i = 0; i < orden.length; i++) {
      const usuario_id = orden[i];

      await db.query(
        `INSERT INTO presentaciones (usuario_id, fecha, orden, ya_canto, estado)
         VALUES ($1, $2, $3, false, 'pendiente')`,
        [usuario_id, fechaHoy, i + 1]
      );
    }

    // ✅ Activar la primera presentación automáticamente (orden = 1)
    await db.query(`
      UPDATE presentaciones 
      SET estado = 'activo' 
      WHERE orden = 1
    `);

    res.status(200).json({ mensaje: 'Orden de presentación guardado y primera presentación activada.' });
  } catch (error) {
    console.error('Error al guardar orden de presentación:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al guardar el orden.' });
  }
};

// ✅ Consulta todas las presentaciones ordenadas por 'orden'
const obtenerPresentacionesOrdenadas = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT p.id, p.usuario_id, u.nombre, u.foto, p.orden, p.fecha, p.ya_canto
      FROM presentaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.orden ASC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener presentaciones ordenadas:', error);
    res.status(500).json({ mensaje: 'Error al obtener las presentaciones' });
  }
};

// ✅ controlador: controllers/presentacionController.js

const obtenerParticipantesYOrden = async (req, res) => {
  try {
    const usuarios = await db.query(`
      SELECT id, nombre, foto
      FROM usuarios
      WHERE rol = 'participante'
    `);

    const presentaciones = await db.query(`
      SELECT id, usuario_id
      FROM presentaciones
      ORDER BY orden ASC
    `);

    res.json({
      participantes: usuarios.rows,
      orden: presentaciones.rows.map(p => p.usuario_id),
    });
  } catch (error) {
    console.error('Error al obtener participantes y orden:', error);
    res.status(500).json({ mensaje: 'Error al obtener datos' });
  }
};

const obtenerPresentacionActual = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.id, p.orden, u.nombre AS nombre_participante, u.foto
      FROM presentaciones p
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE p.ya_canto = false
      ORDER BY p.fecha ASC, p.orden ASC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay presentaciones activas' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener presentación actual:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// ✅ Finaliza la presentación actual y activa la siguiente
const finalizarPresentacion = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Marcar la presentación actual como finalizada
    await db.query(`
      UPDATE presentaciones
      SET ya_canto = true, estado = 'finalizado'
      WHERE id = $1
    `, [id]);

    // 2. Buscar la siguiente presentación (ya_canto = false)
    const siguiente = await db.query(`
      SELECT id
      FROM presentaciones
      WHERE ya_canto = false
      ORDER BY orden ASC
      LIMIT 1
    `);

    if (siguiente.rows.length > 0) {
      const siguienteId = siguiente.rows[0].id;

      // Activar la siguiente presentación
      await db.query(`
        UPDATE presentaciones
        SET estado = 'activo'
        WHERE id = $1
      `, [siguienteId]);
    }

    res.json({ mensaje: 'Presentación finalizada correctamente' });
  } catch (error) {
    console.error('Error al finalizar presentación:', error);
    res.status(500).json({ mensaje: 'Error al finalizar presentación' });
  }
};

// Activa el siguiente participante en la fila
const activarSiguienteParticipante = async (req, res) => {
  try {
    const siguiente = await db.query(`
      SELECT * FROM presentaciones
      WHERE ya_canto = false
      ORDER BY orden ASC
      LIMIT 1
    `);

    if (siguiente.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay más participantes disponibles' });
    }

    const { id, usuario_id } = siguiente.rows[0];

    await db.query(`UPDATE presentaciones SET estado = 'pendiente'`);
    await db.query(`UPDATE presentaciones SET estado = 'activo' WHERE id = $1`, [id]);

    const participante = await db.query('SELECT nombre FROM usuarios WHERE id = $1', [usuario_id]);

    res.json({ mensaje: 'Participante activado correctamente', nombre_participante: participante.rows[0].nombre });
  } catch (error) {
    console.error('Error al activar siguiente participante:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const finalizarPresentacionActual = async (req, res) => {
  try {
    const actual = await db.query(`
      SELECT * FROM presentaciones
      WHERE estado = 'activo'
      LIMIT 1
    `);

    if (actual.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay participante activo actualmente' });
    }

    await db.query(`
      UPDATE presentaciones
      SET estado = 'finalizado', ya_canto = true
      WHERE id = $1
    `, [actual.rows[0].id]);

    res.json({ mensaje: 'Presentación finalizada correctamente' });
  } catch (error) {
    console.error('Error al finalizar presentación:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const obtenerResultadosTotales = async (req, res) => {
  try {
    const resultados = await db.query(`
      SELECT
        u.id AS id_participante,       -- ✅ Usar u.id para el ID del participante
        u.nombre AS nombre_participante, -- ✅ Usar u.nombre para el nombre
        u.foto AS foto_participante,     -- ✅ Usar u.foto para la foto
        COALESCE(SUM(v.puntaje), 0) AS total_puntaje
      FROM
        usuarios u                    -- ✅ Unir con la tabla 'usuarios' directamente
      LEFT JOIN
        presentaciones pres ON u.id = pres.usuario_id -- Relación usuario_id en presentaciones
      LEFT JOIN
        votaciones v ON pres.id = v.presentacion_id
      WHERE
        u.rol = 'participante'        -- ✅ Filtrar solo por usuarios con rol 'participante'
      GROUP BY
        u.id, u.nombre, u.foto
      ORDER BY
        total_puntaje DESC;
    `);

    res.json(resultados.rows);
  } catch (error) {
    console.error('Error al obtener resultados totales:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al obtener resultados.' });
  }
};


module.exports = {
  crearPresentacion,
  activarPresentacion,
  guardarOrdenPresentacion,
  obtenerPresentacionesOrdenadas,
  obtenerParticipantesYOrden, // ✅ AGREGA ESTO
obtenerPresentacionActual, // 👈 ¡agrégala aquí!
 finalizarPresentacion,
  activarSiguienteParticipante,
  finalizarPresentacionActual,
  obtenerResultadosTotales,
};