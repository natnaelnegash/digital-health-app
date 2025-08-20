const prisma = require("../lib/prisma")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")

// User Management Functions
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query
    const skip = (page - 1) * limit
    const take = Number.parseInt(limit)

    // Build where clause
    const where = {}

    if (role) {
      where.role = role.toUpperCase()
    }

    if (status !== undefined) {
      where.isActive = status === "active"
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Get users with related data
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          provider: {
            select: {
              specialty: true,
              department: true,
              licenseNumber: true,
            },
          },
          patient: {
            select: {
              dateOfBirth: true,
              gender: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    // Format response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      additionalInfo:
        user.provider?.specialty || (user.patient?.dateOfBirth ? `DOB: ${user.patient.dateOfBirth}` : null),
    }))

    res.json({
      users: formattedUsers,
      pagination: {
        page: Number.parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Failed to retrieve users" })
  }
}

const createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, role, firstName, lastName, phone, specialty, licenseNumber, department } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, Number.parseInt(process.env.BCRYPT_ROUNDS) || 12)

    // Create user with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: role.toUpperCase(),
          firstName,
          lastName,
          phone,
          emailVerified: true,
        },
      })

      // Create role-specific record
      if (role.toUpperCase() === "PROVIDER") {
        await tx.provider.create({
          data: {
            userId: user.id,
            specialty,
            licenseNumber,
            department,
          },
        })
      } else if (role.toUpperCase() === "PATIENT") {
        await tx.patient.create({
          data: {
            userId: user.id,
          },
        })
      }

      return user
    })

    res.status(201).json({
      message: "User created successfully",
      userId: result.id,
      email: result.email,
      role: result.role,
    })
  } catch (error) {
    console.error("Create user error:", error)
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email or license number already exists" })
    }
    res.status(500).json({ error: "Failed to create user" })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, phone, isActive, specialty, department } = req.body

    await prisma.$transaction(async (tx) => {
      // Update user
      await tx.user.update({
        where: { id: Number.parseInt(id) },
        data: {
          firstName,
          lastName,
          phone,
          isActive,
        },
      })

      // Update provider info if applicable
      if (specialty || department) {
        await tx.provider.updateMany({
          where: { userId: Number.parseInt(id) },
          data: {
            ...(specialty && { specialty }),
            ...(department && { department }),
          },
        })
      }
    })

    res.json({ message: "User updated successfully" })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ error: "Failed to update user" })
  }
}

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.user.update({
      where: { id: Number.parseInt(id) },
      data: { isActive: false },
    })

    res.json({ message: "User deactivated successfully" })
  } catch (error) {
    console.error("Deactivate user error:", error)
    res.status(500).json({ error: "Failed to deactivate user" })
  }
}

// Report Generation Functions
const getSystemReports = async (req, res) => {
  try {
    const { reportType, startDate, endDate } = req.query

    let reportData = {}

    switch (reportType) {
      case "appointments":
        reportData = await generateAppointmentReport(startDate, endDate)
        break
      case "users":
        reportData = await generateUserReport(startDate, endDate)
        break
      case "no-shows":
        reportData = await generateNoShowReport(startDate, endDate)
        break
      case "system-usage":
        reportData = await generateSystemUsageReport(startDate, endDate)
        break
      default:
        return res.status(400).json({ error: "Invalid report type" })
    }

    res.json({
      reportType,
      dateRange: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      data: reportData,
    })
  } catch (error) {
    console.error("Generate report error:", error)
    res.status(500).json({ error: "Failed to generate report" })
  }
}

const generateAppointmentReport = async (startDate, endDate) => {
  const appointments = await prisma.appointment.groupBy({
    by: ["status"],
    where: {
      appointmentDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    _count: {
      status: true,
    },
  })

  const total = appointments.reduce((sum, item) => sum + item._count.status, 0)

  const summary = appointments.map((item) => ({
    status: item.status,
    total: item._count.status,
    percentage: total > 0 ? ((item._count.status / total) * 100).toFixed(2) : 0,
  }))

  const dailyStats = await prisma.$queryRaw`
    SELECT 
      DATE(appointment_date) as date,
      status,
      COUNT(*) as count
    FROM appointments 
    WHERE appointment_date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
    GROUP BY DATE(appointment_date), status
    ORDER BY date DESC
  `

  return { appointments: dailyStats, summary }
}

const generateNoShowReport = async (startDate, endDate) => {
  const noShows = await prisma.appointment.findMany({
    where: {
      status: "NO_SHOW",
      appointmentDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      patient: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      provider: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  })

  const totalAppointments = await prisma.appointment.count({
    where: {
      appointmentDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
  })

  const noShowRate = totalAppointments > 0 ? ((noShows.length / totalAppointments) * 100).toFixed(2) : 0

  return {
    noShows: noShows.map((appointment) => ({
      patientName: `${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
      patientEmail: appointment.patient.user.email,
      providerName: `${appointment.provider.user.firstName} ${appointment.provider.user.lastName}`,
      appointmentDate: appointment.appointmentDate,
    })),
    noShowRate,
  }
}

const generateUserReport = async (startDate, endDate) => {
  const userStats = await prisma.user.groupBy({
    by: ["role"],
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    _count: {
      role: true,
    },
  })

  const registrations = await prisma.$queryRaw`
    SELECT 
      DATE(created_at) as date,
      role,
      COUNT(*) as registrations
    FROM users 
    WHERE created_at BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
    GROUP BY DATE(created_at), role
    ORDER BY date DESC
  `

  return { userStats, registrations }
}

const generateSystemUsageReport = async (startDate, endDate) => {
  const loginStats = await prisma.$queryRaw`
    SELECT 
      DATE(last_login) as date,
      COUNT(DISTINCT id) as unique_logins
    FROM users 
    WHERE last_login BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
    GROUP BY DATE(last_login)
    ORDER BY date DESC
  `

  const auditStats = await prisma.auditLog.groupBy({
    by: ["action"],
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    _count: {
      action: true,
    },
    orderBy: {
      _count: {
        action: "desc",
      },
    },
  })

  return { loginStats, auditStats }
}

// System Configuration Functions
const getSystemConfigurations = async (req, res) => {
  try {
    const configurations = await prisma.systemConfiguration.findMany({
      orderBy: { configKey: "asc" },
    })

    res.json({ configurations })
  } catch (error) {
    console.error("Get configurations error:", error)
    res.status(500).json({ error: "Failed to retrieve configurations" })
  }
}

const updateSystemConfiguration = async (req, res) => {
  try {
    const { configKey, configValue } = req.body

    await prisma.systemConfiguration.update({
      where: { configKey },
      data: {
        configValue,
        updatedBy: req.user.id,
      },
    })

    res.json({ message: "Configuration updated successfully" })
  } catch (error) {
    console.error("Update configuration error:", error)
    res.status(500).json({ error: "Failed to update configuration" })
  }
}

const getProviderSchedules = async (req, res) => {
  try {
    const schedules = await prisma.providerSchedule.findMany({
      where: { isActive: true },
      include: {
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { provider: { user: { lastName: "asc" } } },
        { provider: { user: { firstName: "asc" } } },
        { dayOfWeek: "asc" },
      ],
    })

    const formattedSchedules = schedules.map((schedule) => ({
      id: schedule.id,
      providerId: schedule.providerId,
      providerName: `${schedule.provider.user.firstName} ${schedule.provider.user.lastName}`,
      specialty: schedule.provider.specialty,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      slotDurationMinutes: schedule.slotDurationMinutes,
      isActive: schedule.isActive,
    }))

    res.json({ schedules: formattedSchedules })
  } catch (error) {
    console.error("Get provider schedules error:", error)
    res.status(500).json({ error: "Failed to retrieve provider schedules" })
  }
}

const updateProviderSchedule = async (req, res) => {
  try {
    const { id } = req.params
    const { startTime, endTime, slotDurationMinutes, isActive } = req.body

    await prisma.providerSchedule.update({
      where: { id: Number.parseInt(id) },
      data: {
        startTime,
        endTime,
        slotDurationMinutes,
        isActive,
      },
    })

    res.json({ message: "Provider schedule updated successfully" })
  } catch (error) {
    console.error("Update provider schedule error:", error)
    res.status(500).json({ error: "Failed to update provider schedule" })
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  getSystemReports,
  getSystemConfigurations,
  updateSystemConfiguration,
  getProviderSchedules,
  updateProviderSchedule,
}
