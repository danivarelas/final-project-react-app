import React from 'react';

const CardHeaderSimple = (props) => {

    const { title } = props;

    return (
        <div className="block-section-header">
            <h3 className="block-section-header-text">{title}</h3>
        </div>
    );

}

export default CardHeaderSimple;