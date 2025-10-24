import "../css/panel.css";
import { useContext, useState,useEffect } from "react";
import { AuthContext } from "../auth";
import { ProductContext } from "../product"; 
import Load from "../components/Load";
import Not403 from "../components/not403";
import { FaPlus, FaTimes,FaTelegram,FaWhatsapp,FaInstagram,FaEnvelope,FaPhone,FaTelegramPlane } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaNotdef } from "react-icons/fa6";
import MiniLoad from "../components/MiniLoad";
import { getCSRF } from "../components/lib";

const Modal = ({type,setModal}) => {
    const { categories, brands, setCategories, setBrands } = useContext(ProductContext);
    const [isLoad,setIsLoad] = useState(false);

    let [formData, setFormData] = useState({ title: "", range_update: 1, discount: 0 });

    const handleFormChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
    };

     // Создание новой категории/бренда
    const handleCreate = async (type, data) => {
        try {
            setIsLoad(true); // включаем спиннер

            // дайте React рендернуть спиннер
            await new Promise((resolve) => setTimeout(resolve, 0));
            const payload = {
               ...data,
               range_update: `${Number(data.range_update)} 00:00:00`, // число дней
              
            };
            const response = await fetch(`${process.env.REACT_APP_API}/admin_api/${type}/`, {
                method: "POST",
                credentials: "include",
                headers: getCSRF(),
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Ошибка при создании");


            const newItem = await response.json();

            if (type === "category") setCategories([...categories, newItem]);
            if (type === "brands") setBrands([...brands, newItem]);
            
            setIsLoad(false);
            setModal(null);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };


    return (
            <div className="panel-modal">

                
                <div className="panel-modal-content">
                                    {
                    isLoad && 
                <MiniLoad />
                }
                    <button className="panel-modal-close" onClick={() => setModal(null)}>
                        <FaTimes />
                    </button>
                    <h3>{type === "category" ? "Создать категорию" : "Создать бренд"}</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreate(type, formData); }}>
                        <input
                            type="text"
                            name="title"
                            placeholder="Название"
                            value={formData.title}
                            onChange={handleFormChange}
                            required
                        />
                        {type === "category" && (
                            <>
                                <input
                                    type="number"
                                    name="range_update"
                                    placeholder="Обновления (дни):"
                                    value={formData.range_update}
                                    onChange={handleFormChange}
                                    required
                                />
                                <input
                                    type="number"
                                    name="discount"
                                    placeholder="Discount"
                                    step="0.01"
                                    value={formData.discount}
                                    onChange={handleFormChange}
                                />
                            </>
                        )}
                        <button type="submit">Создать</button>
                    </form>
                </div>
            </div>
        );
};

const Panel = () => {
    const { info, loading,setInfo } = useContext(AuthContext);
    const { categories, brands, setCategories, setBrands } = useContext(ProductContext);
    
    const [modal, setModal] = useState(null);
    const [loadedC,setLoadedC] = useState([]);
    const [loadedB,setLoadedB] = useState([]);


    const [load,setLoad] = useState(false);

 
    const [siteInfo,setSiteInfo] = useState({
        title: info?.title || "",
        logo: info?.logo || null,
        telegramm: info?.telegramm || "",
        instagramm: info?.instagramm || "",
        whatsapp: info?.whatsapp || "",
        gmail: info?.gmail || "",
        contact_number: info?.contact_number || "",
        cashier_numbers:  Array.isArray(info?.cashier_numbers) ? info.cashier_numbers : []
    });
    
    const [num,setNum ] = useState("");
    
    useEffect(() => {
    
        if (info) {
    
            setSiteInfo({
    
                title: info.title || "",
    
                logo: info.logo || null,
    
                telegramm: info.telegramm || "",
    
                instagramm: info.instagramm || "",
    
                whatsapp: info.whatsapp || "",
    
                gmail: info.gmail || "",
    
                contact_number: info.contact_number || "",
    
                cashier_numbers: Array.isArray(info.cashier_numbers) ? info.cashier_numbers : []
    
            });

    
        }
    
    }, [info]);



    if (loading) return <Load />;
    if (!info) return <Not403 />;



    const addCashierNumber = () => {
        const trimmedNum = num.trim();
        if (!trimmedNum) return; 
    
        setSiteInfo(prev => {
         
            if (prev.cashier_numbers.includes(trimmedNum)) {
                return prev;
            }
            return {
                ...prev,
                cashier_numbers: [...prev.cashier_numbers, trimmedNum]
            };
        });
    
        setNum(""); 
    };

const setElemNumbers = (idx, newValue) => {
    const trimmedValue = newValue.trim();

    setSiteInfo(prev => {
        const updatedNumbers = [...prev.cashier_numbers];

        if (!trimmedValue) {
            // Если поле пустое, удаляем элемент
            updatedNumbers.splice(idx, 1);
        } else {
            // Иначе обновляем значение
            updatedNumbers[idx] = trimmedValue;
        }

        return {
            ...prev,
            cashier_numbers: updatedNumbers
        };
    });
};


    const handleChange = (e, id, list, setList) => {
        const { name, value } = e.target;
        const newList = list.map((item) =>
            item.id === id ? { ...item, [name]: value } : item
        );
        setList(newList);
    };

  
    const handleSave = async (item, endpoint) => {
        try {
            if (endpoint === "category") setLoadedC(prev => [...prev, item.id]);
            if (endpoint === "brands") setLoadedB(prev => [...prev, item.id]);

            const payload = {
               ...item,
               range_update:`${Number(item.range_update)} 00:00:00`, // число дней
            };

            const response = await fetch(`${process.env.REACT_APP_API}/admin_api/${endpoint}/${item.id}/`, {
                method: "PUT",
                credentials: "include",
                headers: getCSRF(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("Ошибка при сохранении");

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
        // Выключаем спиннер
        if (endpoint === "category") setLoadedC(prev => prev.filter(id => id !== item.id));
        if (endpoint === "brands") setLoadedB(prev => prev.filter(id => id !== item.id));
    }
    };

    const handleDelete = async (id, endpoint, list, setList) => {
        try {
            if (endpoint === "category") setLoadedC(prev => [...prev, id]);
            if (endpoint === "brands") setLoadedB(prev => [...prev, id]);

            // Удаляем из состояния
            const response = await fetch(`${process.env.REACT_APP_API}/admin_api/${endpoint}/${id}/`, {
                method: "DELETE",
                credentials: "include",
            });
    
            if (!response.ok) throw new Error("Ошибка при удалении");
            setList(list.filter(item => item.id !== id));

            if (endpoint === "category") setLoadedC(prev => prev.filter(i => i !== id));
            if (endpoint === "brands") setLoadedB(prev => prev.filter(i => i !== id));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoad(true);

        const formData = new FormData();
        formData.append("title", siteInfo.title);
        formData.append("telegramm", siteInfo.telegramm);
        formData.append("instagramm", siteInfo.instagramm);
        formData.append("whatsapp", siteInfo.whatsapp);
        formData.append("gmail", siteInfo.gmail);
        formData.append("contact_number", siteInfo.contact_number);

        siteInfo.cashier_numbers.forEach(num => {
            formData.append("cashier_numbers", num);
        });
    
        if (siteInfo.logo instanceof File) {
            formData.append("logo", siteInfo.logo);
        }
    
        try {
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/setInfo/`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });
    
            const result = await res.json();
            if (res.ok) {
                // Обновляем локальный state
                setSiteInfo(result.data);
                setLoad(false);
            } else {
                alert(result.error || "Ошибка при сохранении");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка сети");
        }
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]; // берём первый файл
        if (file) {
            setSiteInfo(prev => ({ ...prev, logo: file }));
        }
    }

    const changeSiteInfo = (e) => {
        setSiteInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="panel-container">
            <div className="panel-siteInfo">
                { load &&
                   <MiniLoad />
                }
            <form onSubmit={handleSubmit}>
            
                <div className="panel-site-logo">    
                    <input type="file" id="panel-logo-set" onChange={handleLogoChange} />
                    <label htmlFor="panel-logo-set">
                        {siteInfo.logo == null 
                            ? <FaNotdef /> 
                            : <img src={typeof siteInfo.logo === "string" ? siteInfo.logo : URL.createObjectURL(siteInfo.logo)} 
                                   alt="site logo" />}
                    </label>
            
                    <input
                        type="text"
                        value={siteInfo.title}
                        name="title"
                        placeholder="Название сайта"
                        onChange={changeSiteInfo}
                    />     
                </div>
                
                <div className="panel-site-text">
                    <div className="panel-contact-item">
                        <a href={siteInfo.telegramm} target="_blank" rel="noopener noreferrer">
                            <FaTelegramPlane />
                        </a>
                        <input
                            type="text"
                            value={siteInfo.telegramm}
                            name="telegramm"
                            placeholder="Telegram ссылка"
                            onChange={changeSiteInfo}
                        />
                    </div>
            
                    <div className="panel-contact-item">
                        <a href={siteInfo.whatsapp} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp />
                        </a>
                        <input
                            type="text"
                            value={siteInfo.whatsapp}
                            name="whatsapp"
                            placeholder="WhatsApp ссылка"
                            onChange={changeSiteInfo}
                        />
                    </div>
            
                    <div className="panel-contact-item">
                        <a href={siteInfo.instagramm} target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <input
                            type="text"
                            value={siteInfo.instagramm}
                            name="instagramm"
                            placeholder="Instagram ссылка"
                            onChange={changeSiteInfo}
                        />
                    </div>
            
                    <div className="panel-contact-item">
                        <a href={`mailto:${siteInfo.gmail}`} target="_blank" rel="noopener noreferrer">
                            <FaEnvelope />
                        </a>
                        <input
                            type="email"
                            value={siteInfo.gmail}
                            name="gmail"
                            placeholder="Email"
                            onChange={changeSiteInfo}
                        />
                    </div>
            
                    <div className="panel-contact-item">
                        <a href={`tel:${siteInfo.contact_number}`}>
                            <FaPhone />
                        </a>
                        <input
                            type="tel"
                            value={siteInfo.contact_number}
                            name="contact_number"
                            placeholder="Номер телефона"
                            onChange={changeSiteInfo}
                        />
                    </div>
                </div>

                
            
                   
                <div className="panel-workersInfo">
                    <h1>Номера для кассиров</h1>
                    { siteInfo.cashier_numbers.length == 0 ? (<h1>Хотя бы один номер</h1>) : <></> }
                    <input type="tel" pattern="[0-9]{10}" placeholder="+7 123 456 78 90" value={num} onChange={ (e) => setNum(e.target.value) } />
                    <button type="button" onClick={() => addCashierNumber()}> <FaPlus /> </button>
                    {
                        siteInfo.cashier_numbers.map( (elem,idx) => {
                            
                            return (
                            <div key={idx} className="panel-workers-elem">
                                <input type="tel" value={elem} onChange={ (e) => setElemNumbers(idx,e.target.value) }/>
                            </div>
                            )
                        })    
                    } 
                
                </div>


                <button type="submit">Save</button>
            
            </form>

            </div>



            <div className="panel-info">
                {/* Категории */}
                <div className="panel-category">
                    <h1>Категории</h1>

                    <div className="panel-category-list">
                        {categories && categories.map((elem) => (
                            <div className="panel-category-elem" key={elem.id}>
                                { 
                                    loadedC .includes(elem.id) && <MiniLoad />
                                }
                                <form>
                                    <input
                                        type="text"
                                        name="title"
                                        value={elem.title}
                                        onChange={(e) => handleChange(e, elem.id, categories, setCategories)}
                                    />
                                    <input
                                        type="number" 
                                        name="range_update"
                                        value={ Number(elem.range_update) || 60}
                                        onChange={(e) => handleChange(e, elem.id, categories, setCategories)}
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="discount"
                                        value={elem.discount}
                                        onChange={(e) => handleChange(e, elem.id, categories, setCategories)}
                                    />
                                    <input
                                        type="text"
                                        name="last_update"
                                        value={elem.last_update}
                                        disabled
                                    />
                                    <button type="button" onClick={() => handleSave(elem, "category")}>
                                        Save
                                    </button>
                                    <button type="button" onClick={() => handleDelete(elem.id, "category", categories, setCategories)}>
                                        <MdDelete />
                                    </button>
                                </form>

                            </div>
                        ))}
                    </div>

                    <div className="panel-category-add">
                        <button onClick={() => setModal( <Modal type="category" setModal={setModal} /> )}><FaPlus /></button>
                    </div>
                </div>

                {/* Бренды */}
                <div className="panel-brands">
                    <h1>Бренды</h1>
                    <div className="panel-brand-list">
                        {brands && brands.map((elem,idx) => (
                            <div className="panel-brand-elem" key={elem.id}>
                                { 
                                    loadedB.includes(elem.id) && <MiniLoad />
                                }
                                <form>
                                    <input
                                        type="text"
                                        name="title"
                                        value={elem.title}
                                        onChange={(e) => handleChange(e, elem.id, brands, setBrands)}
                                    />
                                    <button type="button" onClick={() => handleSave(elem, "brands")}>
                                        Save
                                    </button>
                                    <button type="button" onClick={() => handleDelete(elem.id, "brands", brands, setBrands)}>
                                        <MdDelete />
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>

                    <div className="panel-brand-add">
                        <button onClick={() => setModal(<Modal type="brands" setModal={setModal} />)}><FaPlus /></button>
                    </div>
                </div>

                {/* Модальное окно */}
                {modal}
            </div>
        </div>
    );
};

export default Panel;
