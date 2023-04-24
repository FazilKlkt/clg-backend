require('dotenv').config();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGO_URI = 'mongodb+srv://user:user@deltanode.srkfkkl.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('mongodb connection success!');
    } catch (err) {
        console.log('mongodb connection failed!', err.message);
    }
};

module.exports = { connectDB };
