import { asyncHandler } from "../utils/asyncHandler.util.js";
export const zodSchemaValidation = (schema, option = { isAsync: false }) => asyncHandler(async (req, res, next) => {
    console.log(req.body);
    if (option?.isAsync) {
        await schema.parseAsync(req?.body || {});
    }
    else {
        schema.parse(req?.body || {});
    }
    next();
});
