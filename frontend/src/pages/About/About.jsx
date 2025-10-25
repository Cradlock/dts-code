import React from "react";
import aboutImage from "../../images/Снимок экрана 2025-08-27 204513.png"; // сюда добавь свою картинку
import { FaLightbulb, FaUsers, FaShieldAlt, FaHistory } from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      {/* Баннер */}
      <div className="about-banner">
        <img src={aboutImage} alt="Биз тууралуу" className="about-banner-img" />
        <h1>Биз тууралуу</h1>
        <p className="about-banner-subtitle">
          Биздин максат – технология аркылуу адамдардын жашоосун жеңилдетүү.
        </p>
      </div>

      {/* Контент */}
      <div className="about-content">
        {/* Наша миссия */}
    

        {/* Биз кимбиз */}
        <section className="about-section">
          <h2>Биз кимбиз?</h2>
          <p>
            Биз – инновациялык чечимдерди сунуштаган профессионал командабыз. 
            Биздин адистер ар дайым жаңы технологияларды изилдеп, клиенттер үчүн эң жакшы чечимдерди сунуштайт.
          </p>
        </section>

        {/* Баалуулуктар */}
        <section className="about-section about-values">
          <h2>Биздин баалуулуктар</h2>
          <div className="values-grid">
            <div className="value-card">
              <FaShieldAlt className="value-icon"/>
              <h3>Сапат</h3>
              <p>Бардык продукттар жана кызматтар эң жогорку стандартка жооп берет.</p>
            </div>
            
            <div className="value-card">
              <FaUsers className="value-icon"/>
              <h3>Ишеним</h3>
              <p>Кардарлар менен ачык жана туруктуу байланыш.</p>
            </div>
            <div className="value-card">
              <FaHistory className="value-icon"/>
              <h3>Команда</h3>
              <p>СНГ боюнча жеткирүү</p>
            </div>
          </div>
        </section>

        {/* Тарых */}
        <section className="about-section">
          <h2>Тарыхыбыз</h2>
          <p>
            Компания 2025-жылы негизделген жана ушул убакка чейин көптөгөн ийгиликтерге жетишти. 
            Биздин продукттар дүйнөнүн ар кайсы өлкөлөрүндө колдонулуп келет.
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;
