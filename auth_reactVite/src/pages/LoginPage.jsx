import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { login } from "../services/authService";
import RegisterModal from "../components/modals/RegisterModal";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  // Función para limpiar el formulario
  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
    setErrors({}); // También limpia los errores
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia el error del campo modificado
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire("Error", "Por favor corrige los errores.", "error");
      return;
    }

    try {
      await login(formData.email, formData.password);
      Swal.fire({
        title: "¡Éxito!",
        text: "Inicio de sesión exitoso.",
        icon: "success",
        timer: 3000, // El mensaje permanecerá visible por 3 segundos (3000ms)
        timerProgressBar: true, // Agrega una barra de progreso al mensaje
        showConfirmButton: false, // Oculta el botón de confirmación
      });

      // Redirigir después de un pequeño retraso
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000); // Espera el mismo tiempo que el timer antes de redirigir
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Credenciales incorrectas.", "error");
    }
  };

  return (
    <Box
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #007bff, #00c6ff)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 400,
        }}
        className="text-center"
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mb: 4,
            fontSize: "1.5rem",
          }}
        >
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.email}
            className="mb-3"
          />
          {errors.email && (
            <FormHelperText sx={{ color: "red", textAlign: "left", ml: 1 }}>
              {errors.email}
            </FormHelperText>
          )}

          <Box sx={{ position: "relative" }} className="mb-3">
            <TextField
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              error={!!errors.password}
            />
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              sx={{ position: "absolute", right: 10, top: 20 }}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          {errors.password && (
            <FormHelperText sx={{ color: "red", textAlign: "left", ml: 1 }}>
              {errors.password}
            </FormHelperText>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            className="mb-3"
          >
            Iniciar Sesión
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          ¿No estás registrado?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => setOpenRegisterModal(true)}
            sx={{ color: "primary.main", cursor: "pointer" }}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>

      {/* Modal de registro */}
      <RegisterModal
        open={openRegisterModal}
        onClose={() => {
          setOpenRegisterModal(false); // Cierra el modal
          clearForm(); // Limpia el formulario
        }}
      />
    </Box>
  );
};

export default LoginPage;
