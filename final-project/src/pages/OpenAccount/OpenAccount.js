import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Navbar from '../../components/Navbar/Navbar';
import Axios from 'axios';
//import './NewTransfer.scss';

const OpenAccount = () => {

    const history = useHistory();

    const [currency, setCurrency] = useState("CRC");
    const [description, setDescription] = useState("");

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
    }, []);

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
        console.log(account)
        Axios.post(`http://localhost:8081/api/v1/account`, account, {
            headers: { JWT: token }
        })
            .then(res => {
                history.goBack();
            }).catch(e => {
                console.log(e);
            });
        }
    }


    const handleCancel = () => { history.goBack(); }

    const handleDescription = event => {
        setDescription(event.target.value);
    };

    const handleCurrency = event => {
        setCurrency(event.target.value);
    };

    return (
        <div className="wrapper">
            <div id="content">
                <Navbar />
                <div className="block-section container">
                    <div className="block-section-header">
                        <h3 className="block-section-header-text">Open Account</h3>
                    </div>
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
                        <button type="cancel" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="btn btn-success">Open</button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default OpenAccount;