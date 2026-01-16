import { Router } from "express";
import { submitApplication, getMyApplication, submitTask } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply Security Middleware to all routes in this file
router.use(verifyJWT); 

router.route("/submit").post(submitApplication); // POST /api/v1/applications/submit
router.route("/me").get(getMyApplication);       // GET /api/v1/applications/me
router.route("/tasks/:taskId").post(submitTask);
export default router;