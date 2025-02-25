import React from 'react'
import { useTranslation } from 'react-i18next';


const Taglist = ({tag}) => {
  const { t } = useTranslation();
  
  return (
    <div className="tag">
        <h5>{t(tag.tagName)}</h5>
        <p>{t(tag.tagDesc)}</p>
    </div>
  )
}

export default Taglist