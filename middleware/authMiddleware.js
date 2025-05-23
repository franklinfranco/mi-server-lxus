const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guardamos el payload del token (id y rol)
    next();
  } catch (error) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Middleware para permitir solo jurados
const soloJurado = (req, res, next) => {
  if (req.usuario.rol !== 'jurado') {
    return res.status(403).json({ mensaje: 'Acceso solo para jurados' });
  }
  next();
};

// Middleware para permitir solo participantes
const soloParticipante = (req, res, next) => {
  if (req.usuario.rol !== 'participante') {
    return res.status(403).json({ mensaje: 'Acceso solo para participantes' });
  }
  next();
};

module.exports = {
  verificarToken,
  soloJurado,
  soloParticipante
};
