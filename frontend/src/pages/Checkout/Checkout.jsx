import { useState } from "react";
import { useLocation } from "react-router-dom";
function Checkout() {
  // 🔹 Моковые товары (в реальном проекте они берутся из корзины)
  const [cart, setCart] = useState([
    { id: 1, name: "Ноутбук ASUS", price: 45000, qty: 1 },
    { id: 2, name: "Кроссовки Nike", price: 12000, qty: 2 },
  ]);

  // 🔹 Состояния формы
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [delivery, setDelivery] = useState("courier");
  const [payment, setPayment] = useState("card");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  // 🔹 Подсчёт суммы
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount;

  // 🔹 Применение промокода
  const applyPromo = () => {
    if (promo.toLowerCase() === "sale10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("Неверный промокод!");
    }
  };

  // 🔹 Оформление заказа
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.phone || !user.address) {
      alert("Заполните все обязательные поля!");
      return;
    }
    alert(`Заказ оформлен! Спасибо, ${user.name}`);
  };

  // 🔹 Изменение количества
  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  // 🔹 Удаление товара
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };
  

  function Checkout() {
    const location = useLocation();
    const [cart, setCart] = useState(location.state?.cart || []);

    // Теперь cart приходит из Catalog
  }

  return (
    <div className="checkout">
      <h1>Төлөм (Оформление заказа)</h1>

      {/* Корзина */}
      <div className="cart">
        <h2>Ваши товары</h2>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <input
                  type="number"
                  value={item.qty}
                  min="1"
                  onChange={(e) => updateQty(item.id, +e.target.value)}
                />
                <span>{item.price * item.qty} сом</span>
                <button onClick={() => removeItem(item.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        )}
        <p>Промежуточная сумма: {subtotal} сом</p>
      </div>

      {/* Форма */}
      <form className="order-form" onSubmit={handleSubmit}>
        <h2>Данные покупателя</h2>
        <input
          type="text"
          placeholder="Имя"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <textarea
          placeholder="Адрес доставки"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          required
        />

        {/* Доставка */}
        <h2>Способ доставки</h2>
        <label>
          <input
            type="radio"
            name="delivery"
            value="courier"
            checked={delivery === "courier"}
            onChange={(e) => setDelivery(e.target.value)}
          />
          Курьер (200 сом)
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={delivery === "pickup"}
            onChange={(e) => setDelivery(e.target.value)}
          />
          Самовывоз (бесплатно)
        </label>

        {/* Оплата */}
        <h2>Способ оплаты</h2>
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={payment === "card"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Банковская карта
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={payment === "cash"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Наличные
        </label>

        {/* Промокод */}
        <h2>Промокод</h2>
        <div className="promo">
          <input
            type="text"
            placeholder="Введите промокод"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button type="button" onClick={applyPromo}>
            Применить
          </button>
        </div>

        {/* Итог */}
        <div className="summary">
          <p>Скидка: {discount} сом</p>
          <p className="total">Итого: {total} сом</p>
        </div>

        <button type="submit" className="submit-btn">
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
}

export default Checkout;
