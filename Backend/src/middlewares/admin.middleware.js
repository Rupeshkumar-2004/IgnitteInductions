import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyRoles = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        // req.user is already set by verifyJWT middleware
        if (!req.user) {
            throw new ApiError(401, "Unauthorized request");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(403, `Access denied. ${allowedRoles.join(' or ')} only.`);
        }

        next();
    });
};

export const verifyAdmin = verifyRoles('admin');
export const verifyAdminOrInterviewer = verifyRoles('admin', 'interviewer');