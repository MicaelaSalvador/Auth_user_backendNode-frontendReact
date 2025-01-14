const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas de usuarios

dotenv.config();
const app = express();

app.use(express.json());

// Conectar a la base de datos
connectDB();

// Definir las rutas
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes); 

// Inicia el servidor
app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});
