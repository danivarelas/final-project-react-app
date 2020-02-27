import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Navbar from '../../components/Navbar/Navbar';
import Axios from 'axios';
import './Profile.scss';
import LabelGroup from '../../components/LabelGroup/LabelGroup';

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
                <div className="container-fluid">
                    <div className="row">
                        <h2 className="page-title">Profile</h2>
                    </div>
                </div>
                <div className="block-section container-fluid">
                    <div className="block-section-header">
                        <h3 className="block-section-header-text">Personal Information</h3>
                    </div>
                    <div>
                        <LabelGroup title="Name" text={name}/>
                        <LabelGroup title="Last Name" text={lastName}/>
                        <LabelGroup title="Username" text={username}/>
                        <LabelGroup title="Email" text={email}/>
                        <LabelGroup title="Phone Number" text={`+${countryCode} ${phoneNumber}`}/>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Profile;