import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleRedirect, setGoogleRedirect] = useState(null);

  // Google redirect URL алуу
  useEffect(() => {
    const fetchGoogleRedirect = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}accounts/google/login/`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Google үчүн URL алуу учурунда каталык");
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
      setError("Бардык талааларды толтуруңуз");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // username же email
      formData.append("password", password);

      const res = await fetch(`${process.env.REACT_APP_API}accounts/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "include",
        body: formData.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Кирүү ийгиликтүү:", data);
        // бул жерде негизги баракка багыттоого болот
      } else if (res.status === 401) {
        setError("Кирүү же пароль туура эмес");
      } else {
        setError("Серверде каталык чыкты");
      }
    } catch (err) {
      console.error(err);
      setError("Тармакта каталык чыкты");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (googleRedirect) {
      window.location.href = googleRedirect; // Google'ге багыттоо
    } else {
      alert("Google авторизация үчүн URL жеткиликсиз");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Аккаунтка кирүү</h2>

        {error && <p className="error">{error}</p>}

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Emailиңизди киргизиңиз"
          required
        />

        <label>Пароль:</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль киргизиңиз"
            required
          />
          <button
            type="button"
            className="show-pass"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Жашыруу" : "Көрсөтүү"}
          </button>
        </div>

        <div className="remember-forgot">
          <Link to="/forgot">Паролду унуттуңузбу?</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Кирүү..." : "Кирүү"}
        </button>

        {/* Google менен кирүү */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-login"
        >
          Google аркылуу кирүү
        </button>

        <p>
          Аккаунт жокпу? <Link to="/register">Катталуу</Link>
        </p>
      </form>
    </div>
  );
}
