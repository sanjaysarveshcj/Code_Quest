import React from 'react'
import Leftsidebar from '../../Comnponent/Leftsidebar/Leftsidebar'
import Taglist from './Taglist'
import './Tags.css'
import {tagsList} from './tagslist'
import { useTranslation } from 'react-i18next';

const Tags = ({slidein}) => {
    const { t } = useTranslation();

    return (
        <div className="home-container-1">
            <Leftsidebar slidein={slidein} />
            <div className="home-container-2">
                <h1 className="tags-h1">{t("Tags")}</h1>
                <p className="tags-p">
                    {t("A tag is a keyword or label that categorizes your question with other similar questions.")}
                </p>
                <p className="tags-p">
                    {t("Using the right tags makes it easier for others to find and answer your question.")}
                </p>
                <div className="tags-list-container">
                    {tagsList.map((tag, index) => (
                        <Taglist tag={tag} key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tags