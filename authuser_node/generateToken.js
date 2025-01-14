require('dotenv').config(); // Asegúrate de que dotenv esté cargado

const jwt = require('jsonwebtoken');

// Generar el token
const token = jwt.sign(
  { userId: 1, email: 'micaela@gmail.com', roleName: 'Admin' },
  process.env.JWT_SECRET,  // Usa la clave secreta desde el archivo .env
  { expiresIn: '1h' } // Expiración de 1 hora
);

console.log(token); // Muestra el token generado en la consola
