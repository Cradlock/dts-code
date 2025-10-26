import "../../css/event_add.css";
import { useContext, useState } from "react";
import { MdDelete, MdDateRange } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { EventContext } from "../../event";
import { ProductContext } from "../../product";
import MediaViewer from "../media";

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
    images.forEach((img) => data.append("gallery", img.file));

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
    <div className="event-add-overlay">
      <div className="event-add-box">
        <h2 className="modal-title">Добавить событие</h2>
        <form onSubmit={sendSubmit} className="event-add-form">
          <input
            type="text"
            value={formData.title}
            name="title"
            onChange={handleChange}
            placeholder="Название события"
            required
          />

          <textarea
            value={formData.desc}
            name="desc"
            onChange={handleChange}
            placeholder="Описание"
          />

          <div className="input-group">
            <label htmlFor="discount_event_add">Скидка (%)</label>
            <input
              type="number"
              name="discount_precent"
              value={formData.discount_precent}
              onChange={handleChange}
              id="discount_event_add"
            />
          </div>

          <div className="event-datetimes">
            <div>
              <label>Начало</label>
              <input
                type="datetime-local"
                name="date_start"
                value={formData.date_start}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Конец</label>
              <input
                type="datetime-local"
                name="date_end"
                value={formData.date_end}
                onChange={handleChange}
              />
            </div>
          </div>

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

          <div className="gallery-wrap">
            {images.map((elem, idx) => (
              <div className="gallery-img" key={idx}>
                <MediaViewer id={`image-${idx}`} src={elem} />
                <button type="button" className="delete-btn" onClick={() => deleteImage(idx)}>
                  <MdDelete />
                </button>
              </div>
            ))}

            <label htmlFor="gallery-add-event" className="gallery-add">
              <FaPlus />
            </label>
            <input
              id="gallery-add-event"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="buttons">
            <button type="submit" className="submit-btn">Добавить</button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => set_func(null)}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventAdd;
