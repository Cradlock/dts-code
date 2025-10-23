import React, { useState,useEffect, useContext } from "react";
import Load from "../components/Load";
import "../css/login.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth";
import { FcGoogle } from "react-icons/fc";

const api_url = process.env.REACT_APP_API;

const Login = () => {
    const google_login = `${api_url}/accounts/google/login/`;
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [loading, setLoading] = useState(null);

    const [formData,setFormData] = useState({username:"",password:""})

    const [visible,setVisible] = useState(false)

    const showNotification = (text) => {
        setVisible(text);
 
        setTimeout(() => {
          setVisible(false);
        }, 2000);
  };
    
    const handleChange = (e) => {
        setFormData( (prev) => ( {...prev, [e.target.name] : e.target.value } ) )
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        
        try{
        const res = await fetch(`${api_url}/accounts/login/`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-type":"application/x-www-form-urlencoded"},
            
            body: new URLSearchParams({
                username: formData.username,
                password: formData.password
            }).toString(    )
        })

        if(res.ok){
            window.location.href = "/"
        } else{
            showNotification(res.text())
        }

        } catch(error){
            showNotification(error.message)
        }


    }

    useEffect(() => {
        const fetch_request = async () => {
            try{
                const res = await fetch(google_login, {
                    method: "GET",
                    headers: {"Content-type":"application/json"}
                })

                const data = await res.json();
                setRedirectUrl(data.redirect_url);
                
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        
        fetch_request();
    }, [google_login])
    

    return ( 
    <div className="login-container">

        <form className="login-form" onSubmit={handelSubmit}>
            <input type="text" name="username" placeholder="username"  value={formData.username} onChange={handleChange}/>
            <input type="password" name="password" placeholder="password" value={formData.password} onChange={handleChange} /> 

            <button type="submit">Log In</button>
            
            <div className="login_btns">
                            
                {loading ? (<Load />) : redirectUrl ? (
                        <a
                          href={redirectUrl}
                          className="google-btn"
                        >
                          <FcGoogle className="google-btn__icon" />
                          <span className="google-btn__text">Войти через google</span>
                        </a>
                ) : ("loading...")}
                
            </div>

            {visible && (
                <div className="login-Error">
                    <span>{visible}</span>
                </div>
            )}
        </form>



    </div>
    )
}


export default Login 