import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import fs from "fs";
export const validationAndFileCleanupHandler =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const files = req?.files as { [key: string]: Express.Multer.File[] };

    const fields: Record<string, string> = {};

    try {
      Object.keys(files || {})?.forEach((key) => {
        if (files[key] && files[key]?.length > 0) {
          fields[key] = files[key][0].path;
        }
      });
      let dataObj: Record<string, string> = {};
      if (req?.body) {
        dataObj = {
          ...dataObj,
          ...req.body,
        };
      }
      if (fields) {
        dataObj = {
          ...dataObj,
          ...fields,
        };
      }
      schema.parse(dataObj || undefined);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        Object.keys(fields).forEach((key) => fs.unlinkSync(fields[key]));
      }
      next(error);
    }
  };
