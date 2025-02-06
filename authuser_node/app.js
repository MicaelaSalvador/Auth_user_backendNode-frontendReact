const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes"); // Importa las rutas de usuarios
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());

// Configuración CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Permite solicitudes solo desde tu frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
  })
);

// Conectar a la base de datos
connectDB();

// Definir las rutas
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

// Inicia el servidor
app.listen(3000, () => {
  console.log("Servidor en ejecución en el puerto 3000");
});
