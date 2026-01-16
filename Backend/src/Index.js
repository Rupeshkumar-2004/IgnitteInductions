import dotenv from 'dotenv';
import connectDB from './database/index.js';
import app from './App.js';

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to Database then Start Server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed!", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(` Unhandled Rejection: ${err.message}`);
  process.exit(1);
});