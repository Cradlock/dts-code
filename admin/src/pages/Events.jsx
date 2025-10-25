import "../css/events.css";
import { useContext, useState, useEffect, createContext } from "react";
import { AuthContext } from "../auth";
import Load from "../components/Load";
import Not403 from "../components/not403";
import { CiSearch, CiRead } from "react-icons/ci";
import { MdEdit, MdDelete,MdDateRange } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { EventContext } from "../event";
import { ProductContext } from "../product";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import MediaViewer from "../components/media";
import { getCSRF } from "../components/lib";

import EventAdd from "../components/events/add";


function formatDate(dateStr) {
  if (!dateStr) return "";
  return format(new Date(dateStr), "dd.MM.yyyy HH:mm", { locale: ru });
}

const EventDetail = ({ obj, set_func }) => {

    return (
        <div className="event-detail-box">

            <button onClick={() => set_func()}>
                <RxCross1 />
            </button>
            <h1>{obj.title}</h1>
            <p>{obj.desc}</p>
            <div className="event-detail-gallery">
                {
                    obj.gallery.map(elem =>
                      (<MediaViewer id="none" width="200px" height="200px" src={elem.file}  />)  
                    )
                }
            </div>


        </div>
    );
}

const EventDelete = ({ obj, set_func }) => {
    const { events, setEvents } = useContext(EventContext);

    const handlerDelete = async () => {
        const endpoint = `${process.env.REACT_APP_API}/admin_api/delete/event/${obj.id}/`;
        try {
            const res = await fetch(endpoint, { method: "GET", credentials: "include", headers: getCSRF() });
            if (res.ok) {
                setEvents(events.filter(ev => ev.id !== obj.id));
                set_func(null);
            } else {
                alert("Иш-чараны өчүрүүдө ката чыкты"); // Error deleting event
            }
        } catch (err) {
            alert("Тармактагы ката"); // Network error
        }
    };

    return (
        <div className="event-delete-box">
            <h1>Сиз чындыгында иш-чараны өчүргүңүз келеби?</h1> {/* Are you sure? */}
            <span>Иш-чара: {obj.title}</span> {/* Event */}
            <div className="event-delete-btns">
                <button onClick={handlerDelete}>Ооба</button> {/* Yes */}
                <button onClick={() => set_func(null)}>Жок</button> {/* No */}
            </div>
        </div>
    );
};



const EventEdit = ({ obj, set_func }) => {
  const { categories, brands } = useContext(ProductContext);
  const { events, setEvents } = useContext(EventContext);

  const [images, setImages] = useState(obj.gallery || []); // текущие изображения
  const [deletedImages, setDeletedImages] = useState([]); // ID удалённых
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: obj.title,
    desc: obj.desc,
    discount_precent: obj.discount_precent || 1.0,
    is_special: obj.is_special || false,
    type_special: obj.type_special || "",
    date_start: obj.date_start || "",
    date_end: obj.date_end || "",
    brands: obj.brands,
    categories: obj.categories,
  });



  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCheckbox = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));

  const toggleListItem = (listName, id) => {
    setFormData((prev) => {
      const list = prev[listName];
      return list.includes(id)
        ? { ...prev, [listName]: list.filter((x) => x !== id) }
        : { ...prev, [listName]: [...list, id] };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({ file }));
    setImages([...images, ...files]);
  };

  const editImage = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    newImages[idx] = { file };
    setImages(newImages);
  };

  const deleteImage = (idx) => {
    const removed = images[idx];
    if (removed.pk) {
      setDeletedImages((prev) => [...prev, removed.pk]);
    }
    setImages(images.filter((_, i) => i !== idx));
  };

  const sendSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = `${process.env.REACT_APP_API}/admin_api/edit/event/${obj.id}/`;
    const data = new FormData();

    // Основные поля
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => data.append(key, v));
      } else {
        data.append(key, value);
      }
    });

    // Галерея
    images.forEach((img) => {
      if (img.file instanceof File) {
        data.append("gallery", img.file);
      }
    });

    // Удалённые изображения
    deletedImages.forEach((id) => data.append("deleted_gallery", id));

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: getCSRF()
      });
      const result = await res.json();

      if (res.ok) {
        setEvents(events.map((ev) => (ev.id === obj.id ? result.data : ev)));
        set_func(null);
      } else {
        alert(result.error || "Ошибка при обновлении события");
      }
    } catch (err) {
      alert("Сетевая ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-edit-box">
      {loading ? (
        <h2>Загрузка...</h2>
      ) : (
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
          ></textarea>


          <div className="event-datetimes">
            <input
              id="edit-date-start"
              type="datetime-local"
              name="date_start"
              value={ formatDate(formData.date_start) }
              onChange={handleChange}
            />
            <label htmlFor="edit-date-start" onClick={() => document.getElementById("edit-date-start").showPicker?.()} >Начало: { formatDate(formData.date_start) }
                <MdDateRange className="date-icon"/>
            </label>


            <input
              id="edit-date-end"
              type="datetime-local"
              name="date_end"
              value={ formatDate(formData.date_end)}
              onChange={handleChange}
            />
            <label htmlFor="edit-date-end" onClick={() => document.getElementById("edit-date-end").showPicker?.()} >Конец: { formatDate(formData.date_end) }

                <MdDateRange className="date-icon"/>
            </label>

          </div>

          <input
            type="number"
            step="0.01"
            name="discount_precent"
            value={formData.discount_precent}
            onChange={handleChange}
            placeholder="Скидка (%)"
          />

          {/* Категории */}
          <div className="selector">
            <h4>Категории:</h4>
            {categories.map((cat) => (
              <label key={cat.id}>
                <input
                  type="checkbox"
                  checked={formData.categories.includes(cat.id)}
                  onChange={() => toggleListItem("categories", cat.id)}
                />
                {cat.title}
              </label>
            ))}
          </div>

          {/* Бренды */}
          <div className="selector">
            <h4>Бренды:</h4>
            {brands.map((b) => (
              <label key={b.id}>
                <input
                  type="checkbox"
                  checked={formData.brands.includes(b.id)}
                  onChange={() => toggleListItem("brands", b.id)}
                />
                {b.title}
              </label>
            ))}
          </div>

          {/* Галерея */}
          <div className="gallery-wrap">
            {images.map((elem, idx) => {
              const src = elem.file;
              return (
                <div className="gallery-img" key={idx}>
                  <input
                    type="file"
                    id={`event-gallery-edit-${idx}`}
                    onChange={(e) => editImage(e, idx)}
                  />

                  
                  <label htmlFor={`event-gallery-edit-${idx}`}>
                    <MdEdit />
                  </label>
                  <button type="button" onClick={() => deleteImage(idx)}>
                    <MdDelete />
                  </button>
                  
                  <MediaViewer id="wdwd" src={src} />
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

          <button type="submit">Сактоо</button>
        </form>
      )}
    </div>
  );
};





const EventBox = ({ obj, set_func }) => {
    return (
        <div className="event-box" key={obj.id}>
            <div className="event-box-title">
                {obj.title}

                <div className="event-box-date">
                    {new Date(obj.date_end).toLocaleDateString('ky-KG')} {/* Дата в кыргызском формате */}
                </div>

                <span>Жеңилдик {obj.discount_precent}% </span> {/* Скидка */}
            </div>

            <div className="event-box-action">
                <button onClick={() => set_func(<EventDetail obj={obj} set_func={set_func} />)}> <CiRead /> </button>
                <button onClick={() => set_func(<EventEdit obj={obj} set_func={set_func} />)}> <MdEdit /> </button>
                <button onClick={() => set_func(<EventDelete obj={obj} set_func={set_func} />)}> <MdDelete /> </button>
            </div>
        </div>
    );
}

const Events = () => {
    const { info, loading } = useContext(AuthContext);
    const { events, event_loading } = useContext(EventContext);
    const [selectedEvent, setSelectedEvent] = useState(null);

    if (loading) return <Load />;
    if (!info) return <Not403 />;

    return (
        <div className="event-container">
            <div className="event-list">
                {event_loading 
                    ? (<p>Жүктөлүүдө...</p>) // Загрузка
                    : events.map((elem, idx) => (
                        <EventBox key={idx} obj={elem} set_func={setSelectedEvent} />
                    ))
                }
            </div>

            <div className="event-add" onClick={() => setSelectedEvent(<EventAdd set_func={setSelectedEvent} />)}>
                <button> <FaPlus /> </button>
            </div>

            {selectedEvent && (
                <div id="modal-event" onClick={() => setSelectedEvent(null)}>
                    <div id="modal-event-inner" onClick={(e) => e.stopPropagation()}>
                        {selectedEvent}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
