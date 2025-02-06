import axios from "axios";
import jwtDecode from "jwt-decode"; // Necesitas instalar esta librería: npm install jwt-decode

const API_URL = import.meta.env.VITE_API_URL;

// Iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // Almacena el token en localStorage
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus credenciales."
    );
  }
};

// Registrar usuario
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al registrar el usuario."
    );
  }
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem("token");
};

// Obtener el token almacenado
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró un token de autenticación.");
  }
  return token;
};

// Obtener el rol del usuario desde el token
export const getUserRole = () => {
  try {
    const token = getToken();
    const decodedToken = jwtDecode(token);
    return decodedToken.roleName; // Asegúrate de que "roleName" coincide con la estructura del backend
  } catch (error) {
    console.log(error);
    throw new Error(
      "Error al decodificar el token o no contiene información de roles."
    );
  }
};

// Obtener la información completa del usuario desde el token
export const getUserInfo = () => {
  try {
    const token = getToken();
    const decodedToken = jwtDecode(token);
    return decodedToken; // Retorna toda la información almacenada en el token
  } catch (error) {
    console.log(error);
    throw new Error("Error al decodificar el token.");
  }
};
