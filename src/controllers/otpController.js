const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');
const MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    }
}
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

async function generateOTP() { // generate random 4 digit otp 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

async function sendEmail(email, otp) { // take email & otp as arguements and send mail
    try {
        await transporter.sendMail({
            from: MAIL_SETTINGS.auth.user,
            to: email,
            subject: 'WanLink : OTP Verification',
            html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            
            <h2>Welcome to </h2>
            <img style='height:100px;' src='https://i.imgur.com/DhCtspk.png'></img>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the OTP to complete verification</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
       </div>
        `,
        });
        return true;
    } catch (error) {
        console.error(`Error : ${error.message}`);
        return false;
    }
}


const sendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = await generateOTP();

    try {
        if (await sendEmail(email, otp)) {  // send email
            if (! await Otp.findOne({ email: email })) {  // for new email
                const newOtp = new Otp({ email: email, otp: otp});
                await newOtp.save();
                res.status(200).send({
                    status: true,
                    message: 'Otp sent sucessfully'
                });
            } else {  // for already existing email
                await Otp.findOneAndUpdate({ email: email }, { otp: otp, verified: false });
                res.status(200).send({
                    status: true,
                    message: 'Otp updated sucessfully'
                });
            }
        } else {  // if email isn't sent
            res.status(400).send({
                status: false,
                message: `Error : Failed to sent to email`
            })
        }
    } catch (error) {  // if any internal error
        res.status(400).send({
            status: false,
            message: `Error : ${error.message}`
        })
    }

}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;  // extract email & otp from request
    console.log("EMAIL : "+email)
    console.log("OTP : "+otp)


    const myOtp = await Otp.findOne({ email: email });  // find for email in database
    console.log("OTP DATA : "+myOtp)
    if (myOtp != null) {  // if email exists in database
        if (myOtp.otp === otp) {  // if otp in database matches given otp
            await Otp.updateOne({ _id: myOtp._id }, { verified: true });
            res.status(200).send({
                status: true,
                message: 'Otp verified sucessfully'
            });
        } else {  // if otp in database doesn't match given otp
            res.status(401).send({
                status: false,
                message: 'Wrong otp'
            });
        }
    } else {  // if doesn't email exists in database
        res.status(401).send({
            status: false,
            message: 'This email was not sent an OTP'
        });
    }
}

module.exports = {
    sendOtp,
    verifyOtp,
    generateOTP,
    sendEmail
}

