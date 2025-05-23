// backend/app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const votacionRoutes = require('./routes/votacionRoutes');
const authRoutes = require('./routes/authRoutes');
const presentacionRoutes = require('./routes/presentacionRoutes'); // ✅ Asegúrate que este archivo existe y se usa
const usuarioRoutes = require('./routes/usuarioRoutes');
// const resultadosRoutes = require('./routes/resultadosRoutes'); // ❌ Comentado: No necesitamos un módulo de rutas separado para esto ahora

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/votaciones', votacionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/presentaciones', presentacionRoutes); // ✅ Aquí es donde se montará la nueva ruta de resultados
app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/resultados', resultadosRoutes); // ❌ Comentado: Si ya no se usa, esta línea es redundante y podría causar confusión.

app.get('/', (req, res) => {
  res.send('Servidor del concurso de canto funcionando 🎤');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});