import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import "./Auth.css"
import icon from '../../assets/icon.png'
import Aboutauth from './Aboutauth'
import { signup, login } from '../../action/auth'
import { useTranslation } from 'react-i18next';

const Auth = () => {
    const [issignup, setissignup] = useState(false)
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [password, setpassword] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const handlesubmit = (e) => {
        e.preventDefault();
        if (!email && !password) {
            alert("Enter email and password")
        }
        if (issignup) {
            if (!name || !phone) {
                alert("Enter a name to continue")
            }
            dispatch(signup({ name, email, phone, password }, navigate))
            
        } else {
            dispatch(login({ email, password }, navigate))
        
        }
    }
    const handleswitch = () => {
        setissignup(!issignup);
        setname("");
        setemail("");
        setphone("");
        setpassword("")

    }

    return (
        <section className="auth-section">
            {issignup && <Aboutauth />}
            <div className="auth-container-2">
                <img src={icon} alt="icon" className='login-logo' />
                <form onSubmit={handlesubmit}>
                    {issignup && (
                        <>
                        <label htmlFor="name">
                            <h4>{t('Display Name')}</h4>
                            <input type="text" id='name' name='name' value={name} onChange={(e) => {
                                setname(e.target.value);
                            }} />
                        </label>
                        <label htmlFor="phone">
                            <h4>{t('Phone Number')}</h4>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setphone(e.target.value)}
                                required
                            />
                        </label>
                        </>
                    )}
                    <label htmlFor="email">
                        <h4>{t('Email')}</h4>
                        <input type="email" id='email' name='email' value={email} onChange={(e) => {
                            setemail(e.target.value);
                        }} />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>{t('Password')}</h4>
                            {!issignup && (
                                <Link to="/reset-password" style={{ color: "#007ac6", fontSize: "13px" }}>
                                    {t('Forgot Password?')}
                                </Link>
                            )}
                        </div>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => {
                            setpassword(e.target.value)
                        }} />
                    </label>
                    <button type='submit' className='auth-btn'>
                        {issignup ? t('Sign up') : t('Log in')}
                    </button>
                </form>
                <p>
                    {issignup ? t('Already have an account?') : t("Don't have an account?")}
                    <button type='button' className='handle-switch-btn' onClick={handleswitch}>
                        {issignup ? t('Log in') : t('Sign up')}
                    </button>
                </p>
            </div>
        </section>
    );}
    
export default Auth;
    