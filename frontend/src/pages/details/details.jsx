// Details.js
import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Probimg from "../../images/gaming-laptops-og-image-C_hhqOLl.webp";
import { CategoryContext } from "../../providers/category";
import { AuthContext } from "../../providers/auth";
import { calculateDiscountedPrice } from "../../components/lib";

const Details = () => {
  const {userData,setCart} = useContext(AuthContext);
  const { categoryData } = useContext(CategoryContext);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API}api/products/${id}/`
        );
        if (!res.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (er) {
        setProduct(null);
        setLoading(false);
        console.log(er);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!product) return <p>Товар не найден</p>;

  const addToCart = async () => {
    if (!userData) {
      alert("Авторизуйтесь, чтобы добавить в корзину!");
      return;
    }
    setLoading(true);
    try {
      const bodyData = {
        product: product.id,
        count: 1,
        price: product.price,
        product_name: product.title,
      };

      const res = await fetch(`${process.env.REACT_APP_API}accounts/bucket/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userData.token && { Authorization: `Bearer ${userData.token}` }),
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("Ошибка при добавлении в корзину");

      const data = await res.json();
      const newItem = data;
      
      setCart((prevCart) => {
         // ищем существующий товар по product
         const existingIndex = prevCart.findIndex(item => item.product === newItem.product);
     
         if (existingIndex !== -1) {
           // создаём новый массив с увеличенным count
           const updatedCart = [...prevCart];
           updatedCart[existingIndex] = {
             ...updatedCart[existingIndex],
             count: updatedCart[existingIndex].count + newItem.count
           };
           return updatedCart;
         } else {
           // товара нет — просто добавляем
           return [...prevCart, newItem];
         }
    });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categoryName =
    categoryData?.find((cat) => cat.id === product.category)?.title ||
    "Неизвестная";

  return (
    <div className="details-page">
      <div className="details-container">
        {/* Левая часть — основная картинка */}
        <div className="image-section">
          <img
            src={product.cover || Probimg}
            alt={product.title}
            className="main-image"
          />
          {/* Галерея справа */}
          <div className="gallery">
            {product.gallery?.length > 0 ? (
              product.gallery.map((img, i) => (
                <img
                  key={i}
                  src={img.file}
                  alt={`Галерея ${i}`}
                  className="gallery-img"
                />
              ))
            ) : (
              <p className="no-gallery">Нет дополнительных фото</p>
            )}
          </div>
        </div>

        {/* Правая часть — информация */}
        <div className="info-section">
          <div className="info-section-desck">
            <h1>{product.title}</h1>
            {product.discount > 1 ? (
              <p>
                <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
                  {product.price} сом
                </span>
                <span style={{ fontWeight: "bold", color: "#ff4500" }}>
                  {calculateDiscountedPrice(product)} сом
                </span>
              </p>
            ) : (
              <p className="price">{product.price} сом</p>
            )}

          <p className="category">Категория: {categoryName}</p>

          <div className="quantity-selector">
            <label>Количество: </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <button className="add-cart-btn" onClick={addToCart}>
            {added ? "Добавлено!" : "Добавить в корзину"}
          </button>
          </div>
          

          {/* Описание */}
          <div className="desc-block">
            <h3>Описание:</h3>
            {product.desc && typeof product.desc === "object" ? (
              <ul>
                {Object.entries(product.desc).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{product.desc || "Описание отсутствует"}</p>
            )}
          </div>

          <div className="back-link">
            <Link to="/catalog">← Назад в каталог</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
