import { useState, useContext } from "react";
import { AuthContext } from "../../providers/auth.js";
import "../../css/OrderNottifications.css";

export default function OrderNotifications() {
  const { userData, setUserData } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!userData || !userData.orders || userData.orders.length === 0)
    return null;

  const latestOrder = userData.orders[0];

  const closeNotification = () => {
    setVisible(false);
    setTimeout(() => setVisible(true), 5000); // через 2 секунды снова можно показать
  };

  const cancel = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}admin_api/cancel/order/`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) console.log(res.status);

      const data = await res.json();
      setUserData((prev) => ({
        ...prev,
        orders: [],
      }));
    } catch (er) {
      console.log(er);
    }
  };

  return visible ? (
    <div
      className={`order-notification ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded(true)}
    >
      <div className="notification-header">
        <strong>У вас есть активный заказ!</strong>
        
      </div>

      {expanded && (
        
        <div className="notification-body">
                <div className="notification-header">
        <strong>Свернуть</strong>
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(false)
          }}
        >
          ✖
        </button>
      </div>
          <p>
            <strong>Номер кассира:</strong> {latestOrder.cashier_number}
          </p>
          <p>
            <strong>ID заказа:</strong> {latestOrder.id}
          </p>
          <p>
            <strong>Номер клиента:</strong> {latestOrder.client_number}
          </p>
          <p>
            <strong>Сумма:</strong> {latestOrder.total_price} сом
          </p>
          <p>
            <strong>Товары:</strong>
          </p>
          <ul>
            {expanded &&
              latestOrder?.products?.map((item) => (
                <li key={item.id}>
                  {item.title} — {item.count} шт. — {item.price} сом
                </li>
              ))}
          </ul>

          <button onClick={() => cancel()}>Отмена</button>
        </div>
      )}
    </div>
  ) : null;
}
