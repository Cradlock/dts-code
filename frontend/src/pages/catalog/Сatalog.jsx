import { useState, useContext, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { CategoryContext } from "../../providers/category";
import { BrandContext } from "../../providers/brand";
import { AuthContext } from "../../providers/auth";
import Probimg from "../../images/pngtree-not-found-image_2238448.jpg";
import Spinner from "../Spinner.jsx/Spinner";
import { calculateDiscountedPrice } from "../../components/lib";

function Catalog() {
  const { cart, userData, setCart } = useContext(AuthContext);
  const { categoryData, categoryLoading } = useContext(CategoryContext);
  const { brandData, brandLoading } = useContext(BrandContext);

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [error, setError] = useState(null);

  const productsPerPage = 6;

  const [formData, setFormData] = useState(() => {
    // загружаем фильтры из localStorage
    const saved = localStorage.getItem("catalogFilters");
    return saved
      ? JSON.parse(saved)
      : {
          page: 1,
          q: "",
          min_price: 0,
          max_price: 0,
          on_sale: false,
          new: false,
          in_stock: false,
          categories: [],
          brands: [],
          ordering: "-date",
        };
  });

  const [debouncedFormData, setDebouncedFormData] = useState(formData);

  // debounce (отложенное обновление фильтра)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFormData(formData);
    }, 600);
    return () => clearTimeout(handler);
  }, [formData]);

  // сохраняем фильтры
  useEffect(() => {
    localStorage.setItem("catalogFilters", JSON.stringify(formData));
  }, [formData]);

  const resetFilters = () => {
    setFormData({
      page: 1,
      q: "",
      min_price: 0,
      max_price: 0,
      on_sale: false,
      new: false,
      in_stock: false,
      categories: [],
      brands: [],
      ordering: "-date",
    });
    setCurrentPage(1);
  };

  // --- переключение категорий и брендов
  const toggleSelection = (list, id) => {
    return list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
  };

  const handleCategory = (id) =>
    setFormData((prev) => ({ ...prev, categories: toggleSelection(prev.categories, id), page: 1 }));

  const handleBrand = (id) =>
    setFormData((prev) => ({ ...prev, brands: toggleSelection(prev.brands, id), page: 1 }));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, page: 1 }));

  const handleCheckbox = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked, page: 1 }));

  // --- Загрузка продуктов
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        const data = { ...debouncedFormData, page: currentPage };

        if (data.categories.length > 0)
          params.append("category", data.categories.join(","));
        if (data.brands.length > 0)
          params.append("brand", data.brands.join(","));
        if (data.q) params.append("q", data.q);
        if (data.min_price) params.append("min_price", data.min_price);
        if (data.max_price) params.append("max_price", data.max_price);
        if (data.on_sale) params.append("on_sale", "true");
        if (data.new) params.append("new", "true");
        if (data.in_stock) params.append("in_stock", "true");
        if (data.ordering) params.append("ordering", data.ordering);
        params.append("page", data.page);

        const res = await fetch(
          `${process.env.REACT_APP_API}api/products/filter/?${params.toString()}`
        );
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        const result = await res.json();
        setProducts(result.results);
        setTotalPages(result.num_pages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedFormData, currentPage]);

  // --- Добавление в корзину
  const handleAddToCart = async (product) => {
    if (!userData) {
      alert("Авторизуйтесь, чтобы добавить в корзину!");
      return;
    }
    setLoadingAddToCart(true);
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
      setLoadingAddToCart(false);
    }
  };

  return (
    <div className="catalog">
      <div className="catalog-header">
        <h1>Каталог товаров</h1>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
        </button>
        <button onClick={resetFilters} className="reset-btn">
          Сбросить фильтры
        </button>
      </div>

      {/* Фильтры */}
      {showFilters && (
        <div className="filters-panel">
          <div className="search">
            <input
              type="text"
              name="q"
              placeholder="Поиск..."
              value={formData.q}
              onChange={handleChange}
            />
          </div>

          <div className="price-filter">
            <input
              type="number"
              name="min_price"
              placeholder="Мин. цена"
              value={formData.min_price}
              onChange={handleChange}
            />
            <input
              type="number"
              name="max_price"
              placeholder="Макс. цена"
              value={formData.max_price}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="on_sale"
                checked={formData.on_sale}
                onChange={handleCheckbox}
              />
              Со скидкой
            </label>
            <label>
              <input
                type="checkbox"
                name="new"
                checked={formData.new}
                onChange={handleCheckbox}
              />
              Новинки
            </label>
            <label>
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleCheckbox}
              />
              В наличии
            </label>
          </div>

          <div className="category-filter">
            <h3>Категории</h3>
            {categoryLoading ? (
              <Spinner />
            ) : (
              categoryData.map((cat) => (
                <button
                  key={cat.id}
                  className={
                    formData.categories.includes(cat.id)
                      ? "selected"
                      : "unselected"
                  }
                  onClick={() => handleCategory(cat.id)}
                >
                  {cat.title}
                </button>
              ))
            )}
          </div>

          <div className="brand-filter">
            <h3>Бренды</h3>
            {brandLoading ? (
              <Spinner />
            ) : (
              brandData.map((brand) => (
                <button
                  key={brand.id}
                  className={
                    formData.brands.includes(brand.id)
                      ? "selected"
                      : "unselected"
                  }
                  onClick={() => handleBrand(brand.id)}
                >
                  {brand.title}
                </button>
              ))
            )}
          </div>

          <div className="sort">
            <label>Сортировка:</label>
            <select
              name="ordering"
              value={formData.ordering}
              onChange={handleChange}
            >
              <option value="-date">Новые → Старые</option>
              <option value="price">Цена ↑</option>
              <option value="-price">Цена ↓</option>
              <option value="title">Название A-Z</option>
              <option value="-title">Название Z-A</option>
            </select>
          </div>
        </div>
      )}

      {/* Товары */}
      <div className={isGridView ? "products-grid" : "products-list"}>
        {loading ? (
          <Spinner text="Загрузка..." />
        ) : error ? (
          <p className="error">{error}</p>
        ) : products.length === 0 ? (
          <p>Товары не найдены</p>
        ) : (
          products.map((p) => (
            <div key={p.id} className="product-card">
              <Link to={`/details/${p.id}`}>
              <img src={p.cover || Probimg} alt={p.title} />
              <h3>
                {p.title}
              </h3>

                  {p.discount > 1 ? (
      <p>
        <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
          {p.price} сом
        </span>
        <span style={{ fontWeight: "bold", color: "#ff4500" }}>
          {calculateDiscountedPrice(p)} сом
        </span>
      </p>
    ) : (
      <p>{p.price} сом</p>
    )}
              </Link>
              
              {userData && (
                <button onClick={() => handleAddToCart(p)} disabled={loadingAddToCart}>
                  {loadingAddToCart ? "⏳..." : "В корзину"}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
