import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve('.env')});

import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './router';
import { errorMiddleware } from './middleware/errorMiddleware';

const app: Application = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: "*"
}));
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Hwllo world');
});


const start = async (): Promise<void> => {
  try {
    mongoose.set('debug', true);
    mongoose.connection
      .on('open', () => console.log('Connection is open'))
      .on('close', () => console.log('Connection is close'))
      .on('error', (error) => console.log(error));
    await mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/upper_auth', {
      useCreateIndex: true,
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(process.env.PORT || 3000, () => console.log('we on air'));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();