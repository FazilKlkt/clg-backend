const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcrypt');
const { generateOTP, sendEmail } = require('./otpController');

const addUser = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        if ((await User.findOne({ email: email })) != null) { //  if user already exists
            res.status(400).send({
                status: false,
                message: `User already exists`
            })
        } else {
            const user = new User({ email: email, username: username, password: password }) //  create new user in database
            await user.save()
            res.status(201).send({
                status: true,
                id: user._id, // return id of user for future use
                message: `User created`
            })
        }
    } catch (error) {  // if any internal error
        res.status(400).send({
            status: false,
            message: `Error : ${error.message}`
        })
    }
}

// write comments
const getAllUser = async (req, res) => {
    try {
        const user = await User.find({}, '_id email username files')
        res.status(200).send({
            status: true,
            user: user
        })
    } catch (error) {
        res.status(400).send({
            status: false,
            message: `Error : ${error.message}`
        })
    }
}

const getUser = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {  // if invalid id is provided
            res.status(400).send({
                status: false,
                message: "Invalid Id"
            })
        } else {
            const user = await User.findById(req.params.id, '_id email username files')
            .populate({
                path: 'files',
                select: 'fileName filePath',
                options: { sort: { createdAt: -1 } }
            });
            if (user === null) {  // if user is not found in database
                res.status(400).send({
                    status: false,
                    message: "User not found"
                })
            } else {  // if user is found in database
                res.status(200).send({
                    status: true,
                    user: user
                })
            }
        }
    } catch (error) {
        res.status(400).send({
            status: false,
            message: `Error : ${error.message}`
        })
    }
}

// write comments
const updatePassSendOtp = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user === null) {  // if user is not found in database
            res.status(400).send({
                status: false,
                message: "User not found"
            })
        } else {
            // generate OTP & send email
            const myOtp = await generateOTP();
            await sendEmail(email, myOtp);
            await Otp.findOneAndUpdate(
                { email: email },
                { email: email, otp: myOtp, newPassword: newPassword, verified: false },
                { upsert: true }
            );
            res.status(200).send({
                status: true,
                message: "Otp sent"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: false,
            message: `Error : ${error.message}`
        })
    }
}

// write comments
const updatePassCheckOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const myOtp = await Otp.findOne({ email: email });
        if (myOtp === null) {
            res.status(400).send({
                status: false,
                message: `No Otp was sent on this email`
            });
        } else {
            if (myOtp.otp === otp) {
                const user = await User.findOne({ email: email })
                user.password = myOtp.newPassword;
                user.password = await bcrypt.hash(user.password, 10);
                await user.save();
                res.status(200).send({
                    status: true,
                    message: `Password changed sucessfully`
                });
            } else {
                res.status(400).send({
                    status: false,
                    message: `Wrong Otp`
                });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            status: false,
            message: `Error: ${error.message}`
        });
    }
}

// write comments
const checkPass = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch)
            res.status(200).send({
                status: true,
                id: user._id,
                message: "Verification sucessful"
            });
        else
            res.status(401).send({
                status: false,
                message: "Verification failed "
            });
    } catch (error) {
        res.status(401).send({
            status: false,
            message: `Error: ${error.message}`
        });
    }
}

module.exports = {
    addUser,
    getUser,
    getAllUser,
    updatePassSendOtp,
    updatePassCheckOtp,
    checkPass
}
