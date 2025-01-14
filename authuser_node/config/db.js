const sql = require('mssql');
require('dotenv').config();

const connectDB = async () => {
  try {
    await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true,  // Si es necesario (para servidores como Azure)
        trustServerCertificate: true,  // Evitar problemas con certificados
      },
    });
    console.log('Conexión a la base de datos establecida.');
  } catch (err) {
    console.error('Error al conectar con la base de datos:', err.message);
    process.exit(1);
  }
};

module.exports = { sql, connectDB };
