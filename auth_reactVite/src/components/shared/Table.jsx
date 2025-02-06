import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import { getUserRole } from "../../services/authService";
import { useState } from "react";

const CustomTable = ({ columns, data, onUpdate, onDelete }) => {
  const userRole = getUserRole(); // Obtener el rol del usuario
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleActionNotAllowed = () => {
    Swal.fire({
      icon: "error",
      title: "Acción no permitida",
      text: "No tienes permisos para realizar esta acción.",
    });
  };

  // Manejar cambios en la paginación
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2 }}
      >
        Lista de Usuarios
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "80%", margin: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.label}</TableCell>
              ))}
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{row[column.key]}</TableCell>
                  ))}
                  <TableCell>
                    {/* Botón para Actualizar */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        userRole === "Admin"
                          ? onUpdate(row)
                          : handleActionNotAllowed()
                      }
                      style={{ marginRight: "8px" }}
                    >
                      Actualizar
                    </Button>
                    {/* Botón para Eliminar */}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        userRole === "Admin"
                          ? onDelete(row.userID, row.username)
                          : handleActionNotAllowed()
                      }
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: 2,
          marginTop: -2,
          marginRight: 15,
        }}
      >
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            "& .MuiTablePagination-selectLabel": { marginBottom: "-5px" },
            "& .MuiTablePagination-displayedRows": { marginBottom: "-5px" },
          }}
        />
      </Box>
    </Box>
  );
};

// Validación de props
CustomTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CustomTable;
