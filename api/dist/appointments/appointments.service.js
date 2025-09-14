"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentsForUser = exports.createAppointment = exports.cancelAppointment = void 0;
const db_1 = __importDefault(require("../db"));
const client_1 = require("@prisma/client");
const cancelAppointment = async (appointmentId, user) => {
    const { userId, role } = user;
    const appointment = await db_1.default.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) {
        throw new Error('Not Found: Appointment not found');
    }
    const isPatient = role === client_1.Role.PATIENT && appointment.patientId === user.userId;
    const isProvider = role == client_1.Role.PROVIDER && appointment.providerId === user.userId;
    const isAdmin = role == client_1.Role.ADMIN;
    if (!isPatient && !isProvider && !isAdmin) {
        throw new Error('Forbidden: You do not have permission to cancel this appointment.');
    }
    if (appointment.status !== client_1.AppointmentStatus.SCHEDULED) {
        throw new Error(`Bad Request: Appointment can't be cancelled with status ${appointment.status}`);
    }
    const updatedAppointment = await db_1.default.appointment.update({ where: { id: appointmentId }, data: { status: client_1.AppointmentStatus.CANCELLED } });
    return updatedAppointment;
};
exports.cancelAppointment = cancelAppointment;
const createAppointment = async (data) => {
    const { patientId, providerId, startTime, reason } = data;
    if (patientId === providerId) {
        throw new Error("Patient and provider can't be the same");
    }
    const provider = await db_1.default.user.findUnique({ where: { id: providerId } });
    if (!provider || provider.role !== "PROVIDER") {
        throw new Error("Invalid provider ID");
    }
    const appontmentStartTime = new Date(startTime);
    const appontmentEndTime = new Date(appontmentStartTime.getTime() + 30 * 60 * 1000);
    const existingAppointment = await db_1.default.appointment.findFirst({ where: { providerId, startTime: appontmentStartTime } });
    if (existingAppointment) {
        throw new Error('Provider is already booked at this time');
    }
    const newAppointment = await db_1.default.appointment.create({
        data: {
            startTime: appontmentStartTime,
            endTime: appontmentEndTime,
            reason: reason,
            patientId: patientId,
            providerId: providerId
        }
    });
    return newAppointment;
};
exports.createAppointment = createAppointment;
const getAppointmentsForUser = async (user) => {
    const { userId, role } = user;
    const query = {
        where: {},
        include: {
            patient: {
                select: { id: true, firstname: true, lastname: true, email: true }
            },
            provider: {
                select: { id: true, firstname: true, lastname: true, email: true }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    };
    if (role === client_1.Role.PATIENT) {
        query.where.patientId = userId;
    }
    else if (role === client_1.Role.PROVIDER) {
        query.where.providerId = userId;
    }
    else if (role !== client_1.Role.ADMIN) {
        return [];
    }
    const appointments = await db_1.default.appointment.findMany(query);
    return appointments;
};
exports.getAppointmentsForUser = getAppointmentsForUser;
