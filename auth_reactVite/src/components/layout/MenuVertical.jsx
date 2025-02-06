import PropTypes from "prop-types";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const MenuVertical = ({ open, onClose }) => {
  const handleItemClick = () => {
    onClose(); // Cierra el Drawer al seleccionar una opción
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <List>
        <ListItem
          button
          component={Link}
          to="/dashboard/usuarios"
          onClick={handleItemClick} // Cierra el Drawer al hacer clic
        >
          <ListItemText primary="Usuarios" />
        </ListItem>
        <Divider />
        <ListItem
          button
          component={Link}
          to="/dashboard/roles"
          onClick={handleItemClick} // Cierra el Drawer al hacer clic
        >
          <ListItemText primary="Roles" />
        </ListItem>
      </List>
    </Drawer>
  );
};

// Validación de props
MenuVertical.propTypes = {
  open: PropTypes.bool.isRequired, // open debe ser un booleano y es requerido
  onClose: PropTypes.func.isRequired, // onClose debe ser una función y es requerido
};

export default MenuVertical;
