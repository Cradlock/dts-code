import { createContext, useState, useEffect } from "react";
import { getCookie } from "../components/lib";
const api_url = process.env.REACT_APP_API;
export const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [info_data, setinfo_Data] = useState(null);
  const [info_loading, setLoading] = useState(true);
  const [admin_url,setAdminUrl] = useState(null);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(`${api_url}info/`);

        if (!res.ok) {
          setLoading(null);
          return;
        }
        const import_info_data = await res.json();
        setLoading(false);
        setinfo_Data(import_info_data);
      } catch (error) {
        setLoading(null);
        console.log(`Error ${error}`);
      }
    };

    const func_admin = async () => {
      try {
        const res = await fetch(`${api_url}accounts/admin_url/`);

        if (!res.ok) {
          setLoading(null);
        setAdminUrl(null);
          return;
        }
        const import_info_data = await res.json();
        setLoading(false);
        setAdminUrl(import_info_data.data);

      } catch (error) {
        setLoading(null);
        console.log(`Error ${error}`);
      }
    };

    func();
    func_admin();

    getCookie("csrftoken");


  }, []);

  return (
    <InfoContext.Provider value={{ info_data, info_loading , admin_url}}>
      {children}
    </InfoContext.Provider>
  );
};
