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
    const [hasPayments, setHasPayments] = useState(false);

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
            } else {
                setHasPayments(true);
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

    let paymentsInCRC = [];
    let paymentsInUSD = [];
    let valuesCRC = [];
    let valuesUSD = [];
    let titles = [];

    if (serviceTypes) {
        titles = [serviceTypes.length];
        for (var i = 0; i < serviceTypes.length; i++) {
            valuesCRC[i] = 0;
            valuesUSD[i] = 0;
            titles[i] = serviceTypes[i].serviceTypeName;
        }
        if (payments) {
            paymentsInCRC = payments.filter((payment) => payment.currency === "CRC");
            paymentsInUSD = payments.filter((payment) => payment.currency === "USD");
            var j = 0;
            if (paymentsInCRC && paymentsInCRC.length) {
                for (j = 0; j < paymentsInCRC.length; j++) {
                    let payment = paymentsInCRC[j];
                    let amount = parseFloat(payment.amount);
                    let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
                    serviceTypeId = serviceTypeId[0];
                    if (serviceTypeId) {
                        serviceTypeId = serviceTypeId.serviceTypeId;
                        valuesCRC[serviceTypeId - 1] = valuesCRC[serviceTypeId - 1] + amount;
                    }
                }
            }
            if (paymentsInUSD && paymentsInUSD.length) {
                for (j = 0; j < paymentsInUSD.length; j++) {
                    let payment = paymentsInUSD[j];
                    let amount = parseFloat(payment.amount);
                    let serviceTypeId = services.filter((service) => payment.serviceId === service.id);
                    serviceTypeId = serviceTypeId[0];
                    if (serviceTypeId) {
                        serviceTypeId = serviceTypeId.serviceTypeId;
                        valuesUSD[serviceTypeId - 1] = valuesUSD[serviceTypeId - 1] + amount;
                    }
                }
            }
        }
    }

    return (
        <div class="wrapper">
            <div className="content">
                <Sidebar />
                <PageTitle title="All Payments" />
                <div className="block-section container-fluid">
                    <CardHeader title="Your Payments Overview" link="Pay Services" to="/payments/payServices" />
                    {hasPayments &&
                        <div className="row">
                            <div className="col-lg-6 payment-chart">
                                <h4>Spent in CRC</h4>
                                <PaymentsChart values={valuesCRC} titles={titles} />
                            </div>
                            <div className="col-lg-6 payment-chart">
                                <h4>Spent in USD</h4>
                                <PaymentsChart values={valuesUSD} titles={titles} />
                            </div>
                        </div>
                    }
                    {!hasPayments &&
                        <p>You haven't paid any services yet.</p>
                    }
                </div>

            </div>
        </div>
    );

}

export default Payments;