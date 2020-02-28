import React from 'react';
import { Link } from 'react-router-dom';
import CardHeaderSimple from '../CardHeaderSimple/CardHeaderSimple';

const NoAccounts = () => {

    return (
        <div className="block-section container-fluid">
            <CardHeaderSimple title="No Accounts"/>
            <p>It seems you don't have any open accounts. You need an account to:</p>
            <ul>
                <li>Transfer money between accounts.</li>
                <li>Perform service payments.</li>
            </ul>
            <p>You can open an account <Link to="/accounts/openAccount">here</Link>.</p>
        </div>
    );

}

export default NoAccounts;