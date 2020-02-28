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
            <CardHeaderSimple title={title} />
            {!showTransfers && <p>{emptyMessage}</p>}
            {showTransfers && <div>
                <div className="transfers-container">
                    {transfers.map(transfer => {
                        return <div className="transfer">
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <span><strong>#:</strong></span>
                                        <span>{transfer.transferNumber}</span>
                                    </div>
                                    <div className="row">
                                        <span><strong>Description:</strong></span>
                                        <span>{transfer.transferDescription}</span>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="row">
                                        <span><strong>Date:</strong></span>
                                        <span>{format(parseISO(transfer.transferDate), 'dd/MM/yyyy')}</span>
                                    </div>
                                    <div className="row">
                                        <span><strong>Amount:</strong></span>
                                        {isOutgoing && <span className="outgoing-amount">{`${transfer.amount} ${account.currency}`}</span>}
                                        {!isOutgoing && <span className="incoming-amount">{`${transfer.targetAmount} ${account.currency}`}</span>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    })}
                </div>

            </div>
            }

        </div>
    );

}

export default TransfersList;