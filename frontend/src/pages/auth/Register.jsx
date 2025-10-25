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
      setError("Бардык талааларды толтуруңуз");
      return;
    }

    if (password !== confirmPassword) {
      setError("Паролдор дал келбейт");
      return;
    }

    if (!agree) {
      setError("Колдонуу шарттарын кабыл алганыңыз керек");
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
        setError(result.error || "Каталык катталууда");
      } else {
        navigate("/verify");
      }
    } catch (err) {
      console.error(err);
      setError("Сервер жеткиликсиз");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Катталуу</h2>

        {error && <p className="error">{error}</p>}

        <label>Аты:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Атыңызды киргизиңиз"
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email киргизиңиз"
          required
        />

        <label>Пароль:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль киргизиңиз"
          required
        />

        <label>Паролду тастыктоо:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Паролду кайталаныз"
          required
        />

        <div className="agree">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            Мен <Link to="/terms">колдонуу шарттарын</Link> кабыл алам
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Катталууда..." : "Катталуу"}
        </button>

        <p>
          Аккаунт барбы? <Link to="/login">Кирүү</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
