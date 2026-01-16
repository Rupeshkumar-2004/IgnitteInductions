import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    // req.user is already set by verifyJWT middleware
    if (!req.user) {
        throw new ApiError(401, "Unauthorized request");
    }

    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    next();
});