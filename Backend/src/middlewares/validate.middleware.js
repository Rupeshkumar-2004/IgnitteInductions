import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => async (req, res, next) => {
    try {
        const parsedBody = await schema.parseAsync(req.body);
        req.body = parsedBody;
        next();
    } catch (error) {
        if (error.name === 'ZodError') {
            const errorMessages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
            next(new ApiError(400, "Validation Error", errorMessages));
        } else {
            next(error);
        }
    }
};
