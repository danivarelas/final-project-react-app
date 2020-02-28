import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import './Sidebar.scss';
import Navbar from '../Navbar/Navbar';
import LogoutModal from '../LogoutModal/LogoutModal';

const Sidebar = () => {

    const history = useHistory();

    const [active, setActive] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        let claims = validate(sessionStorage.getItem('JWT'));
        if (claims) {
            setUser(claims.name);
        }
    }, [user]);

    const handleLogout = () => {
        sessionStorage.setItem('JWT', '');
        history.push("/login");
    }

    const toggleSidebar = () => {
        "active" === active ? setActive("") : setActive("active");
    }

    return (
        <div>
            <nav className={`sidebar ${active}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="header-btn-close">
                        <button type="button" id="sidebarCollapse" className="button button--lightgray" onClick={toggleSidebar}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="header-title">
                        <h3>Hello, {user}</h3>
                    </div>
                </div>
                <ul className="list-unstyled components">
                    <li className="sidebar-link"><Link to="/home"><i class="fas fa-home"></i> Summary</Link></li>
                    <li className="sidebar-link"><Link to="/payments"><i class="fas fa-money-check-alt"></i> Payments</Link></li>
                    <li className="sidebar-link"><Link to="/transfers/newTransfer"><i class="fas fa-exchange-alt"></i> Transfer</Link></li>
                    <li className="sidebar-link"><Link to="/profile"><i class="fas fa-user"></i> Profile</Link></li>
                </ul>
                <div className="btn-logout-container">
                <button className="btn-logout" type="button" data-toggle="modal" data-target="#logoutModal">
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
                </div>
            </nav>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="logoutModalTitle" aria-hidden="true">
                <LogoutModal handleLogout={handleLogout}/>
            </div>
        </div>

    );
}

export default Sidebar;