import express from 'express'; 
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js'; 
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT 

app.use(cors({
  origin : "http://localhost:5173",
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err);
  process.exit(1);
});