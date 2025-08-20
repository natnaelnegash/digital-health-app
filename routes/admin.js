const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { auditLog } = require("../middleware/audit")
const {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  getSystemReports,
  getSystemConfigurations,
  updateSystemConfiguration,
  getProviderSchedules,
  updateProviderSchedule,
} = require("../controllers/adminController")

const router = express.Router()

// Example routes
router.get("/users", authenticateToken, getAllUsers)
router.post("/users", authenticateToken, createUser)
router.put("/users/:id", authenticateToken, updateUser)
router.delete("/users/:id", authenticateToken, deactivateUser)

router.get("/reports", authenticateToken, getSystemReports)
router.get("/configurations", authenticateToken, getSystemConfigurations)
router.put("/configurations", authenticateToken, updateSystemConfiguration)

router.get("/provider-schedules", authenticateToken, getProviderSchedules)
router.put("/provider-schedules/:id", authenticateToken, updateProviderSchedule)

module.exports = router;
