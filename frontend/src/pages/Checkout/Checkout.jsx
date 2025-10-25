import { useState } from "react";
import { useLocation } from "react-router-dom";

function Checkout() {
  // 🔹 Убактылуу (мок) товарлар — чыныгы долбоордо алар себеттен келет
  const [cart, setCart] = useState([
    { id: 1, name: "ASUS ноутбугу", price: 45000, qty: 1 },
    { id: 2, name: "Nike бут кийимдери", price: 12000, qty: 2 },
  ]);

  // 🔹 Форманын абалы
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

  // 🔹 Жалпы сумманы эсептөө
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal - discount;

  // 🔹 Промокод колдонуу
  const applyPromo = () => {
    if (promo.toLowerCase() === "sale10") {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
      alert("Промокод туура эмес!");
    }
  };

  // 🔹 Заказ берүү
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.phone || !user.address) {
      alert("Бардык талааларды толтуруңуз!");
      return;
    }
    alert(`Заказ кабыл алынды! Рахмат, ${user.name}`);
  };

  // 🔹 Саны өзгөртүү
  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  // 🔹 Товарды өчүрүү
  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  function Checkout() {
    const location = useLocation();
    const [cart, setCart] = useState(location.state?.cart || []);
    // Эми cart Catalogдон келет
  }

  return (
    <div className="checkout">
      <h1>Төлөм (Заказ берүү)</h1>

      {/* Себет */}
      <div className="cart">
        <h2>Сиздин товарлар</h2>
        {cart.length === 0 ? (
          <p>Себет бош</p>
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
                <button onClick={() => removeItem(item.id)}>Өчүрүү</button>
              </li>
            ))}
          </ul>
        )}
        <p>Аралык сумма: {subtotal} сом</p>
      </div>

      {/* Формасы */}
      <form className="order-form" onSubmit={handleSubmit}>
        <h2>Кардар жөнүндө маалымат</h2>
        <input
          type="text"
          placeholder="Аты-жөнү"
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
          placeholder="Email (милдеттүү эмес)"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <textarea
          placeholder="Дарек"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          required
        />

        {/* Жеткирүү ыкмасы */}
        <h2>Жеткирүү жолу</h2>
        <label>
          <input
            type="radio"
            name="delivery"
            value="courier"
            checked={delivery === "courier"}
            onChange={(e) => setDelivery(e.target.value)}
          />
          Курьер менен (200 сом)
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={delivery === "pickup"}
            onChange={(e) => setDelivery(e.target.value)}
          />
          Өзү келип алуу (акысыз)
        </label>

        {/* Төлөм ыкмасы */}
        <h2>Төлөм жолу</h2>
        <label>
          <input
            type="radio"
            name="payment"
            value="card"
            checked={payment === "card"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Банк картасы аркылуу
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={payment === "cash"}
            onChange={(e) => setPayment(e.target.value)}
          />
          Накталай
        </label>

        {/* Промокод */}
        <h2>Промокод</h2>
        <div className="promo">
          <input
            type="text"
            placeholder="Промокод жазыңыз"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
          />
          <button type="button" onClick={applyPromo}>
            Колдонуу
          </button>
        </div>

        {/* Жыйынтык */}
        <div className="summary">
          <p>Жеңилдик: {discount} сом</p>
          <p className="total">Жалпы сумма: {total} сом</p>
        </div>

        <button type="submit" className="submit-btn">
          Заказды тастыктоо
        </button>
      </form>
    </div>
  );
}

export default Checkout;
