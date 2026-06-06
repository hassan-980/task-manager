import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js'; // You will create similar to authRoutes

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Welcome to the  server🐱!!");
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => 
  console.log(`Server running on port http://localhost:${PORT}`));

export default app;

