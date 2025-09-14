class ErrorResponse extends Error {
    statusCode: any;
    constructor(message: string | undefined, statusCode: any) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;