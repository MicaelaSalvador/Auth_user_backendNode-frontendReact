import PropTypes from "prop-types"; // Importa PropTypes
import { TablePagination } from "@mui/material";

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[10, 25, 50, 100]}
    />
  );
};

// Validación de props
CustomPagination.propTypes = {
  count: PropTypes.number.isRequired, // count debe ser un número y es requerido
  page: PropTypes.number.isRequired, // page debe ser un número y es requerido
  rowsPerPage: PropTypes.number.isRequired, // rowsPerPage debe ser un número y es requerido
  onPageChange: PropTypes.func.isRequired, // onPageChange debe ser una función y es requerido
  onRowsPerPageChange: PropTypes.func.isRequired, // onRowsPerPageChange debe ser una función y es requerido
};

export default CustomPagination;
