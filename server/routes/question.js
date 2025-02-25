import express from "express";
import {
  Askquestion,
  getallquestion,
  deletequestion,
  votequestion,
} from "../controller/Question.js";
import multer from "multer";
import path from "path";
import fs from "fs";

import auth from "../middleware/auth.js";

const router = express.Router();

const videoUploadPath = path.join("uploads/videos");
if (!fs.existsSync(videoUploadPath)) {
  fs.mkdirSync(videoUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, videoUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); 
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed."));
    }
    cb(null, true);
  },
});

router.post("/upload-video", upload.single("video"), (req, res) => {
  console.log("Received video upload request");
  console.log("File Details:", req.file);

  if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded." });
  }

  const baseURL = "http://localhost:5000";  
  let videoPath = req.file.path.replace(/\\/g, "/");  
  videoPath = `${baseURL}/${videoPath}`;

  console.log("Video uploaded to:", videoPath);
  return res.status(200).json({ 
      message: "Video uploaded successfully.", 
      videoPath 
  });
});


router.post("/Ask", auth, upload.single("video"), Askquestion);

router.get("/get", getallquestion);

router.delete("/delete/:id", auth, deletequestion);

router.patch("/vote/:id", auth, votequestion);

export default router;
