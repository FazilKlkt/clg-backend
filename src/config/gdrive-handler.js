const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: "AKIASVVL7KJWJ2P7AJVU",
  secretAccessKey: "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",
  region: "ap-south-1"
})
const s3 = new AWS.S3();
const bucketName = 'wanlink'




function uploadFile(fileName, fileToUpload) {
  const timestamp = new Date().getTime();
  const ext = fileName.split('.')[1]
  const fName = fileName.split('.')[0]

  fs.readFileSync(fileToUpload)
  const fileContent = fs.readFileSync(fileToUpload);
  const params = {
    Bucket: bucketName,
    Key: `${fName}-${timestamp}.${ext}`,
    Body: fileContent
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully.\n File URL:    ', data);
    }
  });
}


function downloadFile(fileName) {
  const params = {
    Bucket: bucketName,
    Key: fileName
  };
    s3.getObject(params, function (err, data) {
      if (err) {
        // console.log(err, err.stack);
        console.log("No such file")
      } else {
        // console.log("https://wanlink.s3.ap-south-1.amazonaws.com/"+data);
        link="https://wanlink.s3.ap-south-1.amazonaws.com/"+fileName
        console.log({file_link:link});
      }
    });
}

function listUserFiles(userId) {
  const params = {
    Bucket: bucketName
  };

  s3.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      files = []
      console.log(data);
      console.log('Objects in bucket:');
      data.Contents.forEach(function (content) {
        if (content.Key.split('/')[0] == userId)
          files.push(content)
      });
      // console.log({data:files});
    }
  });
}

// uploadFile("script/database_config.js", './db.js')
downloadFile("script/database_config-1680688663835.js")
// listUserFiles("script")