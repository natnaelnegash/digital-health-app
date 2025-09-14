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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const AuthService = __importStar(require("./auth.service"));
const db_1 = __importDefault(require("../db"));
const register = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const newUser = await AuthService.registerUser({ email, password, role });
        return res.status(201).json(newUser);
    }
    catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(409).json({ message: error.message });
        }
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await AuthService.loginUser({ email, password });
        return res.status(200).json(result);
    }
    catch (error) {
        if (error.message.includes('Invalid credentials')) {
            return res.status(401).json({ message: error.message });
        }
        if (error.message.includes("doesn't exist")) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
exports.getProfile = getProfile;
