const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    protectionType: {
        type: String,
        required: true,
        enum:['none','password','qrcode']
    },
    password:{
        type: String
    }
}, {
    collection: 'File',
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);