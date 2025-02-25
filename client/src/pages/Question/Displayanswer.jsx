import React from 'react';
import moment from 'moment';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Avatar from '../../Comnponent/Avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { deleteanswer, voteAnswer } from '../../action/question';
import upvoteIcon from '../../assets/sort-up.svg';
import downvoteIcon from '../../assets/sort-down.svg';
import { useTranslation } from 'react-i18next';



const Displayanswer = ({ question, handleshare }) => {
  const user = useSelector((state) => state.currentuserreducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const { t } = useTranslation();


  const handledelete = (answerid, noofanswers) => {
    dispatch(deleteanswer(id, answerid, noofanswers - 1));
  };

  const handleupvote=(answerid)=>{
          if(user=== null){
              alert("Login or Signup to answer a question")
              navigate('/Auth')
          }else{
              dispatch(voteAnswer(id,answerid,"upvote"))
          }
      }
      const handledownvote=(answerid)=>{
          if(user=== null){
              alert("Login or Signup to answer a question")
              navigate('/Auth')
          }else{
              dispatch(voteAnswer(id,answerid,"downvote"))
          }
      }

      return (
        <div>
            {question.answer.map((ans) => (
                <div className="display-ans" key={ans._id}>
                    <div className="answer-votes">
                        <img
                            src={upvoteIcon}
                            alt={t("Upvote")}
                            width={18}
                            className="votes-icon"
                            onClick={() => handleupvote(ans._id)}
                        />
                        <p>{t("Upvotes")}: {ans.upvote.length}</p>
                        <p>{t("Downvotes")}: {ans.downvote.length}</p>
                        <img
                            src={downvoteIcon}
                            alt={t("Downvote")}
                            width={18}
                            className="votes-icon"
                            onClick={() => handledownvote(ans._id)}
                        />
                    </div>
                    <p>{ans.answerbody}</p>
                    <div className="question-actions-user">
                        <div>
                            <button type="button" onClick={handleshare}>
                                {t("Share")}
                            </button>
                            {user?.result?._id === ans?.userid && (
                                <button
                                    type="button"
                                    onClick={() => handledelete(ans._id, question.noofanswers)}
                                >
                                    {t("Delete")}
                                </button>
                            )}
                        </div>
                        <div>
                            <p>{t("answered")} {moment(ans.answeredon).fromNow()}</p>
                            <Link
                                to={`Users/${ans.userid}`}
                                className="user-link"
                                style={{ color: '#0086d8' }}
                            >
                                <Avatar
                                    backgroundColor="lightgreen"
                                    px="2px"
                                    py="2px"
                                    borderRadius="2px"
                                >
                                    {ans.useranswered.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>{ans.useranswered}</div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Displayanswer;
