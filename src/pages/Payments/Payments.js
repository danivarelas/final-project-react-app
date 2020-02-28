import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import './Payments.scss'
import Axios from 'axios';
import PaymentsChart from '../../components/PaymentsChart/PaymentsChart';
import CardHeader from '../../components/CardHeader/CardHeader';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

const Payments = () => {

    const history = useHistory();

    const [payments, setPayments] = useState([]);
    const [services, setServices] = useState([]);
    const [serviceTypes, setServiceTypes] = useState([]);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            if (!payments.length) {
                Axios.get(`http://localhost:8081/api/v1/payment/byUserId/${claims.id}`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    setPayments(data);
                }).catch(e => {

                });
            }
            if (!services.length) {
                Axios.get(`http://localhost:8081/api/v1/service`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    setServices(data);
                }).catch(e => {

                });
            }
            if (!serviceTypes.length) {
                Axios.get(`http://localhost:8081/api/v1/serviceType`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    setServiceTypes(data);
                }).catch(e => {

                });
            }
        }
    }, [payments, services, serviceTypes]);

    return (
        <div class="wrapper">
            <div id="content">
                <Sidebar />
                <PageTitle title="All Payments"/>
                <div className="block-section container-fluid">
                    <CardHeader title="Monthly Payments Overview" link="Pay Services" to="/payments/payServices"/>
                    <div className="row">
                        <div className="col-md-6 payment-chart">
                            <h4>Spent in CRC</h4>
                            <PaymentsChart chartId="totalCRC" payments={payments} serviceTypes={serviceTypes} services={services} isUSD={false} />
                        </div>
                        <div className="col-md-6 payment-chart">
                            <h4>Spent in USD</h4>
                            <PaymentsChart chartId="totalUSD" payments={payments} serviceTypes={serviceTypes} services={services} isUSD={true} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );

}

export default Payments;