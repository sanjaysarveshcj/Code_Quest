import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import axios from "axios";
import nodemailer from "nodemailer";
import userroutes from "./routes/user.js"
import questionroutes from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import session from "express-session"
import MongoStore from "connect-mongo";


const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());

const mongoURI = process.env.MONGO_URI;


app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
      collectionName: "sessions",
    }),
    cookie: { secure: false },
  })
);


app.use("/user", userroutes);
app.use('/questions', questionroutes)
app.use('/answer',answerroutes)
app.get('/', (req, res) => {
    res.send("Codequest is running perfect")
})

app.use("/uploads", express.static("uploads"));

let otps = {};

app.post("/api/send-otp", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Code Quest Chatbot",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const storedOtp = otps[email];
  if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }

  delete otps[email];
  res.status(200).json({ success: true, message: "OTP verified." });
});

app.post("/api/chatbot", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required." });
  }

  if (/java/i.test(question)) {
    return res.status(200).json({ answer: "I will not answer Java questions." });
  }

  try {
    console.log("Sending question to Hugging Face:", question);
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/bigcode/starcoder",
      { inputs: question },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    console.log("Hugging Face response:", response.data); 
    const answer = response.data[0]?.generated_text || "No answer available.";
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Failed to fetch answer from Hugging Face API.",
      error: error.response?.data || error.message,
    });
  }
});

app.post("/api/translate", async (req, res) => {
  const { text, targetLang, sourceLang = "en" } = req.body;

  const model = `Helsinki-NLP/opus-mt-${sourceLang}-${targetLang}`;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: text },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
    );

    console.log("Translation Response:", response.data);


    if (Array.isArray(response.data)) {
      return res.json(response.data.map(item => ({ translation_text: item.translation_text })));
    }

    res.status(500).json({ error: "Translation failed. Unexpected response format." });

  } catch (error) {
    console.error("Translation Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Translation service error" });
  }
});



const PORT = process.env.PORT || 5000
const database_url = process.env.MONGODB_URL

app.listen(PORT, () => { console.log(`server running on port ${PORT}`) })

mongoose
  .connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
