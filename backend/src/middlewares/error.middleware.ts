import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { AppErrorV4, AppErrorType } from "../utils/ApiError.util.js";
import mongoose from "mongoose";
// interface NormalizedError {
//   statusCode: number;
//   message: string;
//   errorCode: string;
//   stack?: string;
//   options?: {
//     errors?: any;
//   };
//   isOperational?: boolean;
//   toJSON: () => {};
// }

function handleZodError(err: ZodError): AppErrorV4 {
  let errorMessage = "";
  const formattedErrors = (err as ZodError).issues.reduce(
    (acc, issue) => {
      const field = issue.path[0];
      /* this convert he zod error
      // {
         fieldName:error message,
         fieldName2:error message
         } */

      errorMessage += issue.message + " ";
      return {
        ...acc,
        [field]: acc[field]
          ? // this append all errors msg related to one field to single message
            `${acc[field].endsWith(".") ? acc[field].slice(0, -1) : acc[field]}, ${issue.message}`
          : issue.message,
      };
    },
    {} as Record<string, string>
  );

  console.log(err);
  return new AppErrorV4(
    StatusCodes?.BAD_REQUEST,
    errorMessage.trim() || "Input Validation failed.",
    {
      errorCode: `ERR_ZOD_VALIDATION`,
      errors: formattedErrors,
      stack: err.stack,
    }
  );
}

function handleJWTError(err: Error): AppErrorV4 {
  return new AppErrorV4(
    StatusCodes.UNAUTHORIZED,
    process.env.NODE_ENV === "production"
      ? "Unauthorized access. Please login."
      : "Invalid Token, Please Login again.",
    {
      errorCode: `ERR_JWT_INVALID`,
      stack: err?.stack,
    }
  );
}

function handleJWTExpiredError(err: Error): AppErrorV4 {
  return new AppErrorV4(
    StatusCodes.UNAUTHORIZED,
    process.env.NODE_ENV === "production"
      ? "Unauthorized access. Please login."
      : "Token Expire, Please Login again.",
    {
      errorCode: `ERR_JWT_EXPIRED`,
      stack: err?.stack,
    }
  );
}
function handleJWTNotBeforeError(err: Error): AppErrorV4 {
  return new AppErrorV4(StatusCodes.UNAUTHORIZED, "Token not active yet.", {
    errorCode: `ERR_JWT_NOT_BEFORE`,
    stack: err?.stack,
  });
}

function handleDuplicateFieldsErrorDB(err: unknown): AppErrorV4 {
  const keyValue = (err as any).keyValue!;
  const [field, value] = Object.entries(keyValue)[0];
  return new AppErrorV4(
    StatusCodes.CONFLICT,
    `${field} '${value}' already exist. Please choose another.`,
    {
      errorCode: `ERR_DUPLICATE_FIELD_VALUE`,
      errors: {
        [field]: `The value '${value}' for '${field}' is already in use. Please choose a different ${field}.`,
      },
    }
  );
}

function handleValidationErrorDb(
  err: mongoose.Error.ValidationError
): AppErrorV4 {
  let errorMessage = "";
  const errorsFields = Object.keys(err.errors);
  const errors = errorsFields.reduce(
    (errObj: Record<string, string>, currentKey: string) => {
      errorMessage += `${err?.errors[currentKey]?.message} `;
      errObj[currentKey] =
        `${err?.errors[currentKey]?.message}` || "validation failed";
      return errObj;
    },
    {} as Record<string, string>
  );
  return new AppErrorV4(
    StatusCodes.BAD_REQUEST,
    errorMessage.trim() || "Input Validation failed",
    {
      errorCode: "ERR_MONGOOSE_VALIDATION",
      errors,
    }
  );
}

function handleCastErrorDB(err: mongoose.Error.CastError): AppErrorV4 {
  const field = err instanceof mongoose.Error.CastError && err.path!;
  const value = err instanceof mongoose.Error.CastError && err.value;
  return new AppErrorV4(
    StatusCodes.BAD_REQUEST,
    `Invalid value '${value}' for ${field} provided.`,
    {
      errorCode: "ERR_MONGOOSE_CAST_ERROR",
      errors: {
        [field as string]: `invalid '${field}' value: '${value}' `,
      },
    }
  );
}

function clearJWTFromCookies(res: Response): void {
  const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    secure: false,
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);
}

function normalizedErrorHandler(err: unknown): AppErrorType {
  const normalizedError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    errorCode: `ERR_${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
  };
  console.log(err instanceof mongoose.Error);
  if (err instanceof ZodError) {
    return handleZodError(err);
    // return Object.assign(normalizedError, {
    //   statusCode: StatusCodes.BAD_REQUEST,
    //   errorCode: `ERR_INVALID_INPUT`,
    //   message: "Input validation failed",
    //   errors: formattedErrors,
    //   stack: err.stack,
    // });
  }
  // handling jwt error cases
  if ((err as Error).name === "TokenExpiredError") {
    return handleJWTExpiredError(err as Error);
  }
  if ((err as Error).name === "JsonWebTokenError") {
    return handleJWTError(err as Error);
  }
  if ((err as Error).name === "NotBeforeError") {
    return handleJWTNotBeforeError(err as Error);
  }
  // handling mongo db error
  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    "keyValue" in err &&
    err.code === 11000
  ) {
    return handleDuplicateFieldsErrorDB(err);
    // return;
  }
  // validation error handling
  if (err instanceof mongoose.Error.ValidationError) {
    return handleValidationErrorDb(err);
  }
  if (err instanceof mongoose.Error.CastError) {
    return handleCastErrorDB(err);
  }
  if (err instanceof AppErrorV4) {
    return err;
  }
  return new AppErrorV4(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Hiya! nephew u have to still write more code move ur ass"
  );
  // console.log(
  //   "hiya! nephew u have to write the code don't be a johnny oliver of coding..."
  // );
  // return new AppErrorV4(
  //   200,
  //   "Hiya! nephew u have to still write more code move ur ass"
  // );
}
// const sendDevErrors = (
//   errors: NormalizedError,
//   req: Request,
//   res: Response
// ) => {};

const globalErrorHandlerMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   const normalizedError: NormalizedError = {
  //     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  //     message: ReasonPhrases.INTERNAL_SERVER_ERROR,
  //     errorCode: `ERR_${ReasonPhrases.INTERNAL_SERVER_ERROR}`,
  //   };
  console.log(err);
  const normalizedError = normalizedErrorHandler(err);
  // handling Err where jwt token is blacklist and we need to remove cookies

  const jwtErrorCodes = [
    "ERR_JWT_BLACKLIST",
    "ERR_JWT_INVALID",
    "ERR_JWT_EXPIRED",
    "ERR_JWT_NOT_BEFORE",
    "ERR_JWT_REUSED",
    "ERR_JWT_USER_NOT_FOUND",
    "ERR_PASSWORD_CHANGED",
  ];
  if (jwtErrorCodes.includes(normalizedError.errorCode)) {
    clearJWTFromCookies(res);
  }
  //   if (process.env.NODE_ENV === "development") {
  //     // const errObj = Object.assign(normalizedError, {
  //     //   stack: err?.stack!,
  //     // });
  //   } else if (process.env.NODE_ENV === "production") {
  //   }

  res.status(normalizedError.statusCode).json(normalizedError.toJSON(true));
};
export default globalErrorHandlerMiddleware;
