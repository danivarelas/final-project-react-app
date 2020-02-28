import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import './Register.scss'
import emailjs from 'emailjs-com';

const Register = () => {

    const history = useHistory();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidPassword, setInvalidPassword] = useState(false);

    useEffect(() => {}, [invalidUsername, invalidEmail, invalidPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setInvalidPassword(false);
            const user = {
                name,
                lastName,
                email,
                username,
                password,
                countryCode,
                phoneNumber
            }

            const userUsername = await checkUsername();
            const userEmail = await checkEmail();
            
            if(userUsername.data.username || userEmail.data.email) {
                userUsername.data.username ? setInvalidUsername(true) : setInvalidUsername(false);
                userEmail.data.email ? setInvalidEmail(true) : setInvalidEmail(false);
            } else {
                Axios.post(`http://localhost:8081/api/v1/user`, user)
                .then(res => {
                    const {data} = res;
                    let templateParams = {
                        subject: 'Welcome to PowerBank',
                        email: data.email,
                        name: data.name,
                        from: 'PowerBank',
                        message: 'Your account has been created successfully.'
                    };
                    emailjs.send('gmail', 'template_8HJ8XF0v', templateParams, 'user_ykN9aw27EcEhXClqMft4o');
                    history.push("/login");
                }).catch(e => {
                    console.log(e);
                });
            }
        } else {
            setInvalidPassword(true);
        }
    }

    const checkUsername = async () => {
        let res = await Axios.get(`http://localhost:8081/api/v1/user/byUsername/${username}`);
        return res;
    };

    const checkEmail = async () => {
        let res = await Axios.get(`http://localhost:8081/api/v1/user/byEmail/${email}`);
        return res;
    };

    const handleName = event => { setName(event.target.value); }

    const handleLastname = event => { setLastName(event.target.value); }

    const handleUsername = event => { setUsername(event.target.value); }

    const handleEmail = event => { setEmail(event.target.value); }

    const handleCode = event => { setCountryCode(event.target.value); }

    const handlePhone = event => { setPhoneNumber(event.target.value); }

    const handlePassword = event => {
        if (event.target.value === "") {
            setInvalidPassword(false);
            setPassword("");
        } else {
            let hash = Base64.stringify(sha256(event.target.value));
            if (hash !== confirmPassword) {
                setInvalidPassword(true);
            } else {
                setInvalidPassword(false);
            }
            setPassword(hash);
        }
    }

    const handleConfirmPassword = event => {
        if (event.target.value === "") {
            setInvalidPassword(false);
            setConfirmPassword("");
        } else {
            let hash = Base64.stringify(sha256(event.target.value));
            if (hash !== password) {
                setInvalidPassword(true);
            } else {
                setInvalidPassword(false);
            }
            setConfirmPassword(hash);
        }
    }

    const handleCancel = () => { history.push("/login"); }

    return (
        <div className="container">
            <h1>Create a PowerBank account</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-sm-6">
                        <label>Name</label>
                        <input className="form-control" type="text" required onChange={handleName} placeholder="John" />
                    </div>
                    <div className="form-group col-sm-6">
                        <label>Last Name</label>
                        <input className="form-control" type="text" required onChange={handleLastname} placeholder="Doe" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input className="form-control" type="text" required onChange={handleUsername} placeholder="jdoe" />
                    {invalidUsername &&
                        <div className="invalid-entry">Username is already taken.</div>
                    }
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" required onChange={handleEmail} placeholder="jdoe@email.com" />
                    {invalidEmail &&
                        <div className="invalid-entry">Email is already taken.</div>
                    }
                </div>
                <div className="form-row">
                    <div className="form-group col-sm-3">
                        <label>Country Code</label>
                        <input type="number" className="form-control" required onChange={handleCode} placeholder="506" />
                    </div>
                    <div className="form-group col-sm-9">
                        <label>Phone Number</label>
                        <input type="number" className="form-control" required onChange={handlePhone} placeholder="88888888" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" type="password" required onChange={handlePassword}></input>
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        Your password must be minimum 8 characters long and contain at least one uppercase letter,
                        one lowercase letter and one number. It must not contain spaces or special characters.
                    </small>
                </div>
                <div className="form-group">
                    <label> Confirm Password</label>
                    <input className="form-control" type="password" required onChange={handleConfirmPassword}></input>
                    {invalidPassword &&
                        <div className="invalid-entry">Passwords don't match.</div>
                    }
                </div>
                <div className="btn-group-submit">
                    <button className="button button--red" type="cancel" onClick={handleCancel}>Cancel</button>
                    <button className="button button--green" type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}
export default Register;