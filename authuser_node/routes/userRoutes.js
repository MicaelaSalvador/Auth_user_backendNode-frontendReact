const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener un usuario por ID
router.get("/:id", verifyToken, isAdmin, getUserById);

// Actualizar un usuario
router.put("/:id", verifyToken, isAdmin, updateUser);

// Eliminar un usuario
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;
