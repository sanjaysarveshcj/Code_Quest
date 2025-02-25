import React from 'react'
import './Homemainbar.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Questionlist from './Questionlist'
import { useTranslation } from 'react-i18next';

function Homemainbar() {
  const user = useSelector((state)=>state.currentuserreducer)
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const questionlist = useSelector((state)=>state.questionreducer)
  // console.log(questionlist)
  const checkauth = () => {
    if (user === null) {
      alert("Login or signup to ask a question")
      navigate("/Auth")
    } else {
      navigate("/Askquestion")
    }
  }
  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? (
          <h1>{t('Top Question')}</h1>
        ) : (
          <h1>{t('All Question')}</h1>
        )}
        <button className="ask-btn" onClick={checkauth}>{t('Ask Questions')}</button>
      </div>
      <div>
        {questionlist.data === null ? (
          <h1>{t('Loading...')}</h1>
        ) : (
          <>
            <p>{t('{{count}} questions', { count: questionlist.data.length })}</p>
            <Questionlist questionlist={questionlist.data} />
          </>
        )}
      </div>
    </div>
);

}

export default Homemainbar