import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
const app = express();
import { router as userRouter } from "./routes/user.routes.js";
import { router as fileRouter } from "./routes/file.routes.js";
import { connect } from './config/config.js';
import { fileURLToPath } from "url";


//db config

dotenv.config()


//database connection


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cookieParser()); // Use cookie-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views')); // Create a 'views' folder for your EJS files


connect();

//api

app.use('/api/v1/user', userRouter);
app.use('/api/v1/file', fileRouter);




app.listen(process.env.PORT, () => {
    console.log('Server is running on port' , process.env.PORT);
  }
);
