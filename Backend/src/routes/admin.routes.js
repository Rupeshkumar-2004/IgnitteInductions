import { Router } from "express";
import {
    getAllApplications,
    updateApplicationStatus,
    getApplicationById,
    getDashboardStats,
    deleteApplication,
    assignTask,
    createTeamMember,
    verifyTask 
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

// Apply auth and admin middleware to all routes
router.use(verifyJWT, verifyAdmin);

// Admin routes
router.route("/applications").get(getAllApplications); // GET /api/v1/admin/applications
router.route("/applications/:applicationId").get(getApplicationById); // GET /api/v1/admin/applications/:id
router.route("/applications/:applicationId").patch(updateApplicationStatus); // PATCH /api/v1/admin/applications/:id
router.route("/applications/:applicationId").delete(deleteApplication); // DELETE /api/v1/admin/applications/:id
router.route("/dashboard/stats").get(getDashboardStats); // GET /api/v1/admin/dashboard/stats
router.route("/applications/:applicationId/task").post(assignTask); // POST /api/v1/admin/applications/:id/task
router.route("/team/create").post(createTeamMember);
router.route("/applications/:applicationId/tasks/:taskId").patch(verifyTask);

export default router;