import express from "express"
import  {login, signup, resetPassword} from '../controller/auth.js'
import { getallusers,updateprofile, searchUser, transferPoints } from "../controller/users.js";
import auth from "../middleware/auth.js"
import { getUserPoints  } from "../controller/points.js";
import twilio from "twilio"
import dotenv from "dotenv";

dotenv.config()

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/reset-password", resetPassword);

router.get("/getallusers",getallusers)

router.post("/update/:id", updateprofile)

router.get('/userpoints/:id',getUserPoints)

router.get("/search", searchUser);

router.post("/transfer", transferPoints);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const otpStore = new Map();

router.post("/send-otp-mobile", async (req, res) => {
    const { mobile } = req.body;

    if (!mobile) {
        return res.status(400).json({ message: "Mobile number is required." });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        otpStore.set(mobile, otp);

        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: twilioPhone,
            to: mobile,
        });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Twilio Error:", error);
        res.status(500).json({ message: "Failed to send OTP via Twilio." });
    }
});

router.post("/verify-otp-mobile", (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: "Mobile number and OTP are required." });
    }

    const storedOtp = otpStore.get(mobile);

    if (storedOtp && storedOtp === otp) {
        otpStore.delete(mobile);
        return res.json({ message: "OTP verified successfully!" });
    }

    res.status(400).json({ message: "Invalid or expired OTP." });
});


export default router