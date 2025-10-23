import { createContext, useState, useEffect } from "react";
const api_url = process.env.REACT_APP_API;
export const InfoContext = createContext();

export const InfoProvider = ({ children }) => {
  const [info_data, setinfo_Data] = useState(null);
  const [info_loading, setLoading] = useState(true);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await fetch(`${api_url}info/`);

        if (!res.ok) {
          setLoading(null);
        }
        const import_info_data = await res.json();
        setLoading(false);
        setinfo_Data(import_info_data);
      } catch (error) {
        setLoading(null);
        console.log(`Error ${error}`);
      }
    };

    func();
  }, []);

  return (
    <InfoContext.Provider value={{ info_data, info_loading }}>
      {children}
    </InfoContext.Provider>
  );
};
