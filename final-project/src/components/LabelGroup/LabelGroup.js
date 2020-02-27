import React from 'react';
import './LabelGroup.scss';

const LabelGroup = (props) => {

    const { title, text } = props;

    return (
        <div className="label-group row">
            <p className="label-title">{title}:</p>
            <p className="label-description">{text}</p>
        </div>
    );

}

export default LabelGroup;