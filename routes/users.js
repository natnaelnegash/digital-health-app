const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser, // <-- new delete controller
} = require("../controllers/userController");

// GET all users
router.get("/", getAllUsers);

// POST new user
router.post("/", createUser);

// PUT update user
router.put("/:id", updateUser);

// PUT deactivate user
router.put("/:id/deactivate", deactivateUser);

// DELETE user
router.delete("/:id", deleteUser);

module.exports = router;
