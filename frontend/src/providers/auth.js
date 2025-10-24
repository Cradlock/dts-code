import { useEffect, createContext, useState } from "react";

const api_url = process.env.REACT_APP_API;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [ cart,setCart ] = useState([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const req = async () => {
      try {
        const res = await fetch(`${api_url}accounts/user/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setUserLoading(null);
          return;
        }

        const data = await res.json();
        setUserLoading(false);
        setUserData(data);
        setCart(data.bucket);
      } catch (er) {
        setUserLoading(null);
      }
    };

    req();
  }, []);

  return (
    <AuthContext.Provider
      value={{ cart,setCart,userData, userLoading, setUserData, setUserLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
