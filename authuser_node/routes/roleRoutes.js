const express = require("express");
const {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllRoles);
router.get("/:id", verifyToken, isAdmin, getRoleById);
router.post("/", verifyToken, isAdmin, createRole);
router.put("/:id", verifyToken, isAdmin, updateRole);
router.delete("/:id", verifyToken, isAdmin, deleteRole);

module.exports = router;
