const { sql } = require("../config/db");

const getAllRoles = async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Roles`;
    res.status(200).json(result.recordset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los roles", error: error.message });
  }
};

const getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`SELECT * FROM Roles WHERE RoleID = ${id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el rol", error: error.message });
  }
};

const createRole = async (req, res) => {
  const { roleName } = req.body;

  if (!roleName) {
    return res
      .status(400)
      .json({ message: "El nombre del rol es obligatorio" });
  }

  try {
    const existingRole =
      await sql.query`SELECT * FROM Roles WHERE RoleName = ${roleName}`;
    if (existingRole.recordset.length > 0) {
      return res.status(400).json({ message: "El rol ya existe" });
    }

    await sql.query`INSERT INTO Roles (RoleName) VALUES (${roleName})`;
    res.status(201).json({ message: "Rol creado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el rol", error: error.message });
  }
};

//Actualizar Roles
const updateRole = async (req, res) => {
  const { id } = req.params;
  const { roleName } = req.body;

  // Validar que el nombre del rol no esté vacío
  if (!roleName) {
    return res
      .status(400)
      .json({ message: "El nombre del rol es obligatorio" });
  }

  try {
    // Verificar si el rol ya existe
    const existingRole =
      await sql.query`SELECT RoleID FROM Roles WHERE RoleName = ${roleName}`;
    if (existingRole.recordset.length > 0) {
      return res.status(400).json({ message: "El rol ya existe" });
    }

    // Actualizar el rol si no existe un duplicado
    const result =
      await sql.query`UPDATE Roles SET RoleName = ${roleName} WHERE RoleID = ${id}`;

    // Verificar si se actualizó algún registro
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Rol actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el rol:", error); // Log del error
    res
      .status(500)
      .json({ message: "Error al actualizar el rol", error: error.message });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`DELETE FROM Roles WHERE RoleID = ${id}`;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.status(200).json({ message: "Rol eliminado exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el rol", error: error.message });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
