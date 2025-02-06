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
      "Content-Type": "application/json",
    },
  };
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}/roles`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los roles."
    );
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/roles/${id}`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener el rol."
    );
  }
};

export const createRole = async (roleName) => {
  try {
    const response = await axios.post(
      `${API_URL}/roles`,
      { roleName },
      getHeaders()
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el rol.");
  }
};

// Función para actualizar un rol
export const updateRole = async (id, roleName) => {
  try {
    const response = await axios.put(
      `${API_URL}/roles/${id}`,
      { roleName }, // Body de la solicitud
      getHeaders() // Headers con el token
    );
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el rol."
    );
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/roles/${id}`, getHeaders());
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el rol."
    );
  }
};
