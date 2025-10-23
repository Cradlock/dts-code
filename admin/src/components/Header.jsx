import { Link } from "react-router-dom";
import "../css/header.css";
import { FaGoogle } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../auth";


const Header = () => {
    const { info,setInfo } = useContext(AuthContext);
    
    const logoutSubmit = async () => {
        window.location.href = `${process.env.REACT_APP_API}/accounts/logout/`
    }
    
    return (
        <header>
            <div className="header_pages">
                <Link to={"/events"}> <button>События</button> </Link>
                <Link to={"/products"}> <button>Товары</button> </Link>
                <Link to={"/panel"}> <button>Панель управления</button> </Link>
                <Link to={"/"}> <button>Главная</button> </Link>
                <Link to={"/orders"}> <button>Заказы</button> </Link>
            </div>
            
            
            <div className="header_auth">
                
                { info ? 
                    ( 
                       <button onClick={() => logoutSubmit()}> Logout</button> )
                    : 
                    (<Link to={"/login"}> <FaGoogle className="header_icon" /> </Link>)

                }
            
            
            </div>
        
        
        </header>
    )
}

export default Header;