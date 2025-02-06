import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { getRoleById, updateRole } from "../../services/roleService";

const ModalActualizarRol = ({ open, onClose, roleId, refreshRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener el rol por ID cuando el modal se abre
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleData = await getRoleById(roleId);
        setRoleName(roleData.RoleName);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener el rol:", error);
        Swal.fire("Error", error.message, "error");
      }
    };

    if (open && roleId) {
      fetchRole();
    }
  }, [open, roleId]);

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    if (!roleName.trim()) {
      Swal.fire("Error", "El nombre del rol es obligatorio", "error");
      return;
    }
    try {
      const response = await updateRole(roleId, roleName); // Llama al servicio para actualizar el rol
      Swal.fire("Éxito", response.message, "success"); // Muestra el mensaje de éxito del backend
      onClose(); // Cierra el modal
      refreshRoles(); // Actualiza la lista de roles
    } catch (error) {
      Swal.fire("Error", error.message, "error"); // Muestra el mensaje de error del backend
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "400px",
          maxWidth: "90%",
        },
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", mt: 2, fontSize: "1.5rem" }}
      >
        Actualizar Rol
      </Typography>

      <DialogContent className="mt-1">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={100}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TextField
            label="Nombre del Rol"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            fullWidth
            margin="normal"
            className="mb-3"
            sx={{ width: "90%", mx: "auto" }}
          />
        )}
      </DialogContent>
      <DialogActions className="p-3">
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          className="ml-2"
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalActualizarRol.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  roleId: PropTypes.number,
  refreshRoles: PropTypes.func.isRequired,
};

export default ModalActualizarRol;
