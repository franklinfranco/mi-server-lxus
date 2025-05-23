const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario con imagen desde URL (Cloudinary)
const registrar = async (req, res) => {
  const { nombre, email, contrasena, rol, foto } = req.body;

  if (!nombre || !email || !contrasena || !rol || !foto) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, contrasena, rol, foto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, email, hash, rol, foto]
    );

    const usuario = result.rows[0];

    // Insertar en tabla según rol
    if (rol === 'jurado') {
      await db.query('INSERT INTO jurados (usuario_id) VALUES ($1)', [usuario.id]);
    } else if (rol === 'participante') {
      await db.query('INSERT INTO participantes (usuario_id) VALUES ($1)', [usuario.id]);
    }

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar' });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rowCount === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const usuario = result.rows[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!match) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        foto: usuario.foto
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = { registrar, login };
