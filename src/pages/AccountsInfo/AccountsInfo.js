import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Transfers from '../Transfers/Transfers';
import LabelGroup from '../../components/LabelGroup/LabelGroup';
import CardHeaderSimple from '../../components/CardHeaderSimple/CardHeaderSimple';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

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
            <div className="content">
                <Sidebar />
                <PageTitle title="Account Information"/>
                <div className="block-section container-fluid">
                    <CardHeaderSimple title="Account Details"/>
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
