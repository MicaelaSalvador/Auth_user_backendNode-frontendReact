import { Outlet, useNavigate } from "react-router-dom"; // Importa useNavigate
import MenuVertical from "../components/layout/MenuVertical";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material"; // Importa Button
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Usa useNavigate para la navegación

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional para limpiar el estado de autenticación si es necesario
    navigate("/"); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {/* Botón de Salir */}
          <Button color="inherit" onClick={handleLogout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <MenuVertical open={open} onClose={toggleDrawer} />

      <main style={{ marginTop: 64 }}>
        <Outlet />{" "}
        {/* Esto renderiza las rutas anidadas, como Usuarios y Roles */}
      </main>
    </>
  );
};

export default Dashboard;
