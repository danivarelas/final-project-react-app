import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import CardHeader from '../../components/CardHeader/CardHeader';

const Accounts = (props) => {

    const { accounts } = props;

    const history = useHistory();

    const [showAccounts, setShowAccounts] = useState(false);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        if (accounts && accounts.length) {
            setShowAccounts(true);
        } else {
            setShowAccounts(false);
        }
    }, [accounts]);

    return (
        <div className="block-section container-fluid">
            <CardHeader title="Accounts" link="Open Account" to="/accounts/openAccount"/>
            {!showAccounts && <p>You don't have any open accounts to your name.</p>}
            {showAccounts && <div>
                <p>This is the list of accounts linked to your profile.</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Balance</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map(account => {
                            return <tr>
                                <td>{account.accountNumber}</td>
                                <td>{account.balance + " " + account.currency}</td>
                                <td><Link to={{ pathname: '/accounts/accountsInfo', state: { account }}}>
                                    <i className="fas fa-eye"></i></Link>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            }
        </div>
    );

}

export default Accounts;