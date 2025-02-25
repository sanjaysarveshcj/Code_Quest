import React from 'react'
import { useTranslation } from 'react-i18next';

function Widgettag() {
    const tags = [
        "c",
        "css",
        "express",
        "firebase",
        "html",
        "java",
        "javascript",
        "mern",
        "mongodb",
        "mysql",
        "next.js",
        "node.js",
        "php",
        "python",
        "reactjs",
    ]
    const { t } = useTranslation();

    return (
        <div className="widget-tags">
            <h4>{t("Watched tags")}</h4>
            <div className="widget-tags-div">
                {tags.map((tag) => (
                    <p key={tag}>{tag}</p>
                ))}
            </div>
        </div>
    );
};

export default Widgettag