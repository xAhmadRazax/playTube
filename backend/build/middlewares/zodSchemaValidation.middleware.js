import { asyncHandler } from "../utils/asyncHandler.util.js";
export const zodSchemaValidation = (schema, option) => asyncHandler(async (req, res, next) => {
    if (option?.isAsync) {
        await schema.parseAsync(req.body);
    }
    else {
        schema.parse(req.body);
    }
    next();
});
