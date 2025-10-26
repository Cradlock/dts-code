import React, { createContext, useState, useEffect } from "react";
import { getCookie, getCSRF } from "./components/lib";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [info, setInfo] = useState(null);      // данные пользователя
  const [loading, setLoading] = useState(true);
  
  const [events,setEvents] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/admin_api/getInfo/`, {
          method: "GET",
          credentials: "include",
          
        });

        if (!res.ok) {
          setInfo(null);
        } else {
          const data = await res.json();
          setInfo(data); 
        }
      } catch (err) {
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    alert(getCSRF());
  }, []);

  return (
    <AuthContext.Provider value={{ info, setInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
