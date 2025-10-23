import { useState, useContext } from "react";
import { AuthContext } from "../../providers/auth.js";
import Spinner from "../Spinner.jsx/Spinner.jsx";
import OrderModal from "../../components/order/OrderModal.jsx";
import { calculateDiscountedPrice } from "../../components/lib.js";

function Cart() {
  const { cart, setCart, userData, setUserData } = useContext(AuthContext);

  const [discount, setDiscount] = useState(0);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [modal, setModal] = useState();

  const updateQty = async (id, qty) => {
    try {
      setLoadingUpdate(true);
      let operation;

      if (qty === "inc" || qty === "dec") {
        operation = qty;
      } else {
        const numberQty = Math.max(1, Number(qty));
        operation = numberQty.toString();
      }

      const response = await fetch(
        `${process.env.REACT_APP_API}accounts/bucket/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ operation }),
        }
      );

      if (response.status === 200) {
        const updatedItem = await response.json();
        setCart(
          cart.map((item) =>
            item.id === id ? { ...item, count: updatedItem.count } : item
          )
        );
      } else if (response.status === 204) {
        setCart(cart.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const removeItem = async (id) => {
    try {
      setLoadingDelete(true);
      const response = await fetch(
        `${process.env.REACT_APP_API}accounts/bucket/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 204) {
        setCart(cart.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
    } finally {
      setLoadingDelete(false);
    }
  };
const subtotal = cart.reduce((sum, item) => {
  const discountedPrice = item.discount && item.discount > 0
    ? item.price * (1 - item.discount / 100)
    : item.price;
   
  return sum + discountedPrice * item.count;
}, 0);

const total = subtotal - (discount || 0);

// общее количество товаров
const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

  if (loadingUpdate || loadingDelete) {
    return <Spinner text="Обновление корзины..." />;
  }

  const order = () => {
    setModal(<OrderModal set_func={setModal} />);
  };

  return (
    <div className="cart-page">
      {modal && (
        <div className="modal-container" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modal}
          </div>
        </div>
      )}

      <h1 className="cart-title">🛒 Ваша корзина</h1>

      {cart.length === 0 ? (
        <p className="empty">Корзина пуста. Добавьте товары, чтобы продолжить!</p>
      ) : (
        <div className="cart-container">
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-image"
                />
                <div className="cart-details">
                  <h3>{item.product_name}</h3>
                  <p>{item.description || "Без описания"}</p>
                  
                <p className="price-tag">
                  {item.discount > 1 ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>
                        {item.price} сом
                      </span>
                      <span style={{ fontWeight: "bold", color: "#ff4500" }}>
                        {calculateDiscountedPrice(item)} сом
                      </span>
                    </>
                  ) : (
                    `${item.price} сом`
                  )} / {item.count} шт
                </p>

                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, "dec")}>−</button>
                    <input
                      type="number"
                      min="1"
                      value={item.count}
                      onChange={(e) => updateQty(item.id, +e.target.value)}
                    />
                    <button onClick={() => updateQty(item.id, "inc")}>+</button>
                  </div>
                  <p className="total-price">
                    <strong>{item.price * item.count} сом</strong>
                  </p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>

          <div className="summary">
            <p>Товаров: <strong>{totalItems}</strong></p>
            <p>Сумма: <strong>{subtotal} сом</strong></p>
            <h3 className="summary-total">Итого: {total} сом</h3>
            {userData.orders.length === 0 ? (
              <button className="checkout-btn" onClick={order}>
                ✅ Перейти к оплате
              </button>
            ) : (
              <button className="checkout-btn disabled">
                У вас активный заказ
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
