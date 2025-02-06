import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { createRole } from "../../services/roleService";

const ModalCrearRol = ({ open, onClose, refreshRoles }) => {
  const [roleName, setRoleName] = useState(""); // Estado para el nombre del rol

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      Swal.fire("Error", "El nombre del rol es obligatorio", "error");
      return;
    }

    try {
      await createRole(roleName); // Crear el rol
      Swal.fire("Éxito", "Rol creado exitosamente", "success");
      setRoleName(""); // Limpiar el campo después de crear el rol
      onClose(); // Cerrar el modal
      refreshRoles(); // Refrescar la lista de roles
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      setRoleName(""); // Limpiar el campo en caso de error
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs" // Modal más pequeño
      sx={{
        "& .MuiDialog-paper": {
          width: "400px", // Ancho personalizado
          maxWidth: "90%", // Limita el ancho máximo
        },
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", mt: 2, fontSize: "1.5rem" }}
      >
        Crear Rol
      </Typography>

      <DialogContent className="mt-1">
        <TextField
          label="Nombre del Rol"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
          className="mb-3"
          sx={{ width: "90%", mx: "auto" }} // Ajusta el ancho del input
          placeholder="Ingrese el nombre del rol"
        />
      </DialogContent>
      <DialogActions className="p-3">
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={handleCreateRole}
          color="primary"
          variant="contained"
          className="ml-2"
        >
          Crear Rol
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalCrearRol.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshRoles: PropTypes.func.isRequired,
};

export default ModalCrearRol;
