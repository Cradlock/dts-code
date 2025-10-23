import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventImg from "../../images/gaming-laptops-og-image-C_hhqOLl.webp";
import MediaViewer from "../../components/lib";

const api_url = `${process.env.REACT_APP_API}admin_api/events/`;

function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка всех новостей
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(api_url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

        const data = await res.json();
        console.log(data);
        
        setNewsList(data);
      } catch (err) {
        console.error("Ошибка при получении событий:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <h2>Загрузка новостей...</h2>;

  return (
    <div className="news">
      <div className="news-banner">
        <div className="container">
          <h1 className="news-main-title">Жаңылыктар</h1>
          <p className="news-subtitle">
            Биздин акыркы жаңылыктар жана иш-чаралар менен таанышыңыз.
          </p>
        </div>
      </div>
<br />
      <div className="container">
        <div className="news-list">
          {newsList.map((item) => (
            <div key={item.id} className="news-card">
              <img
                src={item.gallery?.[0]?.file || EventImg}
                alt={item.title}
                className="news-img"
              />

              <MediaViewer src={item.gallery?.[0]?.file || EventImg} />


              <div className="news-content">
                <span className="news-category">
                  {item.categories?.join(", ") || "Без категории"}
                </span>
                <h2>{item.title}</h2>
                <span className="news-date">
                  {new Date(item.date_start).toLocaleDateString("ru-RU")}
                </span>
                <p>{item.desc}</p>
                <Link to={`/news/${item.id}`} className="read-more">
                  Толугураак окуу →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="latest-news">
          <h3>Акыркы жаңылыктар</h3>
          <ul>
            {newsList.slice(0, 5).map((item) => (
              <li key={item.id}>
                <Link to={`/news/${item.id}`}>{item.title}</Link>
                <span className="small-date">
                  {new Date(item.date_start).toLocaleDateString("ru-RU")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default News;
