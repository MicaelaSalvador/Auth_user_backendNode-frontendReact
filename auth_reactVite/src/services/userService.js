import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Función para obtener los headers con el token
const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No se encontró un token de autenticación.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los usuarios."
    );
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener el usuario."
    );
  }
};

export const updateUser = async (id, userData) => {
  try {
    console.log("ID recibido en updateUser:", id); // Depuración
    console.log("URL de la solicitud:", `${API_URL}/users/${id}`); // Depuración
    console.log("Datos enviados al backend:", userData); // Depuración
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      userData,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el usuario."
    );
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el usuario."
    );
  }
};
