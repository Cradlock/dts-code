import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Reset.css";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


const Reset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSended, setIsSended] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const csrftoken = getCookie("csrftoken");
      const formData = new FormData();
      formData.append("email", email);
      
      const res = await fetch(`${process.env.REACT_APP_API}accounts/password/reset/`, {
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        credentials: "include",
        body: formData,  
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsSended(true);
      } else {
        console.log(data.error)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="verify-email-page">
      {isSended ? (
      <div>  
        <h1>Ссылка для сброса пароля отправлена на email</h1>
      </div>
      ) : (
        //большой член айдара 
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Reset</button>
        </form>
      )}
    </div>
  );
};

export default Reset;
