export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload;
        }
    }
}

declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string;
        JWT_REFRESH_SECRET: string;
    }
}