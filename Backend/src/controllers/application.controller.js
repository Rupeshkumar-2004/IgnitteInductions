import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Application from "../models/Application.model.js";

// 1. Submit an Application
const submitApplication = asyncHandler(async (req, res) => {
    // Motivation and skills are required from the frontend form
    const { motivation, skills, previousExperience } = req.body;

    if (!motivation || !skills) {
        throw new ApiError(400, "Motivation and Skills are required");
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ user: req.user._id });
    if (existingApplication) {
        throw new ApiError(400, "You have already submitted an application.");
    }

    const application = await Application.create({
        user: req.user._id, // Comes from auth middleware
        motivation,
        skills, // Ensure frontend sends an array ["Java", "Python"]
        previousExperience
    });

    return res.status(201).json(
        new ApiResponse(201, application, "Application submitted successfully!")
    );
});

// 2. Get My Application (For the student dashboard)
const getMyApplication = asyncHandler(async (req, res) => {
    const application = await Application.findOne({ user: req.user._id });

    if (!application) {
        throw new ApiError(404, "No application found for this user.");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application fetched successfully")
    );
});

export { submitApplication, getMyApplication };