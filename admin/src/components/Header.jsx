import { Link } from "react-router-dom";
import "../css/header.css";
import { FaGoogle } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../auth";

const Header = () => {
    const { info, setInfo } = useContext(AuthContext);
    
    const logoutSubmit = async () => {
        window.location.href = `${process.env.REACT_APP_API}/accounts/logout/`;
    };
    
    return (
        <header>
            <div className="header_pages">
                <Link to={"/events"}> <button>Иш-чаралар</button> </Link> {/* События */}
                <Link to={"/products"}> <button>Товарлар</button> </Link> {/* Товары */}
                <Link to={"/panel"}> <button>Башкаруу панели</button> </Link> {/* Панель управления */}
                <Link to={"/"}> <button>Башкы бет</button> </Link> {/* Главная */}
                <Link to={"/orders"}> <button>Заказдар</button> </Link> {/* Заказы */}
            </div>
            
            <div className="header_auth">
                {info ? (
                    <button onClick={() => logoutSubmit()}> Чыгуу </button> // Logout -> Чыгуу
                ) : (
                    <Link to={"/login"}> <FaGoogle className="header_icon" /> </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
