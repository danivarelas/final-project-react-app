import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Axios from 'axios';
import emailjs from 'emailjs-com';
import LabelGroup from '../../components/LabelGroup/LabelGroup';
import NoAccounts from '../../components/NoAccounts/NoAccounts';
import CardHeaderSimple from '../../components/CardHeaderSimple/CardHeaderSimple';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

const NewServicePayment = () => {

    const history = useHistory();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [serviceId, setServiceId] = useState("");

    const [accounts, setAccounts] = useState([]);
    const [hasAccounts, setHasAccounts] = useState(false);
    const [services, setServices] = useState([]);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [insufficientFunds, setInsufficientFunds] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        if (description && amount && serviceId) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            if (!accounts.length) {
                Axios.get(`http://localhost:8081/api/v1/account/byUserId/${claims.id}`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    setAccounts(data);
                    setAccountNumber(data[0].accountNumber);
                }).catch(e => {

                });
            } else {
                setHasAccounts(true);
            }
            if (!services.length) {
                Axios.get(`http://localhost:8081/api/v1/service`, {
                    headers: { JWT: token }
                }).then(res => {
                    const { data } = res;
                    setServices(data);
                    setServiceId(data[0].id);
                }).catch(e => {

                });
            }
        }
    }, [accounts, serviceId, services, amount, description]);

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

            const user = await getUser();

            Axios.post(`http://localhost:8081/api/v1/payment`, payment, {
                headers: { JWT: token }
            }).then(res => {
                const { data } = res;
                const paidService = services.filter(service => service.id === data.serviceId)[0].serviceName;
                if (user) {
                    let templateParams = {
                        subject: 'Transfer succesful',
                        email: user.data.email,
                        name: user.data.name,
                        from: 'PowerBank',
                        message: `You have successfully paid ${data.amount} ${data.currency} to the service: ${paidService}`
                    };
                    emailjs.send('gmail', 'template_8HJ8XF0v', templateParams, 'user_ykN9aw27EcEhXClqMft4o');
                }
                history.push("/payments");
            }).catch(e => {
                setInsufficientFunds(true);
            });
        }
    }

    const getUser = async () => {
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            let res = await Axios.get(`http://localhost:8081/api/v1/user/byUsername/${claims.username}`);
            return res;
        } else {
            return null;
        }
    };

    const checkAmount = () => {
        return amount > 0 ? true : false;
    };

    const checkAccount = async (number) => {
        let res = await Axios.get(`http://localhost:8081/api/v1/account/${number}`, {
            headers: { JWT: sessionStorage.getItem('JWT') }
        })
        return res.data.accountNumber ? res.data : null;
    };

    const handleCancel = () => { history.push("/home"); }

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

    const toggleDisabled = event => {
        setInputDisabled(!inputDisabled);
        setInvalidAmount(false);
        setInsufficientFunds(false);
    };
    
    const findService = (services && services.length) ? services.filter(service => service.id === serviceId)[0] : null;
    const serviceName = findService ? findService.serviceName : "";

    return (
        <div className="wrapper">
            <div id="content">
                <Sidebar />
                <PageTitle title="Pay Services"/>
                {hasAccounts &&
                    <div className="block-section container-fluid">
                        <CardHeaderSimple title="Payment Details"/>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Source Account</label>
                                <select disabled={inputDisabled} className="form-control" id="source-account" onChange={handleAccount}>
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
                                <select disabled={inputDisabled} className="form-control" id="service" onChange={handleService}>
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
                                <input disabled={inputDisabled} className="form-control" type="text" required onChange={handleDescription} />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input disabled={inputDisabled} className="form-control" type="number" required step="0.01" onChange={handleAmount} />
                                <small id="passwordHelpBlock" className="form-text text-muted">
                                    The amount has to be specified in the source account currency.
                            </small>
                                {invalidAmount &&
                                    <div className="invalid-entry">You have to enter an amount greater than zero.</div>
                                }
                                {insufficientFunds &&
                                    <div className="invalid-entry">You have insufficient funds.</div>
                                }
                            </div>
                            {!inputDisabled &&
                                <div className="btn-group-submit">
                                    <button type="cancel" className="button button--red" onClick={handleCancel}>Cancel</button>
                                    <button disabled={submitDisabled} type="button" className="button button--green" data-toggle="collapse" data-target="#collapsePayment" aria-expanded="false" aria-controls="collapsePayment" onClick={toggleDisabled}>Continue</button>
                                </div>
                            }
                            <div class="collapse mt-5" id="collapsePayment">
                                <div class="card card-body confirm-container">
                                    <h4 className="confirm-container-title">Confirm Transaction</h4>
                                    <LabelGroup title="Source Account" text={accountNumber} />
                                    <LabelGroup title="Service" text={serviceName} />
                                    <LabelGroup title="Description" text={description} />
                                    <LabelGroup title="Amount" text={amount} />
                                    <div className="btn-group-submit">
                                        <button onClick={toggleDisabled} type="button" className="button button--red" data-toggle="collapse" data-target="#collapsePayment" aria-expanded="false" aria-controls="collapsePayment">Back</button>
                                        <button type="submit" className="button button--green">Pay</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                }
                {!hasAccounts &&
                    <NoAccounts/>
                }
            </div>
        </div>
    );
}

export default NewServicePayment;