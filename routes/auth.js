const express = require("express")
const { login, logout, getProfile } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Auth routes
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", authenticateToken, getProfile)

module.exports = router
