import { createContext, useState, useEffect } from "react";

const api_url = process.env.REACT_APP_API;

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${api_url}admin_api/category/`); // ← добавлен слеш

        if (!res.ok) {
          throw new Error(`Ошибка сервера: ${res.status}`);
        }

        const text = await res.text();
        if (text.startsWith("<!DOCTYPE")) {
          throw new Error("Ответ не является JSON (вернулся HTML)");
        }

        const data = JSON.parse(text);
        setCategoryData(data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error.message);
        setCategoryData([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categoryData, categoryLoading }}>
      {children}
    </CategoryContext.Provider>
  );
};
