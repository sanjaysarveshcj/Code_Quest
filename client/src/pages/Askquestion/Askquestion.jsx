import React, { useState } from "react";
import "./Askquestion.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { askquestion } from "../../action/question";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const Askquestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer);
  const [questiontitle, setquestiontitle] = useState("");
  const [questionbody, setquestionbody] = useState("");
  const [questiontag, setquestiontags] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", { email });
      setOtpSent(true);
      setMessage(response.data.message || "OTP sent successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      setOtpVerified(true);
      setMessage(response.data.message || "OTP verified successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  const handleVideoUpload = async (videoFile) => {
    const currentHour = new Date().getHours();
    if (currentHour < 14 || currentHour > 19) {
      alert("Video uploads are allowed only between 2 PM and 7 PM.");
      throw new Error("Video uploads are allowed only between 2 PM and 7 PM.");
    }

    if (!videoFile) {
      alert("No video file selected!");
      throw new Error("No video file selected!");
    }

    if (videoFile.size > 50 * 1024 * 1024) {
      alert("Video size exceeds 50MB.");
      throw new Error("Video size exceeds 50MB.");
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("email", email);
    formData.append("otp", otp);

    console.log("Uploading video:", formData.get("video"));


    try {
      const response = await axios.post("http://localhost:5000/questions/upload-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.videoPath;
    } catch (error) {
      console.error(error);
      throw new Error(error.response?.data?.message || "Failed to upload video.");
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!user) {
      alert("Login to ask a question");
      return;
    }

    if (!questionbody || !questiontitle || !questiontag) {
      alert("Please enter all the fields");
      return;
    }

    if (!videoFile) {
      alert("Please upload a video before posting your question.");
      return;
    }

    setIsSubmitting(true);
    let videoPath = null;

    if (videoFile) {
      try {
        videoPath = await handleVideoUpload(videoFile); 
      } catch (error) {
        alert(error.message);
        setIsSubmitting(false);
        return;
      }
    }

    dispatch(
      askquestion(
        {
          questiontitle,
          questionbody,
          questiontag,
          userposted: user.result.name,
          video: videoPath,
        },
        navigate
      )
    );

    setIsSubmitting(false);
    alert("You have successfully posted a question");
  };

  const handleenter = (e) => {
    if (e.code === "Enter") {
      setquestionbody(questionbody + "\n");
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>{t('Ask a public Question')}</h1>
        <form onSubmit={handlesubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>{t('Title')}</h4>
              <p>{t("Be specific and imagine you're asking a question to another person")}</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setquestiontitle(e.target.value);
                }}
                placeholder={t("e.g. Is there an R function for finding the index of an element in a vector?")}
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>{t('Body')}</h4>
              <p>{t('Include all the information someone would need to answer your question')}</p>
              <textarea
                id="ask-ques-body"
                onChange={(e) => {
                  setquestionbody(e.target.value);
                }}
                cols="30"
                rows="10"
                onKeyDown={handleenter}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>{t('Tags')}</h4>
              <p>{t('Add up to 5 tags to describe what your question is about')}</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setquestiontags(e.target.value.split(","));
                }}
                placeholder={t("e.g. (xml, typescript, wordpress)")}
              />
            </label>
          </div>

          <div className="otp-section">
            <label htmlFor="email">
              <h4>{t('Email')}</h4>
              <p>{t('Enter your email to receive an OTP')}</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('Enter your email')}
              />
            </label>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent}
              className="otp-btn"
            >
              {t('Send OTP')}
            </button>
            {otpSent && (
              <>
                <label htmlFor="otp">
                  <h4>{t('OTP')}</h4>
                  <p>{t('Enter the OTP sent to your email')}</p>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t('Enter OTP')}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified}
                  className="otp-btn"
                >
                  {t('Verify OTP')}
                </button>
              </>
            )}
          </div>

          {otpVerified && (
            <div className="video-upload-section">
              <label htmlFor="video-upload">
                <h4>{t('Upload Video')}</h4>
                <p>{t('Upload a video file (Max: 50MB)')}</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                />
              </label>
            </div>
          )}

          <input
            type="submit"
            value={t('Review your question')}
            className="review-btn"
            disabled={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default Askquestion;

