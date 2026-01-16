import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Application from "../models/Application.model.js";
import User from "../models/User.model.js";

// 1. Get All Applications (Admin only)
const getAllApplications = asyncHandler(async (req, res) => {
    const { status, department, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    // Base Query with Populates
    // We populate 'verifiedBy' inside the tasks array to show who checked it
    let query = Application.find(filter)
        .populate('user', 'fullName email department phone rollNumber')
        .populate('tasks.verifiedBy', 'fullName email'); 

    // Search Logic
    if (search) {
        const users = await User.find({
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');
        
        const userIds = users.map(u => u._id);
        filter.user = { $in: userIds };
        // Re-apply query with filter and populates
        query = Application.find(filter)
            .populate('user', 'fullName email department phone rollNumber')
            .populate('tasks.verifiedBy', 'fullName email');
    }

    // Department Filter
    if (department) {
        const users = await User.find({ department: department }).select('_id');
        const userIds = users.map(u => u._id);
        filter.user = { $in: userIds };
        query = Application.find(filter)
            .populate('user', 'fullName email department phone rollNumber')
            .populate('tasks.verifiedBy', 'fullName email');
    }

    // Pagination
    const skip = (page - 1) * limit;
    const applications = await query.sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
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

// 2. Update Application Status (Global Status)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'under-review', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const application = await Application.findByIdAndUpdate(
        applicationId,
        {
            status,
            adminNotes: adminNotes || "",
            reviewedBy: req.user._id,
            statusUpdatedAt: Date.now()
        },
        { new: true }
    ).populate('user', 'fullName email');

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application status updated successfully")
    );
});

// 3. Get Single Application
const getApplicationById = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate('user', 'fullName email department phone rollNumber profilePicture createdAt')
        .populate('reviewedBy', 'fullName email')
        .populate('tasks.verifiedBy', 'fullName email');

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new ApiResponse(200, application, "Application fetched successfully")
    );
});

// 4. Dashboard Stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedStats = {
        total: 0, pending: 0, underReview: 0, accepted: 0, rejected: 0
    };

    stats.forEach(stat => {
        formattedStats.total += stat.count;
        if (stat._id === 'pending') formattedStats.pending = stat.count;
        if (stat._id === 'under-review') formattedStats.underReview = stat.count;
        if (stat._id === 'accepted') formattedStats.accepted = stat.count;
        if (stat._id === 'rejected') formattedStats.rejected = stat.count;
    });

    const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'fullName email department');

    return res.status(200).json(
        new ApiResponse(200, { stats: formattedStats, recentApplications }, "Stats fetched")
    );
});

// 5. Delete Application
const deleteApplication = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) throw new ApiError(404, "Application not found");
    return res.status(200).json(new ApiResponse(200, {}, "Deleted successfully"));
});

// 6. Assign Task
const assignTask = asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { title, description } = req.body;

    if (!title) throw new ApiError(400, "Task title is required");

    const application = await Application.findById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    const newTask = {
        title,
        description,
        assignedBy: req.user._id,
        status: 'pending'
    };

    application.tasks.push(newTask);
    await application.save();

    return res.status(200).json(
        new ApiResponse(200, application, "Task assigned successfully")
    );
});

// 7. Create Team Member
const createTeamMember = asyncHandler(async (req, res) => {
    const { fullName, email, password, phone, department, role } = req.body;

    if ([fullName, email, password, phone, department, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!['admin', 'interviewer'].includes(role)) {
        throw new ApiError(400, "Invalid role.");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) throw new ApiError(409, "User exists");

    const user = await User.create({
        fullName, email, password, phone, department, role
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res.status(201).json(
        new ApiResponse(200, createdUser, `${role} created successfully`)
    );
});

// 8. Verify Task (Improved with Unverify Restriction)
const verifyTask = asyncHandler(async (req, res) => {
    const { applicationId, taskId } = req.params;
    const { status, feedback } = req.body; // status: 'verified', 'rejected', 'pending'

    const application = await Application.findById(applicationId);
    if (!application) throw new ApiError(404, "App not found");

    const task = application.tasks.id(taskId);
    if (!task) throw new ApiError(404, "Task not found");

    // --- RESTRICTION LOGIC ---
    // If the task is currently verified, we need to check permissions before changing it
    if (task.status === 'verified') {
        // Check if the current user is the one who verified it
        const isOriginalVerifier = task.verifiedBy && task.verifiedBy.toString() === req.user._id.toString();
        
        // Check if the current user is the Super Admin (using email from seedAdmin.js)
        // I've also added 'admin@inductions' as requested in your prompt
        const isSuperAdmin = [
            'admin@clubinduction.com', 
            'admin@inductions'
        ].includes(req.user.email);

        // If the new status is NOT 'verified' (meaning they are trying to unverify/reject it)
        // AND the user is neither the original verifier nor a super admin:
        if (status !== 'verified' && !isOriginalVerifier && !isSuperAdmin) {
            throw new ApiError(403, "Action forbidden: Only the original verifier or Super Admin can unverify this task.");
        }
    }
    // -------------------------

    // Update Task Fields
    task.status = status;
    task.adminFeedback = feedback;

    // Logic for updating verifiedBy field
    if (status === 'verified') {
        // If marking as verified, set the current user as the verifier
        task.verifiedBy = req.user._id;
    } else if (status === 'pending') {
        // If unverifying (resetting to pending), clear the verifier
        task.verifiedBy = null;
    }
    // If rejected, we might want to keep the verifiedBy (as "rejectedBy") or clear it. 
    // Currently leaving it as is or overwriting if they verify again later.

    await application.save();

    return res.status(200).json(
        new ApiResponse(200, application, `Task status updated to ${status}`)
    );
});

export {
    getAllApplications,
    updateApplicationStatus,
    getApplicationById,
    getDashboardStats,
    deleteApplication,
    assignTask,
    createTeamMember,
    verifyTask // Exporting the new function
};