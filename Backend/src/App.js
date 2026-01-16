import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Import Routes
import userRouter from './routes/user.routes.js';
import applicationRouter from "./routes/application.routes.js";
import adminRouter from "./routes/admin.routes.js"; 

// Mount Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/admin", adminRouter); 

// Test route
app.get('/', (req, res) => {
    res.json({ 
      message: 'Club Induction API is running!',
      status: 'success' 
    });
});

export default app;