import { InfoContext } from "../../providers/info";
import { useContext } from "react";

const Footer = () => {
  const { info_data, info_loading } = useContext(InfoContext);

  if (info_loading) {
    return <h1>Anti DDoS Guard... (by Aidar) and (WorthlessSoul)</h1>;
  }

  if (!info_data) {
    return <h2>Компания жөнүндө маалыматты жүктөөдө ката кетти</h2>;
  }

  return (
    <footer className="footer">
      <div className="footer-overlay"></div>
      <div className="container">
        <div className="footer-content">
          {/* Компания жөнүндө */}
          <div className="footer-col">
            <h4>Компания жөнүндө</h4>
          </div>

          {/* Байланыштар */}
          <div className="footer-col">
            <h4>Байланыштар</h4>
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

          {/* Социалдык тармактар */}
          <div className="footer-col">
            <h4>Социалдык тармактар</h4>
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
