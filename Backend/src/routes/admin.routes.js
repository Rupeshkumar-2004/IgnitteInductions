import { Router } from "express";
import {
    getAllApplications,
    updateApplicationStatus,
    getApplicationById,
    getDashboardStats,
    deleteApplication,
    assignTask,
    createTeamMember,
    verifyTask,
    getTeamMembers,
    removeTeamMember
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin, verifyAdminOrInterviewer } from "../middlewares/admin.middleware.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Admin & Interviewer routes (both can manage applications)
router.route("/applications").get(verifyAdminOrInterviewer, getAllApplications); // GET /api/v1/admin/applications
router.route("/applications/:applicationId")
    .get(verifyAdminOrInterviewer, getApplicationById) // GET /api/v1/admin/applications/:id
    .patch(verifyAdminOrInterviewer, updateApplicationStatus) // PATCH /api/v1/admin/applications/:id
    .delete(verifyAdminOrInterviewer, deleteApplication); // DELETE /api/v1/admin/applications/:id
router.route("/dashboard/stats").get(verifyAdminOrInterviewer, getDashboardStats); // GET /api/v1/admin/dashboard/stats
router.route("/applications/:applicationId/task").post(verifyAdminOrInterviewer, assignTask); // POST /api/v1/admin/applications/:id/task
router.route("/applications/:applicationId/tasks/:taskId").patch(verifyAdminOrInterviewer, verifyTask);

// Admin-only routes (team management)
router.route("/team/create").post(verifyAdmin, createTeamMember);
router.route("/team").get(verifyAdmin, getTeamMembers);
router.route("/team/:id").delete(verifyAdmin, removeTeamMember);

export default router;