const { sql } = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    // Consulta SQL con JOIN
    const result = await sql.query(`
          SELECT 
              u.UserID, 
              u.Username, 
              u.Email, 
              u.PasswordHash, 
              r.RoleName, 
              u.CreatedAt 
          FROM Usuarios u
          JOIN Roles r ON u.RoleID = r.RoleID
      `);

    // Mapear los resultados a instancias de la clase User
    const users = result.recordset.map(
      (user) =>
        new User(
          user.UserID,
          user.Username,
          user.Email,
          user.PasswordHash,
          user.RoleName, // Ahora incluye RoleName correctamente
          user.CreatedAt // Incluye CreatedAt correctamente
        )
    );

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    // Hacer un JOIN para obtener el nombre del rol
    const result = await sql.query`
      SELECT Usuarios.UserID, Usuarios.Username, Usuarios.Email, Usuarios.PasswordHash, 
             Roles.RoleName, Usuarios.CreatedAt
      FROM Usuarios
      INNER JOIN Roles ON Usuarios.RoleID = Roles.RoleID
      WHERE Usuarios.UserID = ${id}`;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Crear el objeto con roleName en lugar de roleId
    const user = {
      userID: result.recordset[0].UserID,
      username: result.recordset[0].Username,
      email: result.recordset[0].Email,
      passwordHash: result.recordset[0].PasswordHash,
      roleName: result.recordset[0].RoleName, // Aquí definimos roleName como clave
      createdAt: result.recordset[0].CreatedAt,
    };

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: error.message });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { username, email, roleName, password } = req.body;

  if (!username || !email || !roleName) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios excepto la contraseña",
    });
  }

  try {
    // Verificar si el usuario existe
    const result =
      await sql.query`SELECT * FROM dbo.Usuarios WHERE UserID = ${req.params.id}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el username o email ya existen en otro usuario
    const checkExisting = await sql.query`
      SELECT * FROM dbo.Usuarios 
      WHERE (Username = ${username} OR Email = ${email})
      AND UserID != ${req.params.id}
    `;

    if (checkExisting.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Ya  existe este  usuario o email" });
    }

    // Actualizar los datos del usuario
    let hashedPassword = user.PasswordHash; // Mantener la contraseña existente
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10); // Encriptar nueva contraseña si se envía
    }

    await sql.query`
      UPDATE dbo.Usuarios
      SET Username = ${username}, Email = ${email}, RoleID = (SELECT RoleID FROM dbo.Roles WHERE RoleName = ${roleName}), PasswordHash = ${hashedPassword}
      WHERE UserID = ${req.params.id}
    `;

    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res
      .status(500)
      .json({ message: `Error al actualizar usuario: ${error.message}` });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`DELETE FROM Usuarios WHERE UserID = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
