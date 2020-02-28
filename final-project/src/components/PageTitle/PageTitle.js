import React from 'react';
import './PageTitle.scss';

const PageTitle = (props) => {

    const { title } = props;

    return (
        <div className="container-fluid">
            <div className="row">
                <h2 className="page-title">{title}</h2>
            </div>
        </div>
    );

}

export default PageTitle;