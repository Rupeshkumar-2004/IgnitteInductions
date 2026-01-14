import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Needed for auth cookies

const app = express();

// 1. Global Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Allow Frontend to talk to Backend
    credentials: true // Essential for cookies to work
}));

app.use(express.json({ limit: "16kb" })); // Handle JSON data
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Handle URL data
app.use(express.static("public")); // Store images/assets if needed
app.use(cookieParser()); // Parse cookies from the user's browser

// 2. Import Routes
import userRouter from './routes/user.routes.js';
import applicationRouter from "./routes/application.routes.js"; // <--- Import this

// 3. Mount Routes
// This connects your 'user.routes.js' to the main app.
// URL becomes: http://localhost:8000/api/v1/users/register
app.use("/api/v1/users", userRouter);
app.use("/api/v1/applications", applicationRouter); // <--- Add this

// 4. Basic Test Route (Keep this to check if server is alive)
app.get('/', (req, res) => {
    res.json({ 
      message: '🎉 Club Induction API is running!',
      status: 'success' 
    });
});

export default app;