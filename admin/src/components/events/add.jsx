import "../../css/event_add.css";
import { useContext, useState } from "react";
import { MdDelete,MdDateRange } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { EventContext } from "../../event";
import { ProductContext } from "../../product";
import MediaViewer from "../media";
import { getCSRF } from "../lib";


function EventAdd({ set_func }) {
  const { categories, brands } = useContext(ProductContext);
  const { events, setEvents } = useContext(EventContext);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    date_start: "",
    date_end: "",
    discount_precent: 1.0,
    brands: [],
    categories: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSelect = (key, id) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((item) => item !== id)
        : [...prev[key], id],
    }));
  };

  // Загрузка файлов
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({ file }));
    setImages([...images, ...newImages]);
  };

  const editImage = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[idx] = { file };
    setImages(newImages);
  };

  const deleteImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Отправка формы
  const sendSubmit = async (e) => {
    e.preventDefault();

    const endpoint = `${process.env.REACT_APP_API}/admin_api/add/event/`;
    const data = new FormData();

    data.append("title", formData.title);
    data.append("desc", formData.desc);
    data.append("discount_precent", formData.discount_precent);

    if (formData.date_start) data.append("date_start", formData.date_start);
    if (formData.date_end) data.append("date_end", formData.date_end);

    formData.brands.forEach((id) => data.append("brands", id));
    formData.categories.forEach((id) => data.append("categories", id));

    console.log(formData.categories);

    images.forEach((img) => {
      data.append("gallery", img.file);
    });

    for (let [key, value] of data.entries()) {
  console.log(`${key}:`, value);
}


    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();
      if (res.ok) {
        setEvents([...events, result]);
        set_func(null);
      } else {
        alert(result.error || "Ошибка при добавлении события");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  return (
    <div className="event-add-box">
      <form onSubmit={sendSubmit}>

        <input
          type="text"
          value={formData.title}
          name="title"
          onChange={handleChange}
          placeholder="Название"
        />

        <textarea
          value={formData.desc}
          name="desc"
          onChange={handleChange}
          placeholder="Описание"
        />


          <input
          type="number"
          name="discount_precent"
          value={formData.discount_precent}
          onChange={handleChange}
          placeholder="Скидка (влияние на продукты) (%)"
          id="discount_event_add"
          />

          <label htmlFor="discount_event_add">
            <span>Скидка</span>
          </label>
        


        <div className="event-datetimes">
          <input
            id="add-date-start"
            type="datetime-local"
            name="date_start"
            value={formData.date_start}
            onChange={handleChange}
          />
          <label htmlFor="add-date-start" onClick={() => document.getElementById("add-date-start").showPicker?.()}>Начало:{formData.date_start}
            <MdDateRange className="date-icon" />
          </label>

          <input
            id="add-date-end"
            type="datetime-local"
            name="date_end"
            value={formData.date_end}
            onChange={handleChange}
          />
          <label htmlFor="add-date-end" onClick={() => document.getElementById("add-date-end").showPicker?.()}>Конец:{formData.date_end}
            <MdDateRange className="date-icon" />
          </label>

        </div>



        {/* ✅ Выбор категорий */}
        <div className="category-select">
          <h4>Категории</h4>
          {categories.map((cat) => (
            <label key={cat.id}>
              <input
                type="checkbox"
                checked={formData.categories.includes(cat.id)}
                onChange={() => toggleSelect("categories", cat.id)}
              />
              {cat.title}
            </label>
          ))}
        </div>

        {/* ✅ Выбор брендов */}
        <div className="brand-select">
          <h4>Бренды</h4>
          {brands.map((brand) => (
            <label key={brand.id}>
              <input
                type="checkbox"
                checked={formData.brands.includes(brand.id)}
                onChange={() => toggleSelect("brands", brand.id)}
              />
              {brand.title}
            </label>
          ))}
        </div>

        {/* Галерея */}
        <div className="gallery-wrap">
          {images.map((elem, idx) => {
            const src = elem;
            return (
              <div className="gallery-img" key={idx}>
                <input
                  type="file"
                  id={`img-file-setter-${idx}`}
                  onChange={(e) => editImage(e, idx)}
                />
                <button type="button" onClick={() => deleteImage(idx)}>
                  <MdDelete />
                </button>

                <MediaViewer id={"efrewwe"} src={src} />
              </div>
            );
          })}

          <input
            id="gallery-add-event"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="gallery-add-event" className="gallery-add">
            <FaPlus />
          </label>
        </div>

        <button type="submit">Окуя кошуу </button>
      </form>
    </div>
  );
}


export default EventAdd;