const prisma = require("../lib/prisma")

const auditLog = (action, tableName = null) => {
  return async (req, res, next) => {
    const originalSend = res.send

    res.send = function (data) {
      // Log the action after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logAuditEntry(req, action, tableName, data)
      }
      originalSend.call(this, data)
    }

    next()
  }
}

const logAuditEntry = async (req, action, tableName, responseData) => {
  try {
    const userId = req.user ? req.user.id : null
    const ipAddress = req.ip || req.connection.remoteAddress
    const userAgent = req.get("User-Agent")

    let recordId = null
    let newValues = null

    // Try to extract record ID from response or request
    if (responseData && typeof responseData === "string") {
      try {
        const parsed = JSON.parse(responseData)
        if (parsed.id) recordId = parsed.id
        if (parsed.data) newValues = parsed.data
      } catch (e) {
        // Ignore parsing errors
      }
    }

    if (req.body && Object.keys(req.body).length > 0) {
      newValues = req.body
    }

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        tableName,
        recordId,
        newValues,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error("Audit logging failed:", error)
  }
}

module.exports = { auditLog }
