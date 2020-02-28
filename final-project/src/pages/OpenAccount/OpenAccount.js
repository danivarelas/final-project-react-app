import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Axios from 'axios';
import emailjs from 'emailjs-com';
import CardHeaderSimple from '../../components/CardHeaderSimple/CardHeaderSimple';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

const OpenAccount = () => {

    const history = useHistory();

    const [currency, setCurrency] = useState("CRC");
    const [description, setDescription] = useState("");

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            const account = {
            accountNumber: Math.floor((Math.random() * 100000000) + 1000000000),
            description: description,
            balance: "0.00",
            currency: currency,
            userId: claims.id
        }
        
        const user = await getUser();

        Axios.post(`http://localhost:8081/api/v1/account`, account, {
            headers: { JWT: token }
        }).then(res => {
            const {data} = res;
            if (user) {
                let templateParams = {
                    subject: 'Account opened',
                    email: user.data.email,
                    name: user.data.name,
                    from: 'PowerBank',
                    message: `You have successfully opened the account: #${data.accountNumber}`
                };
                emailjs.send('gmail', 'template_8HJ8XF0v', templateParams, 'user_ykN9aw27EcEhXClqMft4o');
            }
                history.push("/home");
            }).catch(e => {
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

    const handleCancel = () => { history.push("/home"); }

    const handleDescription = event => {
        setDescription(event.target.value);
    };

    const handleCurrency = event => {
        setCurrency(event.target.value);
    };

    return (
        <div className="wrapper">
            <div id="content">
                <Sidebar />
                <PageTitle title="Open Account"/>
                <div className="block-section container-fluid">
                    <CardHeaderSimple title="New Account Details"/>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Currency</label>
                            <select className="form-control" id="currency" onChange={handleCurrency}>
                                <option value="CRC" selected>CRC</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input className="form-control" type="text" required onChange={handleDescription} />
                        </div>
                        <div className="btn-group-submit">
                        <button type="cancel" className="btn-cancel" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="btn-confirm">Open</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default OpenAccount;