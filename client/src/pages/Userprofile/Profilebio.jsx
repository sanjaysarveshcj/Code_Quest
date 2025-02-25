import React from 'react'
import { useTranslation } from 'react-i18next';


const Profilebio = ({currentprofile}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div>
        {currentprofile?.tags.length !== 0 ? (
          <>
            <h4>{t('Tags watched')}</h4>
            {currentprofile?.tags.map((tag) => (
              <p key={tag}>{tag}</p>
            ))}
          </>
        ) : (
          <p>{t('0 Tags watched')}</p>
        )}
      </div>
      <div>
        {currentprofile?.about ? (
          <> 
            <h4>{t('About')}</h4>
            <p>{currentprofile?.about}</p>
          </>
        ) : (
          <p>{t('No bio found')}</p>
        )}
      </div>
    </div>
  )
}


export default Profilebio