import { Link } from "react-router-dom";
import { InfoContext } from "../../providers/info";
import { CategoryContext } from "../../providers/category";
import { useContext, useEffect, useState } from "react";
import Spinner from "../Spinner.jsx/Spinner";
import productImg from "../../images/pngtree-not-found-image_2238448.jpg"
import { calculateDiscountedPrice } from "../../components/lib";
import Load from "../../components/load";

const Home = () => {
  const { info_data, info_loading } = useContext(InfoContext);
  const { categoryData, categoryLoading } = useContext(CategoryContext);

  const [recommend_products, setRProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedCategory, setHighlightedCategory] = useState(null);

  const [special,setSpecial] = useState("loaded");

  const [news,setNews] = useState("loaded");



  // Загрузка товаров
  useEffect(() => {
    const req = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API}api/products/?page_size=8`
        );

        if (!res.ok) {
          setError(`Ошибка при загрузке: ${res.status}`);
          return;
        }

        const data = await res.json();
        setRProduct(data.results);
      } catch (er) {
        setError("Ошибка подключения к серверу");
      } finally {
        setLoading(false);
      }
    };

    const reqEvents = async () => {
      try{
         const res = await fetch(
          `${process.env.REACT_APP_API}admin_api/events/?is_spec=true`
        );

        if (!res.ok) {
          setError(`Ошибка при загрузке: ${res.status}`);
          return;
        }

        const data = await res.json();
        
        setSpecial(data);
      } catch(er){
        setError("Ошибка подключения к серверу");
        setSpecial(null);

      }finally {
        setLoading(false);
      }
    }
    const reqNews = async () => {
      try{
         const res = await fetch(
          `${process.env.REACT_APP_API}admin_api/events/?is_spec=false`
        );

        if (!res.ok) {
          setError(`Ошибка при загрузке: ${res.status}`);
          return;
        }

        const data = await res.json();
        
        setNews(data);
      } catch(er){
        setError("Ошибка подключения к серверу");
        setNews(null);

      }finally {
        setLoading(false);
      }
    }



    req();
    reqEvents();
    reqNews();
  }, []);

  if (info_loading == null)
    return <h1>Ошибка загрузки информации о магазине</h1>;

  if (info_loading) return <Spinner text={"Загрузка данных..."} />;

  const renderOffers = () => {
    if (special === "loaded") {
      return <Spinner />; // пока грузим — спиннер
    }

    if (!special || special.length === 0) {
      return null; // пустой список — не рисуем
    }

    return (
      <div className="offers-grid">
        {special.map((item) => (
          <div key={item.id} className="offer-card">
            <h3>{item.product_name || item.title}</h3>
            <p>{item.desc || "Нет описания"}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderNews = () => {
    if (news === "loaded") {
      return <Spinner />; // пока грузим — спиннер
    }

    if (!news || news.length === 0) {
      return null; 
    }

    return (
       <div className="container">
          <h2 className="section-title">📰 Последние новости</h2>
      <ul className="news-list">
        {news.map((item) => (
            <li>{item.desc}</li>
        ))}
      </ul>
          <Link to="/news" className="btn-secondary" style={{color:"blue"}}>
            Все новости
          </Link>
        </div>
    );
  };

  return (
    <div className="home">
      {/* 🔹 БАННЕР */}
      <section className="banner">
        <div className="container">
          <div className="banner-content">
            <h1>Добро пожаловать в {info_data?.title || "DTS Shop"}</h1>
            <p>Лучшие товары по выгодным ценам.</p>
            <div className="banner-buttons">
              <Link to="/catalog" className="btn-primary">
                🛒 Перейти в каталог
              </Link>
              <Link to="/about" className="btn-secondary">
                ℹ️ Узнать больше
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 АКЦИИ / СПЕЦПРЕДЛОЖЕНИЯ */}
      <section className="special-offers">
        <div className="container">
          <h2 className="section-title">🔥 Спецпредложения</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {renderOffers()}
        </div>
      </section>

      {/* 🔹 РЕКОМЕНДОВАННЫЕ ТОВАРЫ */}
      <section className="products">
        <div className="container">
          <h2 className="section-title">🛍 Рекомендованные товары</h2>

          {error && <p className="error-text">{error}</p>}

          <div className="products-grid">
            {loading ? (
              <Spinner text={"Загрузка товаров..."} />
            ) : (
              recommend_products.map((elem) => (
                <div className="card" key={elem.id}>
                  <div className="card-image">
                    <img
                      src={elem.cover || productImg}
                      alt={elem.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-info">
                    <h3>{elem.title}</h3>
                    
                    {elem.discount > 1 ? (
                       <p>
                         <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
                           {elem.price} сом
                         </span>
                         <span style={{ fontWeight: "bold", color: "#ff4500" }}>
                           {calculateDiscountedPrice(elem)} сом
                         </span>
                       </p>
                     ) : (
                       <p className="price">{elem.price} сом</p>
                     )}

                    <p className="desc">
                      {elem.description?.slice(0, 60) || "Описание отсутствует"}
                      ...
                    </p>
                    <div className="card-actions">
                      <Link to={`/details/${elem.id}`} className="details-btn">
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 🔹 КАТЕГОРИИ */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">📂 Категории</h2>

          {categoryLoading ? (
            <Spinner text={"Загрузка категорий..."} />
          ) : (
            <div className="categories-list">
              {categoryData.map((elem) => (
                <Link
                  to="/catalog"
                  key={elem.id}
                  className={`category ${
                    highlightedCategory === elem.id ? "highlighted" : ""
                  }`}
                  onMouseEnter={() => setHighlightedCategory(elem.id)}
                  onMouseLeave={() => setHighlightedCategory(null)}
                >

                  <span>{elem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 О КОМПАНИИ */}
      <section className="about-preview">
        <div className="container">
          <h2 className="section-title">🏢 О нас</h2>
          <div className="about-content">
            <p>
              Мы — {info_data?.title || "онлайн-магазин"}, который предлагает
              качественные товары: электронику, одежду, технику и многое другое.
              Мы гордимся нашими низкими ценами и быстрой.
            </p>
            <ul className="about-list">
              <li>💳 Удобные способы оплаты</li>
              <li>🛡 Гарантия качества на каждый товар</li>
            </ul>
            <Link to="/about" className="btn-secondary">
              Подробнее
            </Link>
          </div>
        </div>
      </section>

      {/* 🔹 НОВОСТИ */}
      <section className="news-preview">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {renderNews()}

      </section>

      
    </div>
  );
};

export default Home;
