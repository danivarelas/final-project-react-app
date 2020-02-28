import React from 'react';
import './ExchangeRates.scss';

const ExchangeRates = (props) => {

    const { buy, sell } = props;

    return (
        <div className="exchange-rates">
            <p className="exchange-rates-title">Exchange rates today</p>
            <p className="exchange-rates-buy"><strong>Buy:</strong> {buy} CRC</p>
            <p className="exchange-rates-sell"><strong>Sell:</strong> {sell} CRC</p>
        </div>
    );

}

export default ExchangeRates;