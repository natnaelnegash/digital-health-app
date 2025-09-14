"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (userData) => {
    const { email, password, role } = userData;
    const existingUser = await db_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = await db_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            role
        }
    });
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};
exports.registerUser = registerUser;
const loginUser = async (loginData) => {
    const { email, password } = loginData;
    const user = await db_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User doesn't exist");
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token };
};
exports.loginUser = loginUser;
