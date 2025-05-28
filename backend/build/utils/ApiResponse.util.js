export class ApiResponseV3 {
    statusCode;
    message;
    success;
    data;
    /**
     * @constructor
     * @param {StatusCodes} statusCode - The HTTP status code for the response.
     * @param {string} message - A descriptive message for the response.
     * @param {T | null} data - The data payload (can be null for empty responses).
     */
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = true; // Consistent success: true for success
        this.data = data;
    }
    /**
     * Converts the ApiResponse object to a JSON representation.
     * @returns {object} - A JSON object representing the response.
     */
    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            success: this.success,
            data: this.data,
        };
    }
    static sendJSON(res, statusCode, message, data = null
    // success: boolean = true
    ) {
        return res
            .status(statusCode)
            .json(new ApiResponseV3(statusCode, message, data).toJSON());
    }
}
export class ApiResponseV2 {
    statusCode;
    message;
    success;
    data; // Use null for no data, or a specific type
    /**
     * @constructor
     * @param {number} statusCode - The HTTP status code for the response (e.g., 200, 201).
     * @param {string} message - A human-readable message describing the result.
     * @param {T | null} data - The data payload of the response.  Use null if there is no data.
     */
    constructor(statusCode, message, data = null) {
        // Default data to null
        this.statusCode = statusCode;
        this.message = message;
        this.success = true; // Consistent success indication
        this.data = data;
    }
    /**
     * Converts the response object to a JSON representation.
     *
     * @returns {object} - A JSON object representing the response.
     */
    toJson() {
        const response = {
            message: this.message,
            success: this.success,
            statusCode: this.statusCode,
            data: this.data,
        };
        return response;
    }
}
export class ApiResponseV1 {
    success;
    message;
    data;
    errors;
    statusCode;
    timestamp;
    constructor(success, message, data = null, errors = [], statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString(); // Adding a timestamp for the response.
    }
    // This method sends the API response back to the client.
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
            errors: this.errors,
            timestamp: this.timestamp, // Including timestamp in the response.
        });
    }
    // Utility method to generate a successful response
    static successResponse(res, message, data = null, statusCode = 200) {
        const response = new ApiResponseV1(true, message, data, [], statusCode);
        return response.send(res);
    }
    // Utility method to generate an error response
    static errorResponse(res, message, errors = [], statusCode = 500) {
        const response = new ApiResponseV1(false, message, null, errors, statusCode);
        return response.send(res);
    }
}
export class ApiResponse {
    statusCode;
    data;
    message;
    success;
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
