import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { getAllRoles } from "../../services/roleService";
import "bootstrap/dist/css/bootstrap.min.css"; // Importar Bootstrap CSS

const ModalActualizarUsuario = ({ open, onClose, usuario, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    roleName: "",
    password: "", // Campo opcional para la contraseña
  });

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Obtener los roles al abrir el modal
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
        setLoadingRoles(false);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    if (open) {
      fetchRoles();
    }
  }, [open]);

  // Actualiza los datos del formulario cuando se cambia el usuario seleccionado
  useEffect(() => {
    if (usuario && roles.length > 0) {
      const validRole = roles.some((role) => role.RoleName === usuario.roleName)
        ? usuario.roleName
        : ""; // Ajusta el valor si no es válido
      setFormData({
        username: usuario.username || "",
        email: usuario.email || "",
        roleName: validRole,
        password: "",
      });
    }
  }, [usuario, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const updatedUser = {
      username: formData.username,
      email: formData.email,
      roleName: formData.roleName,
    };

    // Solo incluye el campo password si tiene un valor
    if (formData.password) {
      updatedUser.password = formData.password;
    }

    onUpdate(updatedUser);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2", mt: 2, fontSize: "1.5rem" }}
      >
        Actualizar Usuario
      </Typography>

      <DialogContent className="mt-1">
        <TextField
          label="Nombre de usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="mb-3"
        />
        <TextField
          label="Correo electrónico"
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="mb-3"
        />
        <TextField
          select
          label="Rol"
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="mb-3"
          error={
            !roles.some((role) => role.RoleName === formData.roleName) &&
            formData.roleName !== ""
          }
          helperText={
            !roles.some((role) => role.RoleName === formData.roleName) &&
            formData.roleName !== ""
              ? "Selecciona un rol válido"
              : ""
          }
        >
          {loadingRoles ? (
            <MenuItem disabled>
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} className="mr-2" />
                Cargando roles...
              </Box>
            </MenuItem>
          ) : (
            roles.map((role) => (
              <MenuItem key={role.RoleID} value={role.RoleName}>
                {role.RoleName}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Nueva Contraseña (opcional)"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          className="mb-3"
        />
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

ModalActualizarUsuario.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuario: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ModalActualizarUsuario;
