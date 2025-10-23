import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth";
import Load from "../components/Load";
import Not403 from "../components/not403";

const Main = () => {
  const { info, setInfo } = useContext(AuthContext); // берем setInfo, чтобы обновить глобальный state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/admin_api/getInfo/`, {
          method: "GET",
          credentials: "include", // отправляем куки
        });

        if (!res.ok) {
          setInfo(null); // если сервер вернул 403 или ошибку
        } else {
          const data = await res.json();
          setInfo(data); // обновляем глобальный контекст
        }
      } catch (err) {
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [setInfo]);

  if (loading) return <Load />;
  if (!info) return <Not403 />;

  return (
    <main>
        <div className="info">
              <h1>Hello Admin!</h1>


        </div>
    </main>
  );
};

export default Main;