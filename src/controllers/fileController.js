const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: "AKIASVVL7KJWJ2P7AJVU",
  secretAccessKey: "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",
  region: "ap-south-1"
})
const s3 = new AWS.S3();
const File = require('../models/File')
const User = require('../models/User')
const bucketName = 'wanlink'


async function uploadFile(req, res) {
  const file = req.file;
  const { fileName, userId } = req.body;

  if (!fileName) {
    console.log('No file name provided');
    return res.status(400).send('No file name provided');
  }

  const timestamp = new Date().getTime();
  const ext = fileName.split('.')[1]
  const fName = fileName.split('.')[0]

  if (ext !== 'pdf' && ext !== 'doc' && ext !== 'docx' && ext !== 'xlsx' && ext !== 'xls' && ext !== 'odt' && ext !== 'zip' && ext !== 'txt') {
    console.log(ext)
    return res.status(400).json({ message: "Invalid file format" })
  }

  const params = {
    Bucket: bucketName,
    Key: `${userId}/${fName}-${timestamp}.${ext}`,
    Body: file.buffer
  };

  try {
    const data = await new Promise((resolve, reject) => {
      s3.upload(params, function (err, data) {
        if (err) {
          console.log('Error uploading file:', err);
          reject(err);
        } else {
          console.log('File uploaded successfully.\n File URL:    ', data);
          const newFile = new File({ fileName: fileName, filePath: data.Location, protectionType: 'none', password: '' })
          newFile.save()
            .then(() => {
              User.findById(userId)
                .then(user => {
                  user.files.push(newFile._id)
                  user.save()
                    .then(() => resolve(data))
                    .catch(err => reject(err));
                })
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        }
      });
    });

    res.status(200).json({ message: "Uploaded sucessfully", data: data })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during upload" });
  }
}


async function listUserFiles(req, res, next) {
  const { userId } = req.body
  try {
    const user = await User.findById(userId, '_id email username files')
    .populate({
      path: 'files',
      select: 'fileName filePath protectionType password',
      options: { sort: { createdAt: -1 } }
    });
    
  res.json({ files: user.files, length: user.files.length })
  } catch (error) {
    res.json({error:error.message})
  }
  
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










// require('dotenv').config();
// const { upload } = require("../config/file-handler");
// const fs = require("fs");
// const baseUrl = `http://localhost:${process.env.PORT}/api/files/`;


// // write comments
// const uploadFile = async (req, res) => {
//   try {
//     await upload(req, res);

//     if (!req.files ) {
//       return res.status(400).send({ message: "Please upload a file!" });
//     }
//     // const {user} = req.body
//     res.status(200).send({
//       message: "Uploaded the file successfully: " + req.files.file.name
//     });
//   } catch (err) {
//     console.log(err);
//     if (err.code == "LIMIT_FILE_SIZE") {
//       return res.status(500).send({
//         message: "File size cannot be larger than 40MB!",
//       });
//     }
//     res.status(500).send({
//       message: `Could not upload the file: ${req.file}. ${err}`,
//     });
//   }
// };

// // write comments
// const getListFiles = (req, res) => {
//   const directoryPath = __basedir + "/resources/static/assets/uploads/";
//   fs.readdir(directoryPath, function (err, files) {
//     if (err) {
//       res.status(500).send({
//         message: "Unable to scan files!",
//       });
//     }
//     let fileInfos = [];
//     files.forEach((file) => {
//       fileInfos.push({
//         name: file,
//         url: baseUrl + file,
//       });
//     });
//     res.status(200).send(fileInfos);
//   });
// };

// // write comments
// const download = (req, res) => {
//   const fileName = req.params.name;
//   const directoryPath = __basedir + "/resources/static/assets/uploads/";
//   res.download(directoryPath + fileName, fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not download the file. " + err,
//       });
//     }
//   });
// };

// // write comments
// const remove = (req, res) => {
//   const fileName = req.params.name;
//   const directoryPath = __basedir + "/resources/static/assets/uploads/";
//   fs.unlink(directoryPath + fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not delete the file. " + err,
//       });
//     }
//     res.status(200).send({
//       message: "File is deleted.",
//     });
//   });
// };


// module.exports = {
//   uploadFile,
//   getListFiles,
//   download,
//   remove,
// };