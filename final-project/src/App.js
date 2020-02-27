import React, { useEffect, useState } from 'react';
import './App.scss';
import Login from './pages/Login/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import Payments from './pages/Payments/Payments';
import Transfers from './pages/Transfers/Transfers';
import Profile from './pages/Profile/Profile';
import validate from './utils/JWTParser';
import NewTransfer from './pages/NewTransfer/NewTransfer';
import OpenAccount from './pages/OpenAccount/OpenAccount';
import AccountsInfo from './pages/AccountsInfo/AccountsInfo';
import NewServicePayment from './pages/NewServicePayment/NewServicePayment';

function App() {

    const [redirect, setRedirect] = useState("");

    useEffect(() => {
        if (validate(sessionStorage.getItem('JWT'))) {
            setRedirect("/home");
        } else {
            setRedirect("/login");
        }
    }, [redirect]);

    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/home" component={Home} />
                <Route path="/accounts/openAccount" component={OpenAccount} />
                <Route path="/accounts/accountsInfo" component={AccountsInfo} />
                <Route path="/payments/payServices" component={NewServicePayment} />
                <Route path="/payments/creditCards" component={Payments} />
                <Route path="/payments" component={Payments} />
                <Route path="/transfers/newTransfer" component={NewTransfer} />
                <Route path="/transfers" component={Transfers} />
                <Route path="/profile" component={Profile} />
                <Redirect exact from="/" to={redirect} />
            </Switch>
        </Router>
    );
}

export default App;
