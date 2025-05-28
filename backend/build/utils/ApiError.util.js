import { ReasonPhrases, StatusCodes } from "http-status-codes";
/**
 * @classdesc Comprehensive API error handling class for consistent error responses.
 * Implements detailed error reporting, operational error distinction, and
 * structured validation error handling.
 */
export class AppErrorV4 extends Error {
    statusCode;
    isOperational; // Flag for expected errors (e.g., user input)
    errorCode; // Unique code for client-side handling (optional, but recommended)
    // public readonly errors?: ValidationError[]; // For validation errors from libraries like express-validator
    // public readonly errors?: ZodError["issues"]; // For validation errors from libraries like express-validator
    errors; // For validation errors from libraries like express-validator
    timestamp; // Added for logging and debugging
    context; //Added for more context
    /**
     * @constructor
     * @param {StatusCodes} statusCode - The HTTP status code.
     * @param {string} message - A clear, human-readable error message.
     * @param {object} options - Configuration options for the error.
     * @param {boolean} [options.isOperational] - Indicates if the error is an expected application error.
     * @param {string} [options.errorCode] - A unique, machine-readable error code.
     * @param {ValidationError[]} [options.errors] - Validation errors from libraries like express-validator.
     */
    constructor(statusCode, message = ReasonPhrases.INTERNAL_SERVER_ERROR, // Default message
    options = {}) {
        super(message);
        this.name = this.constructor.name; // Set error name to class name
        this.statusCode = statusCode;
        this.message = message;
        this.isOperational = options.isOperational ?? true; // Default to true
        this.errorCode = options.errorCode || `ERR_${statusCode}`; // Default error code
        this.errors = options.errors;
        this.timestamp = new Date().toISOString();
        this.context = options.context;
        // Capture stack trace, excluding the constructor itself for cleaner logs
        if (options?.stack) {
            this.stack = options.stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    /**
     * Factory method for creating a BadRequestError.
     */
    static badRequest(message = ReasonPhrases.BAD_REQUEST, 
    // errors?: ValidationError[],
    // errors?: ZodErrors["issues"],
    errors, context) {
        return new AppErrorV4(StatusCodes.BAD_REQUEST, message, {
            errorCode: "ERR_BAD_REQUEST",
            errors,
            context,
        });
    }
    /**
     * Factory method for creating an UnauthorizedError.
     */
    static unauthorized(message = ReasonPhrases.UNAUTHORIZED, context) {
        return new AppErrorV4(StatusCodes.UNAUTHORIZED, message, {
            errorCode: "ERR_UNAUTHORIZED",
            context,
        });
    }
    /**
     * Factory method for creating a NotFoundError.
     */
    static notFound(message = ReasonPhrases.NOT_FOUND, context) {
        return new AppErrorV4(StatusCodes.NOT_FOUND, message, {
            errorCode: "ERR_NOT_FOUND",
            context,
        });
    }
    /**
     * Factory method for creating an InternalServerError.
     */
    static internal(message = ReasonPhrases.INTERNAL_SERVER_ERROR, context) {
        return new AppErrorV4(StatusCodes.INTERNAL_SERVER_ERROR, message, {
            isOperational: false, // Important:  Internal errors are usually *not* operational
            errorCode: "ERR_INTERNAL_SERVER",
            context,
        });
    }
    /**
     * Converts the ApiError object to a JSON representation suitable for
     * sending in an API response.  This method centralizes the response
     * formatting and ensures consistency.
     * @param {boolean} includeDetails -  Include the stack trace and context?  Useful for development,
     * but should be false in production for security.
     * @returns {object} - A JSON object representing the error.
     */
    toJSON(includeDetails = false) {
        const baseResponse = {
            statusCode: this.statusCode,
            message: this.message,
            success: false, // Consistent success: false for errors
            errorCode: this.errorCode,
            timestamp: this.timestamp,
        };
        if (this.errors) {
            baseResponse.errors = this.errors;
        }
        if (includeDetails) {
            baseResponse.stack = this.stack;
            baseResponse.context = this.context;
        }
        return baseResponse;
    }
}
/**
 * @classdesc Base class for handling API errors.  This class should be
 * extended for specific error types in your application.  It provides a
 * consistent structure for error responses.
 */
// google gemini
export class ApiErrorV2 extends Error {
    statusCode;
    message;
    success;
    errors; // Optional, for validation errors
    /**
     * @constructor
     * @param {number} statusCode - The HTTP status code for the error.
     * @param {string} message - A human-readable error message.
     * @param {ValidationError[]} [errors] - Optional array of validation errors
     */
    constructor(statusCode, message, errors) {
        super(message); // Call the parent class constructor
        this.statusCode = statusCode;
        this.message = message;
        this.success = false; // Consistent error indication
        this.errors = errors;
        // Ensure the name of the error is the class name
        this.name = this.constructor.name;
        // Optional:  Helps with debugging and logging.  This ensures the stack
        // trace starts from the point where the error is *created* rather than
        // where it's *thrown*.  However, be mindful of performance implications
        // in very high-traffic applications.  You might conditionally enable this
        // only in development or staging environments.
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Converts the error object to a JSON representation.  This is useful
     * for sending error responses to the client.
     *
     * @returns {object} - A JSON object representing the error.
     */
    toJson() {
        const errorResponse = {
            message: this.message,
            success: this.success,
            statusCode: this.statusCode,
        };
        if (this.errors) {
            errorResponse.errors = this.errors;
        }
        return errorResponse;
    }
}
// chat gpt version
export class ApiErrorV1 extends Error {
    statusCode;
    isOperational;
    errors;
    data;
    constructor(message = "Something went wrong", statusCode = 500, isOperational = true, errors = [], data = null) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}
// hatesh chudary version
export class ApiError extends Error {
    statusCode;
    isOperational;
    errors;
    data;
    success;
    message;
    constructor(message = "Something went wrong", statusCode = 500, isOperational = true, errors = [], data = null, stack = "") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        this.data = data;
        this.success = false;
        this.message = message;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
