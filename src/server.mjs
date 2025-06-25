import app from './app.js';
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from './config/db.js';
const PORT = 1234 || process.env.PORT;


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();