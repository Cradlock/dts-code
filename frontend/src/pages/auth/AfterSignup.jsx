import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="verify-email-page">
      <h1>Тастыктоо шилтемеси сиздин emailге жөнөтүлдү</h1>
      <p>Электрондук почтаңызды текшериңиз жана шилтемеге өтүңүз.</p>
      <button onClick={() => navigate("/login")}>
        Кирүүгө кайтуу
      </button>
    </div>
  );
};

export default VerifyPage;
