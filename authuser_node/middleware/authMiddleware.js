// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// // Verificar si el token  es valido.
// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(403).json({ message: 'Acceso denegado. No se encontró el token.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token no válido' });
//   }
// };

// // Verificar si el usuario es administrador
// const isAdmin = (req, res, next) => {
//   if (req.user.roleId !== 1) { // Asumiendo que el roleId '1' es el de administrador
//     return res.status(403).json({ message: 'Acceso denegado. No eres administrador.' });
//   }
//   next();
// };

// module.exports = { verifyToken, isAdmin };



const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verificar si el token es válido
// const verifyToken = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(403).json({ message: 'Acceso denegado. No se encontró el token.' });
//   }

//   try {
//     // Verificar el token y agregar el payload decodificado al request
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;  // Decodificamos el token y lo guardamos en req.user
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token no válido' });
//   }
// };

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Eliminamos 'Bearer ' del token

  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado. No se encontró el token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Decodificamos el token y lo guardamos en req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};

// Verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user.roleName !== 'Admin') {  // Comprobamos roleName en lugar de roleId
    return res.status(403).json({ message: 'Acceso denegado. No eres administrador.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };

