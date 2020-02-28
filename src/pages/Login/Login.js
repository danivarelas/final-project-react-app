import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Login.scss';
import { Link, useHistory } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const Login = () => {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalidLogin, setInvalidLogin] = useState(false);

    useEffect(() => { }, [invalidLogin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setInvalidLogin(false);
        const user = {
            username: username,
            password: password
        }
        Axios.post(`http://localhost:8081/api/v1/login`, user)
            .then(res => {
                sessionStorage.setItem('JWT', res.data);
                history.push("/home");
            }).catch(e => {
                setInvalidLogin(true);
            });
    }

    const handleUsername = event => { setUsername(event.target.value); }

    const handlePassword = event => {
        const hash = Base64.stringify(sha256(event.target.value));
        setPassword(hash);
    }

    return (
        <div className="login-container">
            <div class="bg-image"></div>
            <div className="login-form-container">
                <div className="login-form-container-content">
                    <div className="row">
                    <div className="col-md-6 login-form">
                            <div>
                                <h1 className="login-form-title">Login to PowerBank</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input className="form-control" type="text" required onChange={handleUsername}></input>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input className="form-control" type="password" required onChange={handlePassword}></input>
                                    </div>
                                    {
                                        invalidLogin &&
                                        <div className="invalid-entry">Wrong username or password.</div>
                                    }
                                    <div className="btn-group-submit">
                                        <button className="button button--green" type="submit">Login</button>
                                    </div>
                                </form>
                                <p>Don't have an account? <Link to="/register">Register here</Link>.</p>
                            </div>
                        </div>
                        <div className="col-md-6 bank-info">
                            <h2 className="bank-info-title"><i class="fab fa-superpowers"></i> PowerBank</h2>
                            <p>With PowerBank you can:</p>
                            <ul>
                                <li>Transfer money</li>
                                <li>Pay lots of services</li>
                                <li>Visualize your expenses</li>
                                <li>Generate reports</li>
                            </ul>
                            <br/>
                            <p>Create your account now to start enjoying this benefits.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;

/** */