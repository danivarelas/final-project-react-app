import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import { format, parseISO } from 'date-fns';
import './TransfersList.scss';
import CardHeaderSimple from '../CardHeaderSimple/CardHeaderSimple';

const TransfersList = (props) => {

    const { transfers, account, title, emptyMessage, isOutgoing } = props;

    const history = useHistory();

    const [showTransfers, setShowTransfers] = useState(false);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        if (transfers && transfers.length) {
            setShowTransfers(true);
        } else {
            setShowTransfers(false);
        }
    }, [transfers]);

    return (
        <div className="block-section container-fluid">
            <CardHeaderSimple title={title}/>
            {!showTransfers && <p>{emptyMessage}</p>}
            {showTransfers && <div>
                <div className="table-responsive-md">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers.map(transfer => {
                                return <tr>
                                    <td>{transfer.transferNumber}</td>
                                    <td>{transfer.transferDescription}</td>
                                    <td>{format(parseISO(transfer.transferDate), 'dd/MM/yyyy')}</td>
                                    {isOutgoing && <td className="outgoing-amount">{`${transfer.amount} ${account.currency}`}</td>}
                                    {!isOutgoing && <td className="incoming-amount">{`${transfer.targetAmount} ${account.currency}`}</td>}
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
            }
            
        </div>
    );

}

export default TransfersList;