import '../assets/style/Header.css';
import {Link, useLocation, useNavigate} from "react-router-dom";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    let linkedto;

    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '') {
        linkedto = '/alternate_login';
    } else if (location.pathname === '/facial_recognition' || location.pathname === '/alternate_login') {
        linkedto = '/';
    } else {
        linkedto = '/home';
    }

    const handleLogout = () => {

        navigate('/');
    };

    return (
        <nav className="nav">
            <Link to={linkedto}>
                <img src="/image/MullerLogo.webp" className="site-title" alt="MullerLogo" />
            </Link>
            {location.pathname === '/admin_panel' || location.pathname === '/home' && (
                <button className="logout-button" onClick={handleLogout}>
                    Déconnexion
                </button>
            )}
        </nav>
    );
}

export default Header;