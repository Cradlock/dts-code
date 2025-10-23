import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (!agree) {
      setError("Вы должны принять условия использования");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = {
        username: name,
        email: email,
        password: password
      };
      const res = await fetch(`${process.env.REACT_APP_API}accounts/signup/`, {
        method: "POST",
        credentials: "include",   
        headers: {"Content-type":"application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            username: data.username,
            password: data.password,
            email: data.email
        }).toString()
      });
    
      const result = await res.json();
    
      if (!res.ok) {
        setError(result.error || "Ошибка регистрации");
      } else {
        navigate("/verify");
      }
    } catch (err) {
      console.error(err);
      setError("Сервер недоступен");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Регистрация</h2>

        {error && <p className="error">{error}</p>}

        <label>Имя:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите имя"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите email"
          required
        />

        <label>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />

        <label>Подтвердите пароль:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите пароль"
          required
        />

        <div className="agree">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            Я принимаю <Link to="/terms">условия использования</Link>
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
