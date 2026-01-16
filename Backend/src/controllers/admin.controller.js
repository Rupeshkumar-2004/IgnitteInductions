import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";

//Get All Applications (Admin only)
const getAllApplications = asyncHandler(async (req, res) => {
    // Get query parameters for filtering
    const { status, department, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;

    // Create query   <----need to learn this
    let query = Application.find(filter).populate('user', 'fullName email department phone rollNumber');

    // Search by name or email (if user provides search term)
    if (search) {
        const users = await User.find({
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');
        
        const userIds = users.map(u => u._id);
        filter.user = { $in: userIds };
        query = Application.find(filter).populate('user', 'fullName email department phone rollNumber');
    }

    // Filter by department
    if (department) {
        const users = await User.find({ department: department }).select('_id');
        const userIds = users.map(u => u._id);
        filter.user = { $in: userIds };
        query = Application.find(filter).populate('user', 'fullName email department phone rollNumber');
    }

    // Pagination
    const skip = (page - 1) * limit;
    const applications = await query.sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    // Get total count for pagination
    const total = await Application.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            applications,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        }, "Applications fetched successfully")
    );
});

// Update Application Status (Admin only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'under-review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status. Must be: pending, under-review, accepted, or rejected");
    }

    // Find and update application
    const application = await Application.findByIdAndUpdate(
        applicationId,
        {
            status,
            adminNotes: adminNotes || "",
            reviewedBy: req.user._id,
            statusUpdatedAt: Date.now()
        },
        { new: true }
    ).populate('user', 'fullName email department phone');

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application status updated successfully")
    );
});

// Get Single Application Details (Admin only)
const getApplicationById = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate('user', 'fullName email department phone rollNumber profilePicture createdAt')
        .populate('reviewedBy', 'fullName email');

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application fetched successfully")
    );
});

// 4. Get Dashboard Statistics (Admin only)
const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await Application.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    // Format stats
    const formattedStats = {
        total: 0,
        pending: 0,
        underReview: 0,
        accepted: 0,
        rejected: 0
    };

    stats.forEach(stat => {
        formattedStats.total += stat.count;
        if (stat._id === 'pending') formattedStats.pending = stat.count;
        if (stat._id === 'under-review') formattedStats.underReview = stat.count;
        if (stat._id === 'accepted') formattedStats.accepted = stat.count;
        if (stat._id === 'rejected') formattedStats.rejected = stat.count;
    });

    // Get recent applications
    const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'fullName email department');

    return res.status(200).json(
        new ApiResponse(200, {
            stats: formattedStats,
            recentApplications
        }, "Dashboard stats fetched successfully")
    );
});

// 5. Delete Application (Admin only)
const deleteApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await Application.findByIdAndDelete(applicationId);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Application deleted successfully")
    );
});

export {
    getAllApplications,
    updateApplicationStatus,
    getApplicationById,
    getDashboardStats,
    deleteApplication
};