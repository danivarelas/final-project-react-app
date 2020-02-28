import React from 'react';
import './CardHeader.scss';
import { Link } from 'react-router-dom';

const CardHeader = (props) => {

    const { title, link, to } = props;

    return (
        <div className="block-section-header">
            <div className="block-section-header-edit">
                <Link to={to} className="button button--gray">{link}</Link>
            </div>
            <h3 className="block-section-header-text">{title}</h3>
        </div>
    );

}

export default CardHeader;