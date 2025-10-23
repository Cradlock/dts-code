import { InfoContext } from "../../providers/info";
import { useContext } from "react";


const Footer = () => {
  const { info_data, info_loading } = useContext(InfoContext);

  if (info_loading) {
    return <h1>Anti DDoS Guard... (by Aidar) and (WorthlessSoul)</h1>;
  }

  if (!info_data) {
    return <h2>Ошибка загрузки информации о компании</h2>;
  }

  return (
    <footer className="footer">
      <div className="footer-overlay"></div>
      <div className="container">
        <div className="footer-content">
          {/* О компании */}
          <div className="footer-col">
            <h4>О компании</h4>
            <p>
              Мы создаём современные IT-решения, помогаем бизнесу и людям расти
              вместе с технологиями.
            </p>
            <p className="copyright">
              © 2025 IT Run | Сделано с ❤️ by WorthlessSoul
            </p>
          </div>

          {/* Контакты */}
          <div className="footer-col">
            <h4>Контакты</h4>
            <p>
              📧{" "}
              <a
                href={`mailto:${info_data.gmail || "example@gmail.com"}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {info_data.gmail || "example@gmail.com"}
              </a>
            </p>
            <p>📞 {info_data.contact_number || "+996 555 123 456"}</p>
          </div>

          {/* Соцсети */}
          <div className="footer-col">
            <h4>Соцсети</h4>
            <div className="social-links">
              {info_data?.instagramm && (
                <a
                  href={info_data.instagramm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn instagram"
                >
                  📸 Instagram
                </a>
              )}
              {info_data?.telegramm && (
                <a
                  href={info_data.telegramm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn telegram"
                >
                  💬 Telegram
                </a>
              )}
              {info_data?.whatsapp && (
                <a
                  href={info_data.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn whatsapp"
                >
                  📱 WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
