import { fetchallusers } from './action/users';
import './App.css';
import {useEffect, useState} from 'react';
import Navbar from './Comnponent/Navbar/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Allroutes from './Allroutes'
import { useDispatch } from 'react-redux';
import { fetchallquestion } from './action/question';
import { useTranslation } from 'react-i18next';
import './i18n'

function App() {
  const { i18n } = useTranslation();
  const [slidein,setslidein]=useState(true)
  const dispatch=useDispatch()


  useEffect(() => {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';
    const isVerified = localStorage.getItem('isOtpVerified') === 'true'; // Check OTP status

    if (isVerified) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

useEffect(()=>{
  dispatch(fetchallusers());
  dispatch(fetchallquestion());
},[dispatch])

  useEffect(()=>{
    if(window.innerWidth<= 768){
      setslidein(false)
    }
  },[])
  const handleslidein=()=>{
    if(window.innerWidth<=768){
      setslidein((state)=> !state);
    }
  };

  return (
    <div className="App">
      <Router>
      <Navbar handleslidein={handleslidein}/>
      <Allroutes slidein={slidein} handleslidein={handleslidein}/>
      </Router>
    </div>
  );
}

export default App;
