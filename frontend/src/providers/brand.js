import { createContext, useState, useEffect } from "react";

const api_url = process.env.REACT_APP_API;

export const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [brandData, setBrandData] = useState([]);
  const [brandLoading, setBrandLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${api_url}admin_api/brands/`); // ← добавлен слеш

        if (!res.ok) {
          throw new Error(`Ошибка сервера: ${res.status}`);
        }

        // Проверка на JSON
        const text = await res.text();
        if (text.startsWith("<!DOCTYPE")) {
          throw new Error("Ответ не является JSON (вернулся HTML)");
        }

        const data = JSON.parse(text);
        console.log(text);
        setBrandData(data);
      } catch (error) {
        console.error("Ошибка при загрузке брендов:", error);
        setBrandData([]);
      } finally {
        setBrandLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <BrandContext.Provider value={{ brandData, brandLoading }}>
      {children}
    </BrandContext.Provider>
  );
};
