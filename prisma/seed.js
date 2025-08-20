const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

// Helper to convert "HH:MM:SS" to Date object
function timeStringToDate(timeStr) {
  return new Date(`1970-01-01T${timeStr}Z`)
}

async function main() {
  console.log("🌱 Starting database seeding...")

  // -----------------------
  // Create system configurations
  // -----------------------
  const configs = [
    {
      configKey: "default_appointment_duration",
      configValue: "30",
      description: "Default appointment duration in minutes",
    },
    {
      configKey: "max_appointments_per_day",
      configValue: "20",
      description: "Maximum appointments per provider per day",
    },
    {
      configKey: "appointment_reminder_hours",
      configValue: "24,1",
      description: "Hours before appointment to send reminders",
    },
    {
      configKey: "system_timezone",
      configValue: "UTC",
      description: "System default timezone",
    },
    {
      configKey: "max_file_upload_size",
      configValue: "5242880",
      description: "Maximum file upload size in bytes (5MB)",
    },
    {
      configKey: "session_timeout_minutes",
      configValue: "480",
      description: "User session timeout in minutes (8 hours)",
    },
    {
      configKey: "password_min_length",
      configValue: "8",
      description: "Minimum password length",
    },
    {
      configKey: "two_factor_required",
      configValue: "false",
      description: "Whether 2FA is required for all users",
    },
  ]

  for (const config of configs) {
    await prisma.systemConfiguration.upsert({
      where: { configKey: config.configKey },
      update: config,
      create: config,
    })
  }

  // -----------------------
  // Hash password for default users
  // -----------------------
  const defaultPassword = await bcrypt.hash("Admin123!", 12)

  // -----------------------
  // Create admin user
  // -----------------------
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@healthsystem.com" },
    update: {},
    create: {
      email: "admin@healthsystem.com",
      passwordHash: defaultPassword,
      role: "ADMIN",
      firstName: "System",
      lastName: "Administrator",
      isActive: true,
      emailVerified: true,
    },
  })

  // -----------------------
  // Create provider user
  // -----------------------
  const providerUser = await prisma.user.upsert({
    where: { email: "dr.smith@healthsystem.com" },
    update: {},
    create: {
      email: "dr.smith@healthsystem.com",
      passwordHash: defaultPassword,
      role: "PROVIDER",
      firstName: "John",
      lastName: "Smith",
      phone: "+1234567890",
      isActive: true,
      emailVerified: true,
    },
  })

  // -----------------------
  // Create provider profile
  // -----------------------
  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      specialty: "Cardiology",
      licenseNumber: "MD123456",
      department: "Internal Medicine",
    },
  })

  // -----------------------
  // Create patient user
  // -----------------------
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      email: "patient@example.com",
      passwordHash: defaultPassword,
      role: "PATIENT",
      firstName: "Jane",
      lastName: "Doe",
      phone: "+1987654321",
      isActive: true,
      emailVerified: true,
    },
  })

  // -----------------------
  // Create patient profile
  // -----------------------
  const patient = await prisma.patient.upsert({
    where: { userId: patientUser.id },
    update: {},
    create: {
      userId: patientUser.id,
      dateOfBirth: new Date("1990-05-15"),
      gender: "FEMALE",
      emergencyContactName: "John Doe",
      emergencyContactPhone: "+1555123456",
    },
  })

  // -----------------------
  // Create provider schedules
  // -----------------------
  const schedules = [
    { dayOfWeek: "MONDAY", startTime: "09:00:00", endTime: "17:00:00" },
    { dayOfWeek: "TUESDAY", startTime: "09:00:00", endTime: "17:00:00" },
    { dayOfWeek: "WEDNESDAY", startTime: "09:00:00", endTime: "17:00:00" },
    { dayOfWeek: "THURSDAY", startTime: "09:00:00", endTime: "17:00:00" },
    { dayOfWeek: "FRIDAY", startTime: "09:00:00", endTime: "17:00:00" },
  ]

  for (const schedule of schedules) {
    await prisma.providerSchedule.upsert({
      where: {
        providerId_dayOfWeek: {
          providerId: provider.id,
          dayOfWeek: schedule.dayOfWeek,
        },
      },
      update: {},
      create: {
        providerId: provider.id,
        dayOfWeek: schedule.dayOfWeek,
        startTime: timeStringToDate(schedule.startTime),
        endTime: timeStringToDate(schedule.endTime),
        slotDurationMinutes: 30,
      },
    })
  }

  // -----------------------
  // Create sample appointments
  // -----------------------
  const appointments = [
    {
      patientId: patient.id,
      providerId: provider.id,
      appointmentDate: new Date("2025-01-15T10:00:00Z"),
      status: "SCHEDULED",
      appointmentType: "consultation",
      notes: "Regular checkup",
    },
    {
      patientId: patient.id,
      providerId: provider.id,
      appointmentDate: new Date("2025-01-10T14:30:00Z"),
      status: "COMPLETED",
      appointmentType: "consultation",
      notes: "Follow-up visit",
    },
    {
      patientId: patient.id,
      providerId: provider.id,
      appointmentDate: new Date("2025-01-05T11:00:00Z"),
      status: "NO_SHOW",
      appointmentType: "consultation",
      notes: "Patient did not show up",
    },
  ]

  for (const appointment of appointments) {
    await prisma.appointment.create({
      data: appointment,
    })
  }

  console.log("✅ Database seeding completed successfully!")
  console.log("📧 Default users created:")
  console.log("   Admin: admin@healthsystem.com / Admin123!")
  console.log("   Provider: dr.smith@healthsystem.com / Admin123!")
  console.log("   Patient: patient@example.com / Admin123!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
