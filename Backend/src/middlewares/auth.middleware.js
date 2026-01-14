import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        // 1. Look for the token in Cookies OR the Authorization Header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // 2. If no token, kick them out
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        // 3. Verify the token (Is it fake? Is it expired?)
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // 4. Find the user in the DB using the ID inside the token
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        // 5. ATTACH the user to the request object so the Controller can use it
        req.user = user;
        next() // Let them pass to the next function
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})