const { google } = require('googleapis')
const path = require('path')
const fs = require('fs')

const CLIENT_ID = '780817416887-gvar9lf7uj4vv6mu5sgggkh85bmu1eqo.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESh_TOKEN = '1//04xDUyQ6TgKYsCgYIARAAGAQSNwF-L9Ire6viFsX5PnwRMlcsa2PafYkZ23Wy4leLSTk8j9vqpNn-y1cBezpHUeuPCXdmILrUVh0'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token:REFRESh_TOKEN})

const drive = google.drive({
    version:'v3',
    auth:oauth2Client
}
)


const filepath = path.join(__dirname,'x.png')


async function uploadFile(){
    try {
        const  response = await drive.files.create({
            requestBody:{
                name:"uploadedFile.png",
                mimeType:'image/png'
            },
            media:{
                mimeType:'image/png',
                body: fs.createReadStream(filepath)
            }
        })
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}


async function deleteFile(id) {
    try {
        const response = await drive.files.delete({
            fileId: id
        })
        console.log(response.data, response.status)
    } catch (error) {
        console.log(error);
    }
}


async function generatePublicLink(id='1zntuXdT4o3rPCHNW8Y_DvPQdptrqYZAE'){
    try{
        await drive.permissions.create({
            fileId:id,
            requestBody:{
                role:'reader',
                type:'anyone'
            }
        })

        const result = await drive.files.get({
            fileId:id,
            fields:'webViewLink, webContentLink'
        })
        console.log(result.data)

    } catch(error){
            console.log(error)
    }
}
















