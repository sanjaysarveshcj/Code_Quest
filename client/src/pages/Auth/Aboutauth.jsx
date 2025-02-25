import React from 'react'
import { useTranslation } from 'react-i18next';


const Aboutauth = () => {
  const { t } = useTranslation();
  
  return (
    <div className="auth-container-1">
      <h1>{t('Join the Stack Overflow community')}</h1>
      <p>{t('Get unstuck — ask a question')}</p>
      <p>{t('Unlock new privileges like voting and commenting')}</p>
      <p>{t('Save your favorite tags, filters, and jobs')}</p>
      <p>{t('Earn reputation and badges')}</p>
      <p style={{ fontSize: "13px", color: "#666767" }}>
        {t('Collaborate and share knowledge with a private group for')}
      </p>
      <p style={{ fontSize: "13px", color: "#007ac6" }}>
        {t('Get Stack Overflow for Teams free for up to 50 users.')}
      </p>
    </div>
)}

export default Aboutauth