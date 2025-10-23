import { Link,Routes,Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Panel from "./pages/Panel";
import Events from "./pages/Events";
import Reset from "./pages/Reset";
import Products from "./pages/Products";
import "./css/index.css";
import { EventProvider } from "./event";
import { ProductProvider } from "./product";
import OrderPage from "./pages/Orders";

function App() {
  return (
    <EventProvider>
      <ProductProvider>
    <div className="App">
         <Header />

         
         <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/panel" element={<Panel />} />
              <Route path="/products" element={<Products />} />
              <Route path="/events" element={<Events />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/orders" element={<OrderPage />} />
         </Routes>
    </div>
      </ProductProvider>
    </EventProvider>
  );
}

export default App;
