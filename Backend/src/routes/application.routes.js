import { Router } from "express";
import { submitApplication, getMyApplication, submitTask } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { submitApplicationSchema, submitTaskSchema } from "../validators/application.validator.js";

const router = Router();

// Apply Security Middleware to all routes in this file
router.use(verifyJWT); 

router.route("/submit").post(validate(submitApplicationSchema), submitApplication); // POST /api/v1/applications/submit
router.route("/me").get(getMyApplication);       // GET /api/v1/applications/me
router.route("/tasks/:taskId").post(validate(submitTaskSchema), submitTask);
export default router;