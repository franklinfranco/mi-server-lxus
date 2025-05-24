const { Pool } = require('pg');
require('dotenv').config();

// Objeto de configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};

// Solo añade la configuración SSL si la aplicación NO está en desarrollo local,
// o si una variable específica (como NODE_ENV) lo indica.
// Una forma común es basarse en process.env.NODE_ENV
// Render establece NODE_ENV automáticamente a 'production'.
// Localmente, NODE_ENV es undefined o 'development'.

if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  // También podrías usar una variable de entorno que solo Render tenga,
  // como process.env.RENDER (que Render establece automáticamente a 'true')
  dbConfig.ssl = {
    rejectUnauthorized: false
  };
} else {
    // Opcional: para desarrollo local, puedes configurar ssl: false
    // si tu base de datos local NO soporta o NO requiere SSL.
    // dbConfig.ssl = false; // O simplemente no incluir la propiedad ssl
}

const pool = new Pool(dbConfig);

module.exports = pool;