import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const generateAccessToken = (user: { id: any; role?: any; }) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
};

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
}

const generateRefreshToken = (user: { id: any; }) => {
    return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
};

const generatePasswordResetToken = (user: { id: any; role: any; }, expiresIn: string = '2h') => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as jwt.Secret,
        { expiresIn: expiresIn }
    );
};

export { generateAccessToken, generateRefreshToken, generatePasswordResetToken };