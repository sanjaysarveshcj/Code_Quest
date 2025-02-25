import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';


const VideoUpload = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/send-otp", { email });
      setMessage("OTP sent to your email.");
    } catch (error) {
      setMessage(error.response.data.message || "Failed to send OTP.");
    }
  };

  const uploadVideo = async (e) => {
    e.preventDefault();
    if (!video) {
      setMessage("Please select a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);
    formData.append("video", video);

    try {
      const response = await axios.post("http://localhost:5000/api/upload-video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Video upload failed.");
    }
  };

  return (
    <div>
      <h2>{t("Upload Video")}</h2>
      <form onSubmit={uploadVideo}>
        <input
          type="email"
          placeholder={t("Enter your email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="button" onClick={sendOtp}>
          {t("Send OTP")}
        </button>
        <input
          type="text"
          placeholder={t("Enter OTP")}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files[0])}
          required
        />
        <button type="submit">{t("Upload Video")}</button>
      </form>
      {message && <p>{t(message)}</p>}
    </div>
  );
};

export default VideoUpload;
