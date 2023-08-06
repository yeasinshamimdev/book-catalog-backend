"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const CustomError_1 = __importDefault(require("../../error/CustomError"));
const handleCastError_1 = __importDefault(require("../../error/handleCastError"));
const handleValidationError_1 = __importDefault(require("../../error/handleValidationError"));
const handleZodValidationError_1 = __importDefault(require("../../error/handleZodValidationError"));
const globalErrorHandler = (error, req, res, next) => {
    config_1.default.env === 'development'
        ? console.log(`globalErrorHandler ~~`, { error })
        : console.log(`globalErrorHandler ~~`, error);
    let statusCode = 500;
    let message = 'Something went wrong !';
    let errorMessages = [];
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const errorResponse = (0, handleValidationError_1.default)(error);
        statusCode = errorResponse.statusCode;
        message = errorResponse.message;
        errorMessages = errorResponse.errorMessages;
    }
    else if (error instanceof zod_1.ZodError) {
        const errorResponse = (0, handleZodValidationError_1.default)(error);
        statusCode = errorResponse.statusCode;
        message = errorResponse.message;
        errorMessages = errorResponse.errorMessages;
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error instanceof CustomError_1.default) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: '',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
