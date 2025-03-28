import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/Footer.css';

const Footer = () => {
    return (
        <footer className="footer min-h-screen">
            <p>
                © {new Date().getFullYear()} Muller Automotive •{' '}
                <Link to="/rgpd" className="rgpd-link">
                    Politique de Confidentialité
                </Link>
            </p>
        </footer>
    );
};

export default Footer;
