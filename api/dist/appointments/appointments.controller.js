"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.createAppointment = exports.cancelAppointment = void 0;
const AppointmentService = __importStar(require("./appointments.service"));
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized user' });
        }
        const cancelled = await AppointmentService.cancelAppointment(id, user);
        return res.status(201).json(cancelled);
    }
    catch (error) {
        if (error.message.startsWith('Not Found')) {
            return res.status(404).json({ message: error.message });
        }
        if (error.message.startsWith('Forbidden')) {
            return res.status(403).json({ message: error.message });
        }
        if (error.message.startsWith('Bad Request')) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.cancelAppointment = cancelAppointment;
const createAppointment = async (req, res) => {
    try {
        const patientId = req.user?.userId;
        const { providerId, startTime, reason } = req.body;
        if (!patientId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!providerId || !startTime) {
            return res.status(400).json({ message: 'Provider ID and start time are required.' });
        }
        const appointmentData = { patientId, providerId, startTime, reason };
        const newAppointment = await AppointmentService.createAppointment(appointmentData);
        return res.status(201).json(newAppointment);
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
exports.createAppointment = createAppointment;
const getAll = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const appointment = await AppointmentService.getAppointmentsForUser(user);
        return res.status(200).json(appointment);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAll = getAll;
