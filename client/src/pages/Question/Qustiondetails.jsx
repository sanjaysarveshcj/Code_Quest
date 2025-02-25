import React,{useState} from 'react'
import moment from 'moment'
import copy from "copy-to-clipboard"
import upvote from "../../assets/sort-up.svg"
import downvote from "../../assets/sort-down.svg"
import './Question.css'
import Avatar from '../../Comnponent/Avatar/Avatar'
import Displayanswer from './Displayanswer'
import { useSelector, useDispatch } from "react-redux"
import { Link ,useNavigate,useLocation,useParams} from 'react-router-dom'
import {deletequestion,votequestion,postanswer} from '../../action/question'
import { useTranslation } from 'react-i18next';

const Qustiondetails = () => {
    const [answer,setanswer]=useState("")
    const dispatch=useDispatch()
    const questionlist=useSelector((state)=>state.questionreducer)
    const { id } = useParams();
    const user =useSelector((state)=>state.currentuserreducer)
    const location=useLocation()
    const navigate=useNavigate()
    const { t } = useTranslation();

    const url="http://localhost:3000"
    const handlepostans=(e,answerlength)=>{
        e.preventDefault();
        if(user ===null){
            alert("Login or Signup to answer a question")
            navigate('/Auth')
        }else{
            if(answer===""){
                alert("Enter an answer before submitting")
            }else{
                dispatch(postanswer({id,
                    noofanswers:answerlength+1,
                    answerbody:answer,
                    useranswered:user.result.name}));
                setanswer("")
            }
        }
    }
    const handleshare=()=>{
        copy(url + location.pathname);
        alert("Copied url :" + url + location.pathname)
    }

    const handledelete=()=>{
        dispatch(deletequestion(id,navigate))
    }
    const handleupvote=()=>{
        if(user=== null){
            alert("Login or Signup to answer a question")
            navigate('/Auth')
        }else{
            dispatch(votequestion(id,"upvote"))
        }
    }
    const handledownvote=()=>{
        if(user=== null){
            alert("Login or Signup to answer a question")
            navigate('/Auth')
        }else{
            dispatch(votequestion(id,"downvote"))
        }
    }

    return (
        <div className="question-details-page">
            {questionlist.data === null ? (
                <h1>{t("Loading...")}</h1>
            ) : (
                <>
                    {questionlist.data.filter((question) => question._id === id).map((question) => (
                        <div key={question._id}>
                            <section className="question-details-container">
                                <h1>{question.questiontitile}</h1>
                                <div className="question-details-container-2">
                                    <div className="question-votes">
                                        <img src={upvote} alt={t("Upvote")} width={18} className="votes-icon" onClick={handleupvote} />
                                        <p>{question.upvote.length - question.downvote.length}</p>
                                        <img src={downvote} alt={t("Downvote")} width={18} className="votes-icon" onClick={handledownvote} />
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <p className="question-body">{question.questionbody}</p>
                                        {question.video && (
                                            <video className="question-video" controls>
                                                <source src={question.video} type="video/mp4" />
                                                {t("Your browser does not support the video tag.")}
                                            </video>
                                        )}
                                        <div className="question-details-tags">
                                            {question.questiontags.map((tag) => (
                                                <p key={tag}>{tag}</p>
                                            ))}
                                        </div>
                                        <div className="question-actions-user">
                                            <div>
                                                <button type="button" onClick={handleshare}>
                                                    {t("Share")}
                                                </button>
                                                {user?.result?._id === question?.userid && (
                                                    <button type="button" onClick={handledelete}>{t("Delete")}</button>
                                                )}
                                            </div>
                                            <div>
                                                <p>{t("Asked")} {moment(question.askedon).fromNow()}</p>
                                                <Link to={`Users/${question.userid}`} className="user-link" style={{ color: "#0086d8" }}>
                                                    <Avatar backgroundColor="orange" px="8px" py="5px" borderRadius="4px">
                                                        {question.userposted.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <div>{question.userposted}</div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {question.noofanswers !== 0 && (
                                <section>
                                    <h3>{question.noofanswers} {t("Answers")}</h3>
                                    <Displayanswer key={question._id} question={question} handleshare={handleshare} />
                                </section>
                            )}
                            <section className="post-ans-container">
                                <h3>{t("Your Answer")}</h3>
                                <form onSubmit={(e) => handlepostans(e, question.answer.length)}>
                                    <textarea cols="30" rows="10" value={answer} onChange={(e) => setanswer(e.target.value)}></textarea>
                                    <br />
                                    <input type="submit" className="post-ans-btn" value={t("Post your Answer")} />
                                </form>
                                <p>
                                    {t("Browse other questions tagged")}
                                    {question.questiontags.map((tag) => (
                                        <Link to="/Tags" key={tag} className="ans-tag">
                                            {" "}{tag}{" "}
                                        </Link>
                                    ))}{" "}
                                    {t("or")} 
                                    <Link to="/Askquestion" style={{ textDecoration: "none", color: "#009dff" }}>
                                        {" "}{t("Ask your own question")}
                                    </Link>
                                </p>
                            </section>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
export default Qustiondetails