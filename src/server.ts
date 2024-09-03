import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectMongo from './config/database';
import bookRoutes from './routes/book.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
      origin: process.env.CORS_URL,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true, // to send cookies or authentication headers
  })
);
app.use(express.json());
app.use('/api', bookRoutes);
app.use('/auth',adminRoutes)

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  await connectMongo();
});
