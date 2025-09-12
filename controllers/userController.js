const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, firstName, lastName, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { email, firstName, lastName, role, passwordHash },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role, phone, isActive, email } = req.body;

    const updatedUser = await prisma.user.update({
  where: { id: Number(id) },
  data: { firstName, lastName, role, phone, isActive, email },
});

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Deactivate user
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });
    res.json({ message: "User deactivated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  deleteUser, // <-- exported for route
};
