import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './Multilingual.css';
import { useTranslation } from "react-i18next";

const Multilingual = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [translatedText, setTranslatedText] = useState(null);
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("selectedLanguage") || "en");
  const [confirmedLanguage, setConfirmedLanguage] = useState(localStorage.getItem("selectedLanguage") || "en");
  const [translationComplete, setTranslationComplete] = useState(false);



  const location = useLocation();


  const translatePage = async (lang, retryCount = 0) => {

    try {
        console.log(`Requesting translation for: ${lang}`);

        const elements = document.body.getElementsByTagName("*");
        let textNodes = [];

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            for (let node of element.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "" &&
                    window.getComputedStyle(element).display !== "none") {
                    textNodes.push({ node, text: node.nodeValue.trim() });
                }
            }

            if (element.placeholder) {
                textNodes.push({ node: element, text: element.placeholder, isPlaceholder: true });
            }
        }

        let texts = textNodes.map(item => item.text);
        const response = await axios.post("http://localhost:5000/api/translate", {
            text: texts,
            targetLang: lang,
        });

        console.log("Full Translation Response:", response.data);

        if (response.data?.error && response.data.error.includes("Model Helsinki-NLP")) {
            if (retryCount < 5) {
                console.log(`Retrying translation in 5 seconds... (${retryCount + 1}/5)`);
                setTimeout(() => translatePage(lang, retryCount + 1), 5000);
            } else {
                setTranslatedText("Translation failed after multiple attempts.");
            }
            return;
        }

        if (Array.isArray(response.data) && response.data.length === textNodes.length) {
            textNodes.forEach((item, index) => {
                let translatedText = response.data[index]?.translation_text || item.text;
                if (item.isPlaceholder) {
                    item.node.placeholder = translatedText;
                } else {
                    item.node.nodeValue = translatedText;
                }
            });

            setTranslatedText("Translation successful ✅");
        } else {
            console.error("Unexpected response format:", response.data);
        }
    } catch (error) {
        console.error("Translation Error:", error.response?.data || error.message);
    }
};


const resetForm = () => {
  setEmailOrMobile("");
  setOtp("");
  setIsVerified(false);
  setMessage("");
  setTranslatedText(null);
  setTranslationComplete(false);
};


const handleLanguageChange = async (lang) => {
  console.log("Selected Language:", lang);
  setLanguage(lang); 
  setSelectedLang(lang);
  
  setTranslatedText(null);

  if (isVerified) {
    await i18n.changeLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
    setConfirmedLanguage(lang);

    setTranslationComplete(true);
      
      setTimeout(() => {
        resetForm();
      }, 2000);
  }
};



  const handleSendOtp = async () => {
    if (!emailOrMobile) {
      alert(language === "fr" ? "Veuillez entrer votre email." : "Please enter an email or mobile number.");
      return;
    }

    const endpoint = language === "fr" ? "/api/send-otp" : "/user/send-otp-mobile";
    const payload = language === "fr" ? { email: emailOrMobile } : { mobile: emailOrMobile };

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert(language === "fr" ? "Veuillez entrer le code OTP." : "Please enter the OTP.");
      return;
    }

    const endpoint = language === "fr" ? "/api/verify-otp" : "/user/verify-otp-mobile";
    const payload = language === "fr" ? { email: emailOrMobile, otp } : { mobile: emailOrMobile, otp };

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setMessage(response.data.message || "OTP verified successfully!");
      localStorage.setItem('isOtpVerified', 'true');
      setIsVerified(true);

      await i18n.changeLanguage(language);
      localStorage.setItem("selectedLanguage", language);
      setConfirmedLanguage(language); 

      setTranslationComplete(true);
      
      setTimeout(() => {
        resetForm();
      }, 2000);






    } catch (error) {
      setLanguage(confirmedLanguage);
      setSelectedLang(confirmedLanguage);
      setMessage(error.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  return (
    <div className="otp-page">
      <h1 className="otp-title">
        {isVerified && !translationComplete
          ? (translatedText || t("welcomeMessage"))
          : t("welcomeMessage")}
      </h1>
  
      <select
        className="otp-language-selector"
        onChange={(e) => handleLanguageChange(e.target.value)}
        value={language}
      >
        <option value="en">{t("english")}</option>
        <option value="es">{t("spanish")}</option>
        <option value="hi">{t("hindi")}</option>
        <option value="pt">{t("portuguese")}</option>
        <option value="zh">{t("chinese")}</option>
        <option value="fr">{t("french")}</option>
      </select>
  
      <div className="otp-input-container">
        {language === "fr" ? (
          <input
            className="otp-input"
            type="email"
            placeholder={t("enterEmail")}
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
        ) : (
          <input
            className="otp-input"
            type="text"
            placeholder={t("enterMobile")}
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
          />
        )}
        <button className="otp-button" onClick={handleSendOtp}>
          {t("sendOtp")}
        </button>
      </div>
  
      {message && <p className={`otp-message ${isVerified && !translationComplete ? "success" : "error"}`}>{message}</p>}
  
      {emailOrMobile && !isVerified && (
        <div className="otp-verification-container">
          <input
            className="otp-input"
            type="text"
            placeholder={t("enterOtp")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="otp-button" onClick={handleVerifyOtp}>
            {t("verifyOtp")}
          </button>
        </div>
      )}
  
      {isVerified && !translationComplete && (
        <p className="otp-success-message">
          {translatedText || t("verificationSuccess")}
        </p>
      )}
      {translationComplete && (
        <p className="otp-success-message">
          {t("translationComplete")}
        </p>
      )}
    </div>
  );
  
};

export default Multilingual;
