const prisma = require("../lib/prisma")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" })
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: "Email not verified" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    })

    // Remove password from response
    const { passwordHash, ...userResponse } = user

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
}

const logout = async (req, res) => {
  try {
    // In a more sophisticated setup, you might want to blacklist the token
    res.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Logout failed" })
  }
}

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Failed to retrieve profile" })
  }
}

module.exports = {
  login,
  logout,
  getProfile,
}
