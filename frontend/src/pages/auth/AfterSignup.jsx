import { useNavigate } from "react-router-dom";


const VerifyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="verify-email-page">
        <h1>Ccылка для подверждения была отправлены на email</h1>
    </div>
  );
};

export default VerifyPage;
