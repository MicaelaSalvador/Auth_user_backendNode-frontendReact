import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import Swal from "sweetalert2";
import { register } from "../../services/authService";
import { getAllRoles } from "../../services/roleService";

const RegisterModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleName: "",
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  // Cargar los roles cuando el modal se abre
  useEffect(() => {
    if (open) {
      loadRoles();
    }
  }, [open]);

  // Limpiar los campos cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      setFormData({
        username: "",
        email: "",
        password: "",
        roleName: "",
      });
      setErrors({});
    }
  }, [open]);

  // Función para cargar los roles desde la API
  const loadRoles = async () => {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar los roles:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los roles.",
        icon: "error",
        customClass: {
          popup: "swal2-popup-custom", // Aplica la clase personalizada
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error del campo modificado
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    }
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El formato del correo no es válido.";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!formData.roleName) {
      newErrors.roleName = "El rol es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      Swal.fire({
        title: "¡Éxito!",
        text: "Usuario registrado exitosamente.",
        icon: "success",
        showConfirmButton: true,
        customClass: {
          popup: "swal2-popup-custom", // Aplica la clase personalizada
        },
      });

      // Limpiar los campos después de un registro exitoso
      setFormData({
        username: "",
        email: "",
        password: "",
        roleName: formData.roleName, // Mantener el valor del rol seleccionado
      });

      onClose(); // Cerrar el modal
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo registrar el usuario.",
        icon: "error",
        customClass: {
          popup: "swal2-popup-custom", // Aplica la clase personalizada
        },
      }).then(() => {
        // Limpiar los campos después de mostrar el mensaje de error
        setFormData({
          username: "",
          email: "",
          password: "",
          roleName: formData.roleName, // Mantener el valor del rol seleccionado
        });
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#1976d2",
          fontSize: "1.5rem",
          mb: 4,
        }}
      >
        Registro de Usuario
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          <TextField
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.username}
            sx={{
              width: "80%",
              "& .MuiInputBase-root": { height: "50px" },
              "& .MuiFormLabel-root": { marginTop: "5px" },
            }}
          />
          {errors.username && (
            <FormHelperText sx={{ color: "red", width: "80%" }}>
              {errors.username}
            </FormHelperText>
          )}

          <TextField
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.email}
            sx={{
              width: "80%",
              "& .MuiInputBase-root": { height: "50px" },
              "& .MuiFormLabel-root": { marginTop: "5px" },
            }}
          />
          {errors.email && (
            <FormHelperText sx={{ color: "red", width: "80%" }}>
              {errors.email}
            </FormHelperText>
          )}

          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.password}
            sx={{
              width: "80%",
              "& .MuiInputBase-root": { height: "50px" },
              "& .MuiFormLabel-root": { marginTop: "5px" },
            }}
          />
          {errors.password && (
            <FormHelperText sx={{ color: "red", width: "80%" }}>
              {errors.password}
            </FormHelperText>
          )}

          <TextField
            select
            label="Rol"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.roleName}
            sx={{
              width: "80%",
              "& .MuiInputBase-root": { height: "50px" },
              "& .MuiFormLabel-root": { marginTop: "5px" },
            }}
          >
            {roles.map((role) => (
              <MenuItem key={role.RoleID} value={role.RoleName}>
                {role.RoleName}
              </MenuItem>
            ))}
          </TextField>
          {errors.roleName && (
            <FormHelperText sx={{ color: "red", width: "80%" }}>
              {errors.roleName}
            </FormHelperText>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RegisterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RegisterModal;
