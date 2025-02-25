import users from '../models/auth.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();


export const signup = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const extinguser = await users.findOne({ $or: [{ email }, { phone }] });
        if (extinguser) {
            return res.status(404).json({ message: "User already exist" });
        }
        const isPhoneValid = /^\+?[1-9]\d{1,14}$/.test(phone);
        if (!isPhoneValid) {
            return res.status(400).json({ message: "Invalid phone number format. Please use E.164 format (+1234567890)." });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const newuser = await users.create({
            name,
            email,
            phone,
            password: hashedpassword
        });
        const token = jwt.sign({
            email: newuser.email, id: newuser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )
        res.status(200).json({ result: newuser, token });
    } catch (error) {
        res.status(500).json("something went wrong...")
        return
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (!extinguser) {
            return res.status(404).json({ message: "User does not exists" })
        }
        const ispasswordcrct = await bcrypt.compare(password, extinguser.password);
        if (!ispasswordcrct) {
            res.status(400).json({ message: "Invalid credentiasl" });
            return
        }
        const token = jwt.sign({
            email: extinguser.email, id: extinguser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )

        res.status(200).json({ result: extinguser, token })
    } catch (error) {
        console.log(error)
        res.status(500).json("something went wrong...")
        return
    }
}

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD,
    },
});

const generateRandomPassword = () => {
    const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCase = "abcdefghijklmnopqrstuvwxyz";
    const allChars = upperCase + lowerCase;
    const passwordLength = 8; 
    let password = "";

    for (let i = 0; i < passwordLength; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    return password;
};

export const resetPassword = async (req, res) => {
    const { emailOrPhone } = req.body;

    try {
        const user = await users.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();

        if (
            user.resetPasswordRequestTime &&
            now - new Date(user.resetPasswordRequestTime) < 24 * 60 * 60 * 1000 
        ) {
            return res.status(429).json({
                message: "You can only request a password reset once per day.",
            });
        }

        const newPassword = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetPasswordRequestTime = now;
        await user.save();

        if (emailOrPhone.includes("@")) {
            const mailOptions = {
                from: process.env.EMAIL, 
                to: emailOrPhone, 
                subject: "Password Reset",
                text: `Your new Code Quest password is: ${newPassword}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({
                        message: "Failed to send email. Please try again.",
                    });
                } else {
                    console.log("Email sent:", info.response);
                    return res.status(200).json({
                        message: "Password reset successfully. Check your email for the new password.",
                    });
                }
            });
        } else {
            twilioClient.messages
                .create({
                    body: `Your new Code Quest password is: ${newPassword}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: emailOrPhone, 
                })
                .then((message) => {
                    console.log("SMS sent:", message.sid);
                    return res.status(200).json({
                        message: "Password reset successfully. Check your SMS for the new password.",
                    });
                })
                .catch((error) => {
                    console.error("Error sending SMS:", error);
                    return res.status(500).json({
                        message: "Failed to send SMS. Please try again.",
                    });
                });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};