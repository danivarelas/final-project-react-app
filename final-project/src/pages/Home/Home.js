import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Home.scss';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Axios from 'axios';
import Accounts from '../Accounts/Accounts';
import { format } from 'date-fns';

const Home = () => {

    const history = useHistory();

    const [accounts, setAccounts] = useState([]);
    const [exchangeRates, setExchangeRates] = useState({});

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            if (!accounts.length) {
                Axios.get(`http://localhost:8081/api/v1/account/byUserId/${claims.id}`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    console.log(data)
                    setAccounts(data);
                }).catch(e => {

                });
            }
            let dateToday = new Date();
            dateToday = format(dateToday, "dd/MM/yyyy");
            Axios.get(`https://tipodecambio.paginasweb.cr/api/${dateToday}`)
                .then(res => {
                    const { data } = res;
                    setExchangeRates(data);
                });
        }
    }, [accounts, exchangeRates]);

    return (
        <div className="wrapper">
            <div id="content">
                <Navbar />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <h2 className="page-title">Products Summary</h2>
                        </div>
                        <div className="col">
                            <div className="exchange-rates">
                                <p className="exchange-rates-title">Exchange rates today</p>
                                <p><strong>Buy:</strong> {exchangeRates.compra} CRC</p>
                                <p><strong>Sell:</strong> {exchangeRates.venta} CRC</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Accounts accounts={accounts} />
            </div>
        </div>
    );

}

export default Home;