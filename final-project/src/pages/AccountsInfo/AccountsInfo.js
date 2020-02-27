import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Transfers from '../Transfers/Transfers';

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
                <Transfers account={account} />
            </div>
        </div>
    );

}

export default AccountsInfo;
