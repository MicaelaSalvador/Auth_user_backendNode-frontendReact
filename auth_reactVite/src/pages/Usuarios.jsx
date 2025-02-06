import { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../services/userService";
import { Table, Button } from "react-bootstrap";
import {
  Box,
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import ModalActualizarUsuario from "../components/modals/ModalActualizarUsuario";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Obtener todos los usuarios al cargar la página
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Función para verificar el rol del usuario y abrir el modal si es Admin
  const handleOpenModal = (user) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró un token de autenticación.",
      });
      return;
    }

    // Decodificar el token para obtener el rol del usuario
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userRole = decodedToken.roleName;

    if (userRole === "Admin") {
      setSelectedUser(user);
      setIsModalOpen(true);
    } else {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes los permisos necesarios para realizar dicha acción.",
      });
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Función para manejar la actualización de un usuario
  const handleUpdate = async (updatedUser) => {
    try {
      // Solo incluir la contraseña si tiene valor
      const payload = { ...updatedUser };
      if (!payload.password) {
        delete payload.password;
      }

      // Llamar a la API para actualizar el usuario
      await updateUser(selectedUser.userID, payload);

      // Actualizar el estado local con los nuevos datos
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === selectedUser.userID ? { ...user, ...payload } : user
        )
      );

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        text: `El usuario ${updatedUser.username} ha sido actualizado correctamente.`,
      });

      handleCloseModal();
    } catch (error) {
      // Manejo de errores
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.message || "Error inesperado",
      });
    }
  };

  // Función para manejar la eliminación de un usuario
  const handleDelete = async (id, username) => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró un token de autenticación.",
      });
      return;
    }

    // Decodificar el token para obtener el rol del usuario
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userRole = decodedToken.roleName;

    if (userRole !== "Admin") {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes los permisos necesarios para realizar dicha acción.",
      });
      return;
    }

    // Si el rol es Admin, proceder con la eliminación
    Swal.fire({
      title: `¿Estás seguro de eliminar al usuario ${username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          setUsers(users.filter((user) => user.userID !== id)); // Actualiza el estado

          Swal.fire({
            icon: "success",
            title: "Usuario eliminado",
            text: "El usuario ha sido eliminado correctamente.",
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.message || "Error inesperado",
          });
        }
      }
    });
  };

  // Manejar cambios en la paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 4, fontSize: "1.5rem" }}
      >
        Gestión de Usuarios
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            style={{ width: "80%", margin: "0 auto", fontSize: "0.875rem" }}
          >
            <thead>
              <tr>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "25%" }}>Nombre de usuario</th>
                <th style={{ width: "25%" }}>Correo electrónico</th>
                <th style={{ width: "15%" }}>Rol</th>
                <th style={{ width: "25%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.userID}>
                  <td>{user.userID}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roleName}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => handleOpenModal(user)}
                    >
                      ACTUALIZAR
                    </Button>
                    <Button
                      variant="danger"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => handleDelete(user.userID, user.username)}
                    >
                      ELIMINAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Box sx={{ width: "80%", margin: "0 auto", mt: 2 }}>
            <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    marginTop: "8px",
                  },
                "& .MuiTablePagination-actions": {
                  marginTop: "4px",
                },
              }}
            />
          </Box>
        </>
      )}
      <ModalActualizarUsuario
        open={isModalOpen}
        onClose={handleCloseModal}
        usuario={selectedUser}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default Usuarios;
