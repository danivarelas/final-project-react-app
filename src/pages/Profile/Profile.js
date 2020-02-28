import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import Axios from 'axios';
import LabelGroup from '../../components/LabelGroup/LabelGroup';
import CardHeaderSimple from '../../components/CardHeaderSimple/CardHeaderSimple';
import PageTitle from '../../components/PageTitle/PageTitle';
import Sidebar from '../../components/Sidebar/Sidebar';

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
            <div className="content">
                <Sidebar />
                <PageTitle title="Profile"/>
                <div className="block-section container-fluid">
                    <CardHeaderSimple title="Personal Information"/>
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