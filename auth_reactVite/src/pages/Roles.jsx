import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import {
  Box,
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import { getAllRoles, deleteRole } from "../services/roleService";
import ModalCrearRol from "../components/modals/ModalCrearRol";
import ModalActualizarRol from "../components/modals/ModalActualizarRol";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para controlar el modal de creación
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    const userToken = localStorage.getItem("token");
    let userRole = "";
    if (userToken) {
      try {
        const decodedToken = JSON.parse(atob(userToken.split(".")[1]));
        userRole = decodedToken.roleName;
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Token no válido", "error");
        return;
      }
    }

    if (userRole !== "Admin") {
      Swal.fire(
        "Acceso Denegado",
        "No tiene los permisos necesarios para realizar dicha acción",
        "error"
      );
      return;
    }

    setShowCreateModal(true); // Abrir el modal de creación
  };

  const handleOpenUpdateModal = (roleId) => {
    const userToken = localStorage.getItem("token");
    let userRole = "";
    if (userToken) {
      try {
        const decodedToken = JSON.parse(atob(userToken.split(".")[1]));
        userRole = decodedToken.roleName;
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Token no válido", "error");
        return;
      }
    }

    if (userRole !== "Admin") {
      Swal.fire(
        "Acceso Denegado",
        "No tiene los permisos necesarios para realizar dicha acción",
        "error"
      );
      return;
    }

    setSelectedRoleId(roleId);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedRoleId(null);
  };

  const handleDeleteRole = async (roleId, roleName) => {
    const userToken = localStorage.getItem("token");
    let userRole = "";
    if (userToken) {
      try {
        const decodedToken = JSON.parse(atob(userToken.split(".")[1]));
        userRole = decodedToken.roleName;
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Token no válido", "error");
        return;
      }
    }

    if (userRole !== "Admin") {
      Swal.fire(
        "Acceso Denegado",
        "No tiene los permisos necesarios para realizar dicha acción",
        "error"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el rol "${roleName}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteRole(roleId);
        Swal.fire(
          "Éxito",
          `El rol "${roleName}" ha sido eliminado correctamente.`,
          "success"
        );
        fetchRoles();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const currentRoles = roles.slice(
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
        Gestión de Roles
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "60%",
              margin: "0 auto",
              mb: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="primary"
              onClick={handleOpenCreateModal}
              style={{ fontSize: "0.875rem", padding: "5px 10px" }}
            >
              CREAR ROL
            </Button>
          </Box>
          <Table
            striped
            bordered
            hover
            style={{ width: "60%", margin: "0 auto", fontSize: "0.875rem" }}
          >
            <thead>
              <tr>
                <th style={{ width: "10%" }}>Id</th>
                <th style={{ width: "35%" }}>Nombre</th>
                <th style={{ width: "25%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map((role) => (
                <tr key={role.RoleID}>
                  <td>{role.RoleID}</td>
                  <td>{role.RoleName}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2"
                      style={{
                        fontSize: "0.875rem",
                        padding: "5px 10px",
                        marginLeft: "10px",
                      }}
                      onClick={() => handleOpenUpdateModal(role.RoleID)}
                    >
                      ACTUALIZAR
                    </Button>
                    <Button
                      variant="danger"
                      style={{ fontSize: "0.875rem", padding: "5px 10px" }}
                      onClick={() =>
                        handleDeleteRole(role.RoleID, role.RoleName)
                      }
                    >
                      ELIMINAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Box sx={{ width: "60%", margin: "0 auto", mt: 2 }}>
            <TablePagination
              component="div"
              count={roles.length}
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
      <ModalCrearRol
        open={showCreateModal} // Pasar el estado del modal
        onClose={() => setShowCreateModal(false)} // Función para cerrar el modal
        refreshRoles={fetchRoles} // Función para refrescar la lista de roles
      />
      <ModalActualizarRol
        open={showUpdateModal}
        onClose={handleCloseUpdateModal}
        roleId={selectedRoleId}
        refreshRoles={fetchRoles}
      />
    </Box>
  );
};

export default Roles;
