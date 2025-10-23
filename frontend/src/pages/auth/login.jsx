import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleRedirect, setGoogleRedirect] = useState(null);

  // Получаем redirect_url с бэка при загрузке компонента
  useEffect(() => {
    const fetchGoogleRedirect = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}accounts/google/login/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Ошибка при получении URL для Google");
        }

        const data = await res.json();
        setGoogleRedirect(data.redirect_url); 
      } catch (err) {
        console.error(err);
      }
    };

    fetchGoogleRedirect();
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Пожалуйста, заполните все поля");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // создаём form-urlencoded данные
    const formData = new URLSearchParams();
    formData.append("username", email); // можно username или email
    formData.append("password", password);

    const res = await fetch(`${process.env.REACT_APP_API}accounts/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: formData.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Успешный вход:", data);
      // здесь можно редиректить на главную страницу
    } else if (res.status === 401) {
      setError("Неверный логин или пароль");
    } else {
      setError("Ошибка сервера");
    }
  } catch (err) {
    console.error(err);
    setError("Ошибка сети");
  } finally {
    setLoading(false);
  }
};

  const handleGoogleLogin = () => {
    if (googleRedirect) {
      window.location.href = googleRedirect; // редиректим на Google
    } else {
      alert("URL для Google авторизации недоступен");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Вход в аккаунт</h2>

        {error && <p className="error">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите email"
          required
        />

        <label>Пароль:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
          <button
            type="button"
            className="show-pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Скрыть" : "Показать"}
          </button>
        </div>

        <div className="remember-forgot">
          <Link to="/forgot">Забыли пароль?</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Вход..." : "Войти"}
        </button>

        {/* Кнопка Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-login"
        >
          Войти через Google
        </button>

        <p>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}


