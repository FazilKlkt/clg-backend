const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: "AKIASVVL7KJWJ2P7AJVU",
    secretAccessKey: "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",
    region: "ap-south-1"
})
const s3 = new AWS.S3();
const bucketName = 'wanlink'

function uploadFile(req, res) {
    const file = req.file;
    const { fileName, userId } = req.body;

    if(!fileName){
        console.log('No file name provided');
        return res.status(400).send('No file name provided');
    }

    const timestamp = new Date().getTime();
    const ext = fileName.split('.')[1]
    const fName = fileName.split('.')[0]

    if(ext !== 'pdf' && ext !== 'doc' && ext !== 'docx' && ext !== 'xlsx' && ext !== 'xls' && ext !== 'odt' && ext !== 'zip' && ext !== 'txt'){
        console.log(ext)
        return res.status(400).json({message:"Invalid file format"})
    }

    const params = {
        Bucket: bucketName,
        Key: `${userId}/${fName}-${timestamp}.${ext}`,
        Body: file.buffer
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.log('Error uploading file:', err);
        } else {
            console.log('File uploaded successfully.\n File URL:    ', data);
            res.status(200).json({message:"Uploaded sucessfully",data:data})
        }
    });
}



function listUserFiles(req, res, next) {
    const { userId } = req.body
    const params = {
        Bucket: bucketName
    };


    s3.listObjectsV2(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            next(err)
        } else {
            files = []
            data.Contents.forEach(function (content) {
                if (content.Key.split('/')[0] == userId) {
                    // console.log(content)
                    file = {
                        name: content.Key.split('/')[1].split('-')[0] + '.' + content.Key.split('/')[1].split('-')[1].split('.')[1],
                        link: "https://wanlink.s3.ap-south-1.amazonaws.com/" + content.Key,
                        size: content.Size > 1048576 ? ((content.Size / 1024) / 1000).toFixed(2) + "MB" : ((content.Size / 1024)).toFixed(2) + "KB"
                    }
                    files.push(file)
                }
            });
            res.json({ files: files, count: files.length })
            next()
        }
    });

}


function deleteFile(req, res, next) {
    const { userId, fileName } = req.body;
    const params = {
        Bucket: bucketName,
        Key: userId + '/' + fileName
    };

    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log('Error deleting file: ', err);
            res.status(500).json({ error: 'Error deleting file' });
        } else {
            console.log('File deleted successfully.');
            res.json({ message: 'File deleted successfully' });
        }
    });
}



module.exports = {
    uploadFile,
    listUserFiles,
    deleteFile
}

// const aws  = require('aws-sdk')
// const multer = require('multer')
// const multerS3 = require('multer-s3');


// const express = require('express')

// const app = express();

// app.listen(3001);

// BUCKET="wanlink"
// ACCESS_KEY= "AKIASVVL7KJWJ2P7AJVU"
// SECRET_ACCESS_KEY="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"
// REGION="ap-south-1"

// aws.config.update({
//     secretAccessKey:SECRET_ACCESS_KEY,
//     accessKeyId:ACCESS_KEY,
//     region:REGION,
// })

// const s3 = new aws.S3();

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: "public-read",
//         bucket: BUCKET,
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname)
//         }
//     })
// })

// app.post('/upload', upload.single('file'), async function (req, res, next) {

//     res.send('Successfully uploaded ' + req.file.location + ' location!')

// })

// app.get("/list", async (req, res) => {

//     let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
//     let x = r.Contents.map(item => item.Key);
//     res.send(x)
// })


// app.get("/download/:filename", async (req, res) => {
//     const filename = req.params.filename
//     let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
//     res.send(x.Body)
// })

// app.delete("/delete/:filename", async (req, res) => {
//     const filename = req.params.filename
//     await s3.deleteObject({ Bucket: BUCKET, Key: filename}).promise();
//     res.send("File Deleted Successfully")

// })