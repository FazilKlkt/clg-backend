const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    otp: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    newPassword:{
        type: String
    }
}, {
    collection: 'Otp',
    versionKey: false,
    timestamps: true
}
);

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
