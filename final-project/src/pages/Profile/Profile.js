import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Navbar from '../../components/Navbar/Navbar';
import Axios from 'axios';
import './Profile.scss';

const Profile = () => {

    const history = useHistory();

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    if (!validate(sessionStorage.getItem('JWT'))) {
        history.push("/login");
    }

    useEffect(() => {
        const token = sessionStorage.getItem('JWT');
        const claims = validate(token);
        if (claims) {
            setUsername(claims.username);
            Axios.get(`http://localhost:8081/api/v1/user/byUsername/${claims.username}`, {
                headers: { JWT: token }
            }).then(res => {
                const { data } = res;
                setName(data.name);
                setLastName(data.lastName);
                setEmail(data.email);
                setCountryCode(data.countryCode);
                setPhoneNumber(data.phoneNumber);
            }).catch(e => {

            });
        }
    }, [username]);

    return (
        <div className="wrapper">
            <div id="content">
                <Navbar />
                <div className="block-section container-fluid">
                    <div className="block-section-header">
                        <h3 className="block-section-header-text">Personal Information</h3>
                    </div>
                    <div>
                        <div className="label-group row">
                            <label className="label-title col-md-2">Name:</label>
                            <label className="label-description col-md-2">{name}</label>
                        </div>
                        <div className="label-group row">
                            <label className="label-title col-md-2">Last Name:</label>
                            <label className="label-description col-md-2">{lastName}</label>
                        </div>
                        <div className="label-group row">
                            <label className="label-title col-md-2">Username:</label>
                            <label className="label-description col-md-2">{username}</label>
                        </div>
                        <div className="label-group row">
                            <label className="label-title col-md-2">Email:</label>
                            <label className="label-description col-md-2">{email}</label>
                        </div>
                        <div className="label-group row">
                            <label className="label-title col-md-2">Phone Number:</label>
                            <label className="label-description col-md-2">{"+" + countryCode + " " + phoneNumber}</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Profile;