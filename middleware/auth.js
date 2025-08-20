const jwt = require("jsonwebtoken")
const prisma = require("../lib/prisma")

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or inactive user" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

const requireAdmin = requireRole(["ADMIN"])

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
}
