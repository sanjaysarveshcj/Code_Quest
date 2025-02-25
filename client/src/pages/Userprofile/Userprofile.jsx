import React, { useState, useEffect } from 'react';
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../../Comnponent/Avatar/Avatar';
import Editprofileform from './Edirprofileform';
import Profilebio from './Profilebio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBirthdayCake, faPen, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getUserPoints } from '../../action/points.js';
import TransferPoints from './TransferPoints.jsx';
import { useTranslation } from 'react-i18next';

const Userprofile = ({ slidein }) => {
  const { id } = useParams();
  const [activeComponent, setActiveComponent] = useState('ProfileBio'); // Default to ProfileBio
  const dispatch = useDispatch();
  const { t } = useTranslation();


  const users = useSelector((state) => state.usersreducer);
  const currentprofile = users.filter((user) => user._id === id)[0];
  const currentuser = useSelector((state) => state.currentuserreducer);
  const points = useSelector((state) => state.pointsReducer);

  useEffect(() => {
    if (currentuser?.result._id) {
      dispatch(getUserPoints(currentuser?.result._id));
    }
  }, [currentuser, dispatch]);

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentprofile?.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentprofile?.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> {t("Joined")}{" "}
                  {moment(currentprofile?.joinedon).fromNow()}
                </p>
                <p className="user-points">
                  <strong>{t("Points")}: </strong>
                  {points.points}
                </p>
                {currentuser?.result?._id === id && (
                  <button
                    className="edit-profile-btn"
                    type="button"
                    onClick={() => setActiveComponent('TransferPoints')}
                  >
                    <FontAwesomeIcon icon={faExchangeAlt} /> {t("Transfer Points")}
                  </button>
                )}
              </div>
            </div>
            {currentuser?.result?._id === id && (
              <button
                className="edit-profile-btn"
                type="button"
                onClick={() => setActiveComponent('EditProfileForm')}
              >
                <FontAwesomeIcon icon={faPen} /> {t("Edit Profile")}
              </button>
            )}
          </div>
          <>
            {activeComponent === 'EditProfileForm' && (
              <Editprofileform
                currentuser={currentuser}
                setswitch={() => setActiveComponent('ProfileBio')}
              />
            )}
            {activeComponent === 'ProfileBio' && currentprofile && (
              <Profilebio currentprofile={currentprofile} />
            )}
            {activeComponent === 'TransferPoints' && currentprofile && (
              <TransferPoints currentprofile={currentprofile} />
            )}
          </>
        </section>
      </div>
    </div>
  );
};


export default Userprofile;
