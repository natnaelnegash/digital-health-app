export interface JwtPayload {
    userId: string;
    firstname?: string
    lastname?: string
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