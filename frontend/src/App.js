// App.js
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useContext } from "react";
import { Helmet } from "react-helmet";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/login.jsx";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import Home from "./pages/home/home.jsx";
import Catalog from "./pages/catalog/Сatalog.jsx";
import Details from "./pages/details/details.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import About from "./pages/About/About.jsx";
import News from "./pages/News/News.jsx";
import NewsDetails from "./pages/NewsDetails/NewsDetails.jsx";
import Reset from "./pages/auth/Reset.jsx";
import OrderNotifications from "./components/order/OrderNottifications.jsx";

import { InfoContext } from "./providers/info.js";
import { AuthContext } from "./providers/auth.js";
import NotFound from "./pages/NotFound.jsx/NotFound.jsx";

function App() {
  const { info_data, info_loading } = useContext(InfoContext);
  const { userData } = useContext(AuthContext);

  if (info_loading) {
    return (
      <h1 className="ddos-guard">
        Anti Ddos guard... (by Grok) and (WorthlessSoul)
      </h1>
    );
  }

  return (
    <BrowserRouter>
      <Header />

      {/* Динамический favicon и title */}
      {info_data && (
        <Helmet>
          <title>{info_data.title || "Магазин"}</title>
          <link
            rel="icon"
            href={info_data.logo || "/favicon.png"}
            type="image/png"
          />
        </Helmet>
      )}

      {userData && <OrderNotifications />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />

        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Reset />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <br />
      
      <Footer />
    </BrowserRouter>
  );
}

export default App;
