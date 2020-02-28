import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Axios from 'axios';
import './NewTransfer.scss';
import { format } from 'date-fns';
import LabelGroup from '../../components/LabelGroup/LabelGroup';
import NoAccounts from '../../components/NoAccounts/NoAccounts';
import emailjs from 'emailjs-com';
import CardHeaderSimple from '../../components/CardHeaderSimple/CardHeaderSimple';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

const NewTransfer = () => {

    const history = useHistory();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [sourceAccountNumber, setSourceAccountNumber] = useState("");
    const [targetAccountNumber, setTargetAccountNumber] = useState("");
    const [exchangeRates, setExchangeRates] = useState({});

    const [accounts, setAccounts] = useState([]);
    const [hasAccounts, setHasAccounts] = useState(false);
    const [invalidAmount, setInvalidAmount] = useState(false);
    const [insufficientFunds, setInsufficientFunds] = useState(false);
    const [sameAccountt, setSameAccount] = useState(false);
    const [invalidAccount, setInvalidAccount] = useState(false);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        if (description && amount && targetAccountNumber) {
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
                    setSourceAccountNumber(data[0].accountNumber);
                }).catch(e => {

                });
            } else {
                setHasAccounts(true);
            }
            let dateToday = new Date();
            dateToday = format(dateToday, "dd/MM/yyyy");
            Axios.get(`https://tipodecambio.paginasweb.cr/api/${dateToday}`)
                .then(res => {
                    const { data } = res;
                    setExchangeRates(data);
                });
        }
    }, [inputDisabled, submitDisabled, description, amount, targetAccountNumber, accounts]);

    const handleSubmit = async (e) => {
        const token = sessionStorage.getItem('JWT');
        e.preventDefault();
        if (sourceAccountNumber !== targetAccountNumber) {
            setSameAccount(false);
            setInsufficientFunds(false);

            const validAmount = checkAmount();
            const validAccount = await checkAccount(targetAccountNumber);

            if (!validAmount || !validAccount) {
                validAmount ? setInvalidAmount(false) : setInvalidAmount(true);
                validAccount ? setInvalidAccount(false) : setInvalidAccount(true);
            } else {
                const sourceAccount = await checkAccount(sourceAccountNumber);
                const targetAccount = await checkAccount(targetAccountNumber);

                const transfer = {
                    transferNumber: Math.floor((Math.random() * 100000000) + 1000000000),
                    transferDescription: description,
                    amount: amount,
                    transferDate: new Date(),
                    sourceAccountId: sourceAccount.id,
                    targetAccountId: targetAccount.id
                }

                const { compra, venta } = exchangeRates;
                const user = await getUser();
                Axios.post(`http://localhost:8081/api/v1/transfer?buy=${compra}&sell=${venta}`, transfer, {
                    headers: { JWT: token }
                }).then(res => {
                    if (user) {
                        let templateParams = {
                            subject: 'Transfer succesful',
                            email: user.data.email,
                            name: user.data.name,
                            from: 'PowerBank',
                            message: `You have transfered ${transfer.amount} ${sourceAccount.currency} to: #${targetAccountNumber}.`
                        };
                        emailjs.send('gmail', 'template_8HJ8XF0v', templateParams, 'user_ykN9aw27EcEhXClqMft4o');
                    }
                    history.push("/home");
                }).catch(e => {
                    setInsufficientFunds(true);
                });
            }
        } else {
            setInvalidAccount(false);
            setSameAccount(true);
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

    const handleSourceAccount = event => {
        let { value } = event.target;
        setSourceAccountNumber(value);
    };

    const handleDescription = event => {
        let { value } = event.target;
        setDescription(value);
    };

    const handleAmount = event => {
        let { value } = event.target;
        setAmount(value);
    };

    const handleTargetAccount = event => {
        let { value } = event.target;
        setTargetAccountNumber(value);
    };

    const toggleDisabled = event => {
        setInputDisabled(!inputDisabled);
        setInvalidAccount(false);
        setSameAccount(false);
        setInvalidAmount(false);
        setInsufficientFunds(false);
    };

    return (
        <div className="wrapper">
            <div className="content">
                <Sidebar />
                <PageTitle title="New Transfer"/>
                {hasAccounts &&
                    <div className="block-section container-fluid">
                        <CardHeaderSimple title="Transfer Details"/>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Source Account</label>
                                <select disabled={inputDisabled} className="form-control" id="source-account" onChange={handleSourceAccount}>
                                    {accounts.map((account, index) => {
                                        if (index === 0) {
                                            return <option key={account.id} value={account.accountNumber} >
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
                            <div className="form-group">
                                <label>Target Account</label>
                                <input disabled={inputDisabled} className="form-control" type="text" required onChange={handleTargetAccount} />
                                {invalidAccount &&
                                    <div className="invalid-entry">This account doesn't exist.</div>
                                }
                                {sameAccountt &&
                                    <div className="invalid-entry">You can't transfer funds to the same account.</div>
                                }
                            </div>
                            {!inputDisabled &&
                                <div className="btn-group-submit">
                                    <button type="cancel" className="button button--red" onClick={handleCancel}>Cancel</button>
                                    <button disabled={submitDisabled} type="button" className="button button--green" data-toggle="collapse" data-target="#collapseTransfer" aria-expanded="false" aria-controls="collapseTransfer" onClick={toggleDisabled}>Continue</button>
                                </div>
                            }
                            <div class="collapse mt-5" id="collapseTransfer">
                                <div class="card card-body confirm-container">
                                    <h4 className="confirm-container-title">Confirm Transaction</h4>
                                    <LabelGroup title="Source Account" text={sourceAccountNumber} />
                                    <LabelGroup title="Description" text={description} />
                                    <LabelGroup title="Amount" text={amount} />
                                    <LabelGroup title="Target Account" text={targetAccountNumber} />
                                    <div className="btn-group-submit">
                                        <button onClick={toggleDisabled} type="button" className="button button--red" data-toggle="collapse" data-target="#collapseTransfer" aria-expanded="false" aria-controls="collapseTransfer">Back</button>
                                        <button type="submit" className="button button--green">Transfer</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                }
                {!hasAccounts &&
                    <NoAccounts />
                }
            </div>
        </div>
    );
}

export default NewTransfer;