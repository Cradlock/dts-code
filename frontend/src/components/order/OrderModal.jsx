import { useState, useContext,useEffect } from "react";
import { AuthContext } from "../../providers/auth.js";
import Spinner from "../../pages/Spinner.jsx/Spinner.jsx";
import "../../css/OrderModal.css";


function isValidPhone(number) {
    try{
    const cleanNumber = number.replace(/[\s\-()]/g, '');

    if (!/^\+?\d+$/.test(cleanNumber)) {
        return false;
    }

    const digitsOnly = cleanNumber.replace(/\D/g, '');

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return false;
    }

    return true;
    } catch(er){
        return false
    }
}


export default function OrderModal({ set_func }) {
  const { cart, userData, setCart, setUserData } = useContext(AuthContext);

  const [notification, setNotification] = useState("");

  
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000); 
  };

  const handlePlaceOrder = () => {
    showNotification("Заказ успешно оформлен!");
    setCart([]); 
  };

  const handle = (e) => {
    setUserData((prev) => ({
      ...prev,                    
      phone_number: e.target.value
    }));
  };



  useEffect(() => {
    if(!isValidPhone(userData.phone_number)){
        showNotification("Укажите номер");
    }
  },[])

  
  const setNumberReq = async () => {
     if( !isValidPhone(userData.phone_number) ){
        showNotification("Укажите номер правильно");  
        return
     }
     try{
        const res = await fetch(`${process.env.REACT_APP_API}accounts/user/number/?number=${userData.phone_number}`,{
            method:"GET",
            credentials: "include",
        })

        if(!res.ok) console.log(res.status);

        const data = await res.json();
        
        showNotification("Сохранено");
     }catch(er){
        console.log(er);
     }
  }


  const createOrder = async () => {
      try{
        const res = await fetch(`${process.env.REACT_APP_API}admin_api/create/order/?client_number=${userData.phone_number}`,{
            method:"GET",
            credentials: "include",
        })

        if(!res.ok) console.log(res.status);

        const data = await res.json();
        console.log(data);
        set_func(null);
        setCart([]);
        setUserData((prev) => ({
          ...prev,orders: [...prev.orders, data.order]
        }))
        
     }catch(er){
        console.log(er);
     }
  }

  if (userData == null) return <h1>Unauthorized...</h1>;


  return (
    <div className="order-modal">
      {notification && (
        <div className="nottification">
          {notification}
        </div>
      )}

      <div className="content-modal">
        <div className="order-close">
          <button onClick={() => set_func(null)}>✖</button>
        </div>

        <div className="phone_number">

            <input value={userData.phone_number} onChange={handle}/>
            <button className="phone_number_save" onClick={() => setNumberReq()}>Сохранить номер</button>
        </div>

          <div className="cart">
            <h2>Корзина</h2>
            {cart.length > 0 ? (
              <ul>
                {cart.map((item, idx) => (
                  <li key={idx}>
                    {item.product_name} - {item.price} сом ({item.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Корзина пуста</p>
            )}
          </div>

        <button className="place-order-btn" onClick={() => createOrder()}>
          Оформить заказ
        </button>
      </div>
    </div>
  );
}