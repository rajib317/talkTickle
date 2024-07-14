import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import PostRouter from './routes/Post.Router';
import createHttpError from 'http-errors';
import dotenv from 'dotenv';
import Post from './models/Post.Model';
import verifyAcessToken from './helpers/jwtVerify';
interface Error {
  message?: string;
  status?: number;
  isJoi?: boolean;
}
const app = express();
dotenv.config();

app.use(morgan('dev'));

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
app.use('/posts', verifyAcessToken, PostRouter);

// app.use('/posts', PostRouter);
// 404
app.use(async (req, res, next) => {
  next(createHttpError.NotFound());
});

// Errror handeler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.isJoi) res.status(422);
  res.send({
    error: {
      status: err.isJoi ? 422 : err.status || 500,
      message: err.message,
    },
  });
});

Post.sync();
// Post.sync({ alter: true, force: true });

app.listen(port, () => `Server running on port ${port}`);
