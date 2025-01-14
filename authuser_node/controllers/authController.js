const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');
require('dotenv').config();

// Registro de usuarios
// const register = async (req, res) => {
//   const { username, password, roleName } = req.body;

//   if (!username || !password || !roleName) {
//     return res.status(400).json({ message: 'Todos los campos son obligatorios' });
//   }

//   try {
//     // Buscar el RoleID correspondiente al roleName
//     const roleResult = await sql.query`
//       SELECT RoleID FROM Roles WHERE RoleName = ${roleName}
//     `;
//     const role = roleResult.recordset[0];

//     if (!role) {
//       return res.status(400).json({ message: 'El rol proporcionado no existe' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insertar el nuevo usuario en la tabla Usuarios
//     await sql.query`
//       INSERT INTO Usuarios (Username, PasswordHash, RoleID)
//       VALUES (${username}, ${hashedPassword}, ${role.RoleID})
//     `;
//     res.status(201).json({ message: 'Usuario registrado exitosamente' });
//   } catch (err) {
//     console.error('Error en el registro:', err.message);
//     res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
//   }
// };
const register = async (req, res) => {
  const { username, email, password, roleName } = req.body;

  if (!username || !email || !password || !roleName) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Buscar el RoleID correspondiente al roleName
    const roleResult = await sql.query`
      SELECT RoleID FROM Roles WHERE RoleName = ${roleName}
    `;
    const role = roleResult.recordset[0];

    if (!role) {
      return res.status(400).json({ message: 'El rol proporcionado no existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la tabla Usuarios
    await sql.query`
      INSERT INTO Usuarios (Username, Email, PasswordHash, RoleID)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role.RoleID})
    `;
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en el registro:', err.message);
    res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
  }
};


// Login de usuarios
// const login = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Todos los campos son obligatorios' });
//   }

//   try {
//     const result = await sql.query`SELECT * FROM Usuarios WHERE Username = ${username}`;
//     if (result.recordset.length === 0) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     const user = result.recordset[0];
//     const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Credenciales incorrectas' });
//     }

//     const token = jwt.sign(
//       { userId: user.UserID, username: user.Username, roleId: user.RoleID },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );

//     res.status(200).json({ message: 'Inicio de sesión exitoso', token });
//   } catch (err) {
//     console.error('Error en el inicio de sesión:', err.message);
//     res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
//   }
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Todos los campos son obligatorios' });
//   }

//   try {
//     // Buscar al usuario por el nombre de usuario
//     const userResult = await sql.query`SELECT * FROM Usuarios WHERE Username = ${username}`;
//     if (userResult.recordset.length === 0) {
//       return res.status(404).json({ message: 'Usuario no encontrado' });
//     }

//     const user = userResult.recordset[0];

//     // Verificar la contraseña
//     const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Credenciales incorrectas' });
//     }

//     // Obtener el nombre del rol del usuario
//     const roleResult = await sql.query`SELECT RoleName FROM Roles WHERE RoleID = ${user.RoleID}`;
//     if (roleResult.recordset.length === 0) {
//       return res.status(404).json({ message: 'Rol no encontrado para el usuario' });
//     }

//     const roleName = roleResult.recordset[0].RoleName;

//     // Generar el token con el nombre del rol
//     const token = jwt.sign(
//       { userId: user.UserID, username: user.Username, roleName },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRATION }
//     );

//     res.status(200).json({ message: 'Inicio de sesión exitoso', token });
//   } catch (err) {
//     console.error('Error en el inicio de sesión:', err.message);
//     res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
//   }
// };
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Buscar al usuario por email
    const userResult = await sql.query`SELECT * FROM Usuarios WHERE Email = ${email}`;
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userResult.recordset[0];

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Obtener el nombre del rol del usuario
    const roleResult = await sql.query`SELECT RoleName FROM Roles WHERE RoleID = ${user.RoleID}`;
    if (roleResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Rol no encontrado para el usuario' });
    }

    const roleName = roleResult.recordset[0].RoleName;

    // Generar el token con el nombre del rol
    const token = jwt.sign(
      { userId: user.UserID, email: user.Email, roleName },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    console.error('Error en el inicio de sesión:', err.message);
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};


module.exports = { register, login };
