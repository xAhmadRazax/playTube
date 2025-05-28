import e, { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { asyncHandler } from "../utils/asyncHandler.util.js";

export const zodSchemaValidation = (
  schema: ZodSchema,
  option: { isAsync: boolean }
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (option?.isAsync) {
      await schema.parseAsync(req.body);
    } else {
      schema.parse(req.body);
    }
    next();
  });
