import { TextField, Button, Box, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import { register } from "../../services/authService";

const RegisterForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      roleName: formData.get("roleName"),
    };

    try {
      await register(userData);
      Swal.fire("¡Éxito!", "Usuario registrado exitosamente.", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "No se pudo registrar el usuario.", "error");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Nombre de usuario"
        name="username"
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Correo electrónico"
        name="email"
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        required
      />
      <TextField
        select
        label="Rol"
        name="roleName"
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="User">User</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Registrar
      </Button>
    </Box>
  );
};

export default RegisterForm;
