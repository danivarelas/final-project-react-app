import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar = (props) => {

    const { toggleSidebar } = props;

    return (
        <nav className="navbar sticky-top navbar-light bg-white">
            <button type="button" className="button button--gray nav-btn-collapse" onClick={toggleSidebar}>
                <i className="fas fa-bars"></i>
            </button>
            <Link className="navbar-brand" to="/home"><i className="fab fa-superpowers"></i> PowerBank</Link>
        </nav>
    );
}

export default Navbar;

