import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import validate from '../../utils/JWTParser';
import './Navbar.scss';

const Navbar = () => {

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
        if ("active" === active) {
            setActive("");
        } else {
            setActive("active");
        }
    }

    return (
        <div>
            <nav className={active} id="sidebar">
                <div className="sidebar-header">
                    <div className="header-btn-close">
                        <button type="button" id="sidebarCollapse" className="btn btn-outline-secondary" onClick={toggleSidebar}>
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
                    <i className="fas fa-sign-out-alt"></i>Logout
                </button>
                </div>
            </nav>
            <nav className="navbar sticky-top navbar-light bg-white">
                <button type="button" className="btn btn-outline-secondary nav-btn-collapse" onClick={toggleSidebar}>
                    <i className="fas fa-bars"></i>
                </button>
                <Link className="navbar-brand" to="/home">PowerBank</Link>
            </nav>

            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="logoutModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Logout</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to logout?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Navbar;

