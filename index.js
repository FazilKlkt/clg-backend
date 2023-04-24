require('dotenv').config();
global.__basedir = __dirname;
const { connectDB } = require('./src/config/db');
const express = require("express");
const cors = require("cors");
const app = express();
// const fileUpload = require('express-fileupload');


const userRouter = require('./src/routes/userRoute');
const emailRouter = require('./src/routes/emailRoute');
const filesRouter  =require('./src/routes/filesRoute');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
// app.use(fileUpload());
connectDB();

app.use('/api/user', userRouter);
app.use('/api/email', emailRouter);
app.use('/api/files',filesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
