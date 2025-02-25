import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { resetpassword } from "../../api/index";
import { useTranslation } from 'react-i18next';


const ResetPassword = () => {
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await resetpassword(emailOrPhone);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-container-2">
                <h1>{t('Reset Password')}</h1>
                <form onSubmit={handleResetPassword}>
                    <label htmlFor="emailOrPhone">
                        <h4>{t('Email or Phone')}</h4>
                        <input
                            type="text"
                            id="emailOrPhone"
                            name="emailOrPhone"
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                        />
                    </label>
                    <button type="submit" className="auth-btn">
                        {t('Reset Password')}
                    </button>
                </form>
                {message && <p>{t(message)}</p>}
            </div>
        </section>
    );
    };    

export default ResetPassword;