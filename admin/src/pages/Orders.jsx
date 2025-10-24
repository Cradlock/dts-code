import "../css/orders.css";
import { useContext, useState, useEffect } from "react";
import MiniLoad from "../components/MiniLoad.jsx"; // компонент спиннера или загрузки
import { AuthContext } from "../auth.js";
import Not403 from "../components/not403.jsx";
import Load from "../components/Load.jsx";
import { getCSRF } from "../components/lib.js";

export default function OrderPage() {
  const { info, setInfo } = useContext(AuthContext); // берем setInfo, чтобы обновить глобальный state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingConfirmId, setLoadingConfirmId] = useState(null); // id заказа, который подтверждается

  const apiOrders = `${process.env.REACT_APP_API}/admin_api/orders/`;
  const apiSetOrder = `${process.env.REACT_APP_API}/admin_api/set/order/`;


  
  const fetchOrders = () => {
    setLoading(true);
    fetch(apiOrders, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке заказов:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmOrder = async (orderId) => {
    setLoadingConfirmId(orderId);
    const formData = new URLSearchParams();
    formData.append("order", orderId);

    try {
      const res = await fetch(apiSetOrder, {
        method: "POST",
        headers: getCSRF("application/x-www-form-urlencoded"),
        credentials: "include",
        body: formData.toString(),
      });

      if (res.ok) {
        alert(`Заказ ${orderId} подтверждён`);
        fetchOrders();
      } else {
        alert("Ошибка при подтверждении заказа");
      }
    } catch (err) {
      console.error("Ошибка:", err);
      alert("Ошибка сети");
    } finally {
      setLoadingConfirmId(null);
    }
  };
  
  if(loading) return <Load />;
  if(!info) return <Not403 />;

  if (loading) return <p>Загрузка заказов...</p>;
  if (orders.length === 0) return <p>Нет заказов.</p>;

  return (
    <div className="order-page">
        
      <h1>Все заказы</h1>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>ID: {order.id}</span>
            <span>Дата: {new Date(order.created_date).toLocaleString()}</span>
          </div>
          <div className="order-info">
            <p><strong>Клиент:</strong> {order.client_number || "—"}</p>
            <p><strong>Кассир:</strong> {order.cashier_number || "—"}</p>
            <p><strong>Сумма:</strong> {order.total_price} сом</p>
          </div>
          <div className="order-products">
            <strong>Товары:</strong>
            <ul>
              {order.products.map((item) => (
                <li key={item.id}>
                  {item.title} — {item.count} шт — {item.price} сом
                </li>
              ))}
            </ul>
          </div>
          <div className="confirm-container">
            {loadingConfirmId === order.id ? (
              <MiniLoad />
            ) : (
              <button className="confirm-btn" onClick={() => confirmOrder(order.id)}>
                Подтвердить заказ
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
