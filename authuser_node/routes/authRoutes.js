const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register); // Registro de usuario
router.post("/login", login); // Login de usuario

module.exports = router;
