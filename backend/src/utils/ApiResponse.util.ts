import { Response } from "express";
import { StatusCodes } from "http-status-codes";
export class ApiResponseV3<T> {
  public readonly statusCode: StatusCodes;
  public readonly message: string;
  public readonly success: boolean;
  public readonly data: T | null;

  /**
   * @constructor
   * @param {StatusCodes} statusCode - The HTTP status code for the response.
   * @param {string} message - A descriptive message for the response.
   * @param {T | null} data - The data payload (can be null for empty responses).
   */
  constructor(statusCode: StatusCodes, message: string, data: T | null = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = true; // Consistent success: true for success
    this.data = data;
  }

  /**
   * Converts the ApiResponse object to a JSON representation.
   * @returns {object} - A JSON object representing the response.
   */
  toJSON(): object {
    return {
      statusCode: this.statusCode,
      message: this.message,
      success: this.success,
      data: this.data,
    };
  }

  static sendJSON<U>(
    res: Response,
    statusCode: number,
    message: string,
    data: U | null = null
    // success: boolean = true
  ) {
    return res
      .status(statusCode)
      .json(new ApiResponseV3<U>(statusCode, message, data).toJSON());
  }
}
export class ApiResponseV2<T> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly success: boolean;
  public readonly data: T | null; // Use null for no data, or a specific type

  /**
   * @constructor
   * @param {number} statusCode - The HTTP status code for the response (e.g., 200, 201).
   * @param {string} message - A human-readable message describing the result.
   * @param {T | null} data - The data payload of the response.  Use null if there is no data.
   */
  constructor(statusCode: number, message: string, data: T | null = null) {
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
  toJson(): object {
    const response: {
      message: string;
      success: boolean;
      statusCode: number;
      data: T | null;
    } = {
      message: this.message,
      success: this.success,
      statusCode: this.statusCode,
      data: this.data,
    };
    return response;
  }
}
export class ApiResponseV1 {
  success: boolean;
  message: string;
  data: any;
  errors: any[];
  statusCode: number;
  timestamp: string;

  constructor(
    success: boolean,
    message: string,
    data: any = null,
    errors: any[] = [],
    statusCode: number = 200
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString(); // Adding a timestamp for the response.
  }

  // This method sends the API response back to the client.
  send(res: Response) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      errors: this.errors,
      timestamp: this.timestamp, // Including timestamp in the response.
    });
  }

  // Utility method to generate a successful response
  static successResponse(
    res: Response,
    message: string,
    data: any = null,
    statusCode: number = 200
  ) {
    const response = new ApiResponseV1(true, message, data, [], statusCode);
    return response.send(res);
  }

  // Utility method to generate an error response
  static errorResponse(
    res: Response,
    message: string,
    errors: any[] = [],
    statusCode: number = 500
  ) {
    const response = new ApiResponseV1(
      false,
      message,
      null,
      errors,
      statusCode
    );
    return response.send(res);
  }
}
export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;
  constructor(statusCode: number, data: any, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
