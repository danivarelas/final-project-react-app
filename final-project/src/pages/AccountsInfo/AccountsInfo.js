import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Transfers from '../Transfers/Transfers';
import LabelGroup from '../../components/LabelGroup/LabelGroup';

const AccountsInfo = (props) => {

    const history = useHistory();

    const { account } = props.location.state;

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        const claims = validate(sessionStorage.getItem('JWT'));
        if (claims) {
        }
    }, []);

    return (
        <div className="wrapper">
            <div id="content">
                <Navbar />
                <div>
                    <h2 className="page-title">Account Information</h2>
                </div>
                <div className="block-section container-fluid">
                    <div className="block-section-header">
                        <h3 className="block-section-header-text">Account Details</h3>
                    </div>
                    <div>
                        <LabelGroup title="Account Number" text={account.accountNumber}/>
                        <LabelGroup title="Description" text={account.description}/>
                        <LabelGroup title="Balance" text={`${account.balance} ${account.currency}`}/>
                    </div>
                </div>
                <Transfers account={account} />
            </div>
        </div>
    );

}

export default AccountsInfo;
