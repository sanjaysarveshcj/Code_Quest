import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import "./chatbot.css";

const Chatbot = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [answer, setAnswer] = useState("");
  const { t } = useTranslation();
  

  const handleSendOtp = async () => {
    if (!email || !question) {
      setMessage("Please enter your email and question.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", { email });
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      if (response.data.success) {
        setVerified(true);
        setMessage("OTP verified! Fetching the answer...");
        fetchAnswer();
      } else {
        setMessage("Invalid or expired OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to verify OTP. Please try again.");
    }
  };

  const fetchAnswer = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", { question });
      setAnswer(response.data.answer);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred while fetching the answer.");
    }
  };

  return (
    <div className="chatbot-container">
      <h2>{t('Chatbot with OTP Verification')}</h2>

      {!otpSent ? (
        <>
          <textarea
            placeholder={t('Enter your question')}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="chatbot-textarea"
          />
          <input
            type="email"
            placeholder={t('Enter your email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="chatbot-input"
          />
          <button onClick={handleSendOtp} className="chatbot-button">
            {t('Send OTP')}
          </button>
        </>
      ) : !verified ? (
        <>
          <input
            type="text"
            placeholder={t('Enter OTP')}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="chatbot-input"
          />
          <button onClick={handleVerifyOtp} className="chatbot-button">
            {t('Verify & Get Response')}
          </button>
        </>
      ) : (
        <pre className="chatbot-answer">{t(answer)}</pre>
      )}

      {message && <p className="chatbot-message">{t(message)}</p>}
    </div>
);
};


export default Chatbot;
