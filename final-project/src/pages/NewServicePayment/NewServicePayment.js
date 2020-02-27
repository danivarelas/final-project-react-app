import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Navbar from '../../components/Navbar/Navbar';
import Axios from 'axios';
import emailjs from 'emailjs-com';

const NewServicePayment = () => {

    const history = useHistory();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [serviceId, setServiceId] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [services, setServices] = useState([]);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [insufficientFunds, setInsufficientFunds] = useState(false);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            Axios.get(`http://localhost:8081/api/v1/account/byUserId/${claims.id}`, {
                headers: { JWT: token }
            }).then(res => {
                const { data } = res;
                setAccounts(data);
                setAccountNumber(data[0].accountNumber);
            }).catch(e => {

            });
            Axios.get(`http://localhost:8081/api/v1/service`, {
                headers: { JWT: token }
            }).then(res => {
                const { data } = res;
                console.log(data)
                setServices(data);
                setServiceId(data[0].id);
            }).catch(e => {

            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setInsufficientFunds(false);

        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        const validAmount = checkAmount();

        if (!validAmount) {
            validAmount ? setInvalidAmount(false) : setInvalidAmount(true);
        } else {
            const account = await checkAccount(accountNumber);

            const payment = {
                paymentNumber: Math.floor((Math.random() * 100000000) + 1000000000),
                paymentDescription: description,
                amount: amount,
                currency: account.currency,
                paymentDate: new Date(),
                userId: claims.id,
                accountId: account.id,
                serviceId: serviceId
            }

            console.log(payment)

            Axios.post(`http://localhost:8081/api/v1/payment`, payment, {
                headers: { JWT: token }
            }).then(res => {
                const {data} = res;
                const paidService = services.filter(service => service.id === data.serviceId)[0].serviceName;
                let templateParams = {
                    subject: `Service Payment: ${paidService}`,
                    email: 'daniel.varela.serrano@gmail.com',
                    name: 'Daniel',
                    from: 'PowerBank',
                    message: `You have successfully paid ${data.amount} ${data.currency} to the service: ${paidService}`
                };
                emailjs.send('gmail', 'template_8HJ8XF0v', templateParams, 'user_ykN9aw27EcEhXClqMft4o');
                history.goBack();
            }).catch(e => {
                console.log(e);
                setInsufficientFunds(true);
            });
        }
    }

    const checkAmount = () => {
        if (amount > 0) {
            return true;
        } else {
            return false;
        }
    };

    const checkAccount = async (number) => {
        let res = await Axios.get(`http://localhost:8081/api/v1/account/${number}`, {
            headers: { JWT: sessionStorage.getItem('JWT') }
        })
        return res.data.accountNumber ? res.data : null;
    };

    const handleCancel = () => { history.goBack(); }

    const handleAccount = event => {
        setAccountNumber(event.target.value);
    };

    const handleService = event => {
        setServiceId(event.target.value);
    };

    const handleDescription = event => {
        setDescription(event.target.value);
    };

    const handleAmount = event => {
        setAmount(event.target.value);
    };

    return (
        <div className="wrapper">
            <div id="content">
                <Navbar />
                <div className="block-section container-fluid">
                    <div className="block-section-header">
                        <h3 className="block-section-header-text">Pay Services</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Source Account</label>
                            <select className="form-control" id="source-account" onChange={handleAccount}>
                                {accounts.map((account, index) => {
                                    if (index === 0) {
                                        return <option key={account.id} value={account.accountNumber} selected>
                                            {account.accountNumber + " - " + account.balance + " " + account.currency}
                                        </option>;
                                    } else {
                                        return <option key={account.id} value={account.accountNumber}>
                                            {account.accountNumber + " - " + account.balance + " " + account.currency}
                                        </option>;
                                    }
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Service</label>
                            <select className="form-control" id="service" onChange={handleService}>
                                {services.map((service, index) => {
                                    if (index === 0) {
                                        return <option key={service.id} value={service.id} selected>{service.serviceName}</option>;
                                    } else {
                                        return <option key={service.id} value={service.id}>{service.serviceName}</option>;
                                    }
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input className="form-control" type="text" required onChange={handleDescription} />
                        </div>
                        <div className="form-group">
                            <label>Amount</label>
                            <input className="form-control" type="number" required step="0.01" onChange={handleAmount} />
                            <small id="passwordHelpBlock" className="form-text text-muted">
                                The amount has to be specified in the source account currency.
                            </small>
                            {invalidAmount &&
                                <div className="invalid-entry">You have to specify an amount greater than zero.</div>
                            }
                            {insufficientFunds &&
                                <div className="invalid-entry">You have insufficient funds.</div>
                            }
                        </div>

                        <button type="cancel" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="btn btn-success">Pay</button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default NewServicePayment;