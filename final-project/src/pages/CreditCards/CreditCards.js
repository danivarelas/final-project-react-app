import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import { useEffect } from 'react';

const CreditCards = (props) => {

    const { creditCards } = props;

    const history = useHistory();

    const [showCards, setShowCards] = useState(false);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        if (creditCards && creditCards.length) {
            setShowCards(true);
        } else {
            setShowCards(false);
        }

    }, [creditCards]);

    return (
        <div className="block-section container">
            <div className="block-section-header">
                <div className="block-section-header-edit">
                    <Link>Request card</Link>
                </div>
                <h3 className="block-section-header-text">Credit Cards</h3>
            </div>
            {!showCards && <p>You don't have any credit cards to your name.</p>}
            {showCards && <div>
                <p>This is the list of credit cards linked to your profile.</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Balance</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditCards.map(card => {
                            return <tr>
                                <td>{card.cardNumber}</td>
                                <td>{card.balance + " " + card.currency}</td>
                                <td>
                                    <button type="button" className="btn btn-outline-secondary"><i className="fas fa-pen"></i></button>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default CreditCards;