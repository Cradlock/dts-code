import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EventImg from "../../images/gaming-laptops-og-image-C_hhqOLl.webp";
import Spinner from "../Spinner.jsx/Spinner";
import MediaViewer from "../../components/lib";

const api_url = `${process.env.REACT_APP_API}admin_api/events/`;

function NewsDetails() {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получение данных одной новости
  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const url = `${api_url}${id}`;
        console.log("📡 Отправляем запрос:", url);

        const res = await fetch(url);

        console.log(" Статус ответа:", res.status);

        const data = await res.json();
        console.log("🧾 Ответ от API:", data);

        setNewsItem(data);
      } catch (error) {
        console.error("Ошибка при запросе:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) return <Spinner>Загрузка данных....</Spinner>;
  if (!newsItem) return <h2>Новость не найдена</h2>;

  return (
    <div className="news-details">
      <Link to="/news" className="back-link">
        ← Артка кайтуу
      </Link>

      <div className="news-header">
        <h1>{newsItem.title}</h1>
        <span className="news-date">
          {new Date(newsItem.date_start).toLocaleDateString("ru-RU")}
        </span>
      </div>

      <div className="news-gallery">
        {newsItem.gallery && newsItem.gallery.length > 0 ? (
          <div className="gallery">
        
            <MediaViewer className="main-image" src={newsItem.gallery[0].file} />
            <div className="thumbnails">
              {newsItem.gallery.slice(1).map((img, i) => (
                <MediaViewer key={i} src={img.file} alt={`Фото ${i + 1}`} />
              ))}
            </div>
          </div>
        ) : (
          <img src={EventImg} alt="Нет изображения" className="main-image" />
        )}
      </div>

      <div className="news-content">
        <h3>Описание</h3>
        <p>{newsItem.desc}</p>

        {newsItem.categories && (
          <div className="news-categories">
            <strong>Категории:</strong> {newsItem.categories.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsDetails;