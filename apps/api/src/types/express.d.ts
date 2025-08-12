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