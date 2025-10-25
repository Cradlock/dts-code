import { use, useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth";
import Load from "../components/Load";
import Not403 from "../components/not403";
import { ProductContext } from "../product";
import { FaPlus,FaSearch } from "react-icons/fa";
import "../css/products.css";
import "../css/product_edit_modal.css";
import "../css/product_add.css";
import { RxCross1,RxActivityLog } from "react-icons/rx";
import { MdDelete,MdEdit } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import MiniLoad from "../components/MiniLoad";
import { da } from "date-fns/locale";
import { IoMdRefreshCircle } from "react-icons/io";
import { getCSRF } from "../components/lib";



const ProductAdd = ({ set_func }) => {
    const [gallery, setGallery] = useState([]);
    const [cover, setCover] = useState(null);
    const [desc,setDesc] = useState({});
    const [descElem,setDescElem] = useState({key: "",value: ""});
    const { categories, brands,setProducts } = useContext(ProductContext);

    const [isLoad,setIsLoad] = useState(false);

    const handleEditFile = (e,idx) => {
        const file = e.target.files[0];
        if (!file) return;
      
        const newImages = [...gallery];
        newImages[idx] = { file };
        setGallery(newImages);
    }
    
    const handleDeleteFile = (idx) => {
        const newImages = gallery.filter((_, index) => index !== idx);
        setGallery(newImages);
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setGallery([...gallery, ...files]); 
    };

    const handleAddDesc = (e) => {
        e.preventDefault();
        if (!descElem.key.trim()) return;
        setDesc({ ...desc, [descElem.key]: descElem.value });
        setDescElem({ key: "", value: "" }); 
    };

    const handleDeleteDesc = (key) => {
        const newDesc = { ...desc };
        delete newDesc[key];
        setDesc(newDesc);
    };

    const handleUpdateDesc = (key, value) => {
        setDesc({ ...desc, [key]: value });
    };


    const handleSubmit = async (e) => {
         if (!e.target.checkValidity()) return; 

        e.preventDefault();
        const formData = new FormData();

        const formElements = e.target.elements;
    
        formData.append("title", formElements.title.value);
        formData.append("price", formElements.price.value);
        formData.append("discount", formElements.discount.value || 0);
        formData.append("count", formElements.count.value || 1);
        formData.append("category", formElements.category.value || 0);
        formData.append("brand", formElements.brand.value || 0);
    
        formData.append("desc", JSON.stringify(desc));
    
        if (cover) {
            formData.append("cover", cover);
        }
    
        gallery.forEach((file) => {
            const fileObj = file.file ? file.file : file;
            formData.append("gallery", fileObj);
        });
    
        try {
            setIsLoad(true);
            const response = await fetch(`${process.env.REACT_APP_API}/admin_api/add/product/`, {
                method: "POST",
                body: formData,
                credentials: "include",
                headers: getCSRF()
            });
    
            if (!response.ok) {
                alert(`Ошибка ${response.status}`);
                setIsLoad(false);
                set_func(null);
                return;

            }
            const newProduct = await response.json();
            setProducts((prev) => [...prev, newProduct]);
            setIsLoad(false);
            set_func(null);
        } catch (err) {
            console.error("Ошибка при добавлении продукта:", err);
        }
    };

    return (
        <div className="product_add_modal">
            <button onClick={() => set_func(null)}>
                <RxCross1 />
            </button>
   
            {
                isLoad ? <MiniLoad /> :
            

            <form onSubmit={handleSubmit}>
                <input name="title" placeholder="title"  />
                <input name="price" placeholder="price" type="number"  />
                <input name="discount" placeholder="discount" type="number" />
                <input name="count" placeholder="count" type="number" />

                <select name="category" required>
                    {categories.map((elem) => (
                        <option key={elem.id} value={elem.id}>
                            {elem.title}
                        </option>
                    ))}
                </select>

                <select name="brand" required>
                    {brands.map((elem) => (
                        <option key={elem.id} value={elem.id}>
                            {elem.title}
                        </option>
                    ))}
                </select>

                <input id="product-add-cover" type="file" name="cover" onChange={ (e) => setCover(e.target.files[0])}/>
                <label htmlFor="product-add-cover" style={{ cursor: "pointer" }}>
                { cover ? (
                <img width={"50px"} height={"50px"}
                   src={URL.createObjectURL(cover)} 
                />) :  
                <div style={{ padding: "10px", border: "1px solid #ccc" }}>Обложка</div>
                }
                </label>

                <div className="product_modal_form_gallery">
                    <label htmlFor="product_modal_add_input">
                        <FaPlus />
                    </label>

                    <input type="file" multiple onChange={handleFileChange} id="product_modal_add_input"/>

                    <div className="product_modal_images">
                        {gallery.map((item, idx) => {
                            const fileObj = item.file ? item.file : item;

                            return (<div key={idx} className="product_modal_form_gallery_elem">

                                <img
                                    width="50"
                                    height="50"
                                    src={URL.createObjectURL(fileObj)}
                                    alt="preview"
                                />

                                <label htmlFor={`product_modal_elem_edit_${idx}`}>
                                    <MdEdit />
                                </label>

                                <input id={`product_modal_elem_edit_${idx}`} type="file" onChange={(e) => handleEditFile(e,idx)}/>


                                <button onClick={ () => handleDeleteFile(idx) }>
                                    <MdDelete />
                                </button >


                            </div>
                            )
                        })}
                    </div>
                </div>

                <div className="product_modal_form_desc">
                    <div className="product_modal_form_desc_add">
                        <input
                            value={descElem.key}
                            onChange={(e) =>
                               setDescElem({
                                ...descElem,
                                key: e.target.value,
                               })
                            }
                            placeholder="Key"
                        />

                        <input
                            value={descElem.value}
                            onChange={(e) =>
                                setDescElem({
                                    ...descElem,
                                    value: e.target.value,
                                })
                            }
                            placeholder="Value"
                        />

                        <button type="button" onClick={handleAddDesc}>
                            <FaPlus />
                        </button>
                    </div>
                    
                    <div className="product_modal_form_desc_list">
                           {Object.entries(desc).map(([key, value]) => (
                            <div
                                key={key}
                                className="product_modal_form_desc_edit_elem"
                            >
                                <input
                                    value={key}
                                    onChange={(e) => {
                                        const newKey = e.target.value;
                                        if (!newKey) return; 
                                        
                                        setDesc((prev) => {
                                          const newDesc = { ...prev };
                                          newDesc[newKey] = newDesc[key];
                                          if (newKey !== key) delete newDesc[key];
                                          return newDesc;
                                        });
                                    }}
                                    style={{ width: "100px" }}
                                />

                                <input
                                    value={value}
                                    onChange={(e) =>
                                        handleUpdateDesc(key, e.target.value)
                                    }
                                    style={{ width: "150px" }}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleDeleteDesc(key)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                    </div>
                </div> 

                <button type="submit">Add+</button>

            </form>
            }
        </div>
    );
};


const ProductDelete = ({indices,set_func}) => {
    const {setProducts} = useContext(ProductContext);
    const [isLoad,setIsLoad] = useState(false);
    
    const handleSubmit = async (ids) => {
      try {
        setIsLoad(true);
        const query = ids.map(id => `indices=${id}`).join("&");
        const response = await fetch(`${process.env.REACT_APP_API}/admin_api/delete/product/?${query}`, {
          method: "DELETE",   
          credentials: "include",
          headers: getCSRF()
        });
    
        if (!response.ok) throw new Error("Ошибка при удалении");
    
        setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
        setIsLoad(false);
        set_func(null);
        
      } catch (err) {
        console.error(err);
        alert("Ошибка удаления");
      }
    };
    
    return (        
    <div className="delete_modal_container">
            <div>
                <button onClick={() => set_func(null)}>
                    <RxCross1 />
                </button>
            </div>
            {
                isLoad ? <MiniLoad /> :
            <div className="delete_modal_btns">
                <button onClick={() => handleSubmit(indices)}>Да</button>
                <button onClick={() => set_func(null)}>Нет</button>
            </div>
            }
    </div>)
}

const ProductFilter = ({set_func}) => {
    const { formData,setFormData,setMaxPage,setProducts,categories,brands } = useContext(ProductContext);
    const [isLoad,setIsLoad] = useState(false);
    
    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        const val = type === "number" || type === "range" ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };


    const filterProducts = async (e) => {
        e.preventDefault();

          try {
            setIsLoad(true);

            const payload = {
               ...formData     
            };

            
      
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/filter/products/`, {
              method: "POST",
              credentials: "include",   
              headers:getCSRF(),
              body: JSON.stringify(payload)
            });


    
            if (!res.ok) {
              alert(`Error ${res.status}`)
            } else {

              const data = await res.json();

              setProducts(data.results);
              setMaxPage(data.num_pages);
              setIsLoad(false);
              set_func(null);
              
            }
          } catch (err) {
            setProducts(null);
          } 
    };

    
    return (
       <div className="product_filter">
                        
            <button className="product-filter-exit" onClick={() => set_func(null)}>
                <RxCross1 />
            </button>

            {
                isLoad ?  
                    <MiniLoad />
                :


            <form onSubmit={filterProducts}>
                <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Название продукта"
                />
                <h3 className="product-filter-header">По цене:</h3>
                <div className="product-filter-digits">
                    <span>Min:</span>
                    <input
                        type="number"
                        name="minPrice"
                        value={formData.minPrice}
                        onChange={handleFormChange}
                    />
                    <span>Max:</span>
                    <input
                        type="number"
                        name="maxPrice"
                        value={formData.maxPrice}
                        onChange={handleFormChange}
                    />
                </div>
                

                
                <div className="product-filter-category-wrap">
                    {categories.map(elem => {
                        const cls = formData.category.includes(elem.id) ? "tag-div-active" : "tag-div";
                        return (
                            <button
                                type="button"
                                className={cls}
                                key={elem.id}
                                onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      category: prev.category.includes(elem.id)
                                        ? prev.category.filter(id => id !== elem.id) 
                                        : [...prev.category, elem.id] 
                                    }))
                                }}
                            >
                                {elem.title}
                            </button>
                        );
                    })}
                </div>

                <div className="product-filter-brand-wrap">
                    {brands.map(elem => {
                        const cls = formData.brand.includes(elem.id) ? "tag-div-active" : "tag-div";
                        return (
                            <button
                                type="button"
                                className={cls}
                                key={elem.id}
                                onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      brand: prev.brand.includes(elem.id)
                                        ? prev.brand.filter(id => id !== elem.id) // убрать если есть
                                        : [...prev.brand, elem.id] // добавить если нет
                                    }))
                                }}
                            >
                                {elem.title}
                            </button>
                        );
                    })}
                </div>

                <label htmlFor="product-filter-discount">
                    <span>Скидка меньше {formData.discount}%: </span>
                </label>
                <input
                    type="range"
                    id="product-filter-discount"
                    name="discount"
                    min={0}
                    max={99}
                    step={0.1}
                    value={formData.discount}
                    onChange={handleFormChange}
                />


                

                <div className="product-filter-digits">
                    <span>Кол-во продуктов:</span>
                    <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleFormChange}
                    />
                    <span>Стр:</span>
                    <input
                        type="number"
                        name="page"
                        value={formData.page}
                        onChange={handleFormChange}
                    />
                </div>

                

                <div className="product-filter-digits">
                    <span>Раньше:</span>
                    <input
                        type="date"
                        name="minDate"
                        value={formData.minDate}
                        onChange={handleFormChange}
                    />
                </div>

                <div className="product-filter-digits">
                    <span>Позже:</span>
                    <input
                        type="date"
                        name="maxDate"
                        value={formData.maxDate}
                        onChange={handleFormChange}
                    />
                </div>

                <h3 className="product-filter-header">По количеству продуктов:</h3>

                <label htmlFor="product-filter-count">
                    <span>Количество меньше: {formData.maxCount}</span>
                </label>
                <input
                    type="range"
                    id="product-filter-count"
                    name="maxCount"
                    min={1}
                    max={2500}
                    step={1}
                    value={formData.maxCount}
                    onChange={handleFormChange}
                />


                <div className="product-filter-digits">
                    <span>Min: </span>
                    <input
                        type="number"
                        name="minCount"
                        value={formData.minCount}
                        onChange={handleFormChange}
                    />
                    <span>Max: </span>
                    <input
                        type="number"
                        name="maxCount"
                        value={formData.maxCount}
                        onChange={handleFormChange}
                    />
                </div>

                <button type="submit"> <CiSearch /></button>
            </form>
            }
       </div>
    );
}

const ProductEditOne = ({idx,set_func}) => {
    const { products,setProducts,categories,brands } = useContext(ProductContext);
    

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [count, setCount] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [cover, setCover] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);




    const [desc,setDesc] = useState({});
    const [descElem,setDescElem] = useState({key: "",value: ""});

    const [images, setImages] = useState([]);

    const [ deleted,setDeleted ] = useState([]);

    const [isLoad,setIsLoad] = useState(false);


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("count", count);
        formData.append("category", category);
        formData.append("brand", brand);
        formData.append("desc", JSON.stringify(desc));
    
        // Обложка
        if (cover) {
          formData.append("cover", cover);
        }
    
        // Галерея изображений
        images.forEach((img) => {
          // если pk === -1, значит новое изображение
          formData.append(img.pk, img.file);
        });
    
        // Удалённые изображения
        deleted.forEach((pk) => {
          formData.append("deleted_gallery", pk);
        });

        setIsLoad(true);
    
        const res = await fetch(`${process.env.REACT_APP_API}/admin_api/edit/product/${idx}`, {
          method: "POST",
          credentials: "include",
          headers: getCSRF(),
          body: formData,

        });
    
        if (!res.ok) {
          const err = await res.json();
          console.error("Ошибка при сохранении:", err);
          alert("Ошибка при сохранении продукта");
        } else {
          const data = await res.json();
          setProducts((prevProducts) =>
            prevProducts.map((p) => (p.id === data.data.id ? data.data : p))
          );
          setIsLoad(false);

          set_func(null); // закрыть модалку после успешного сохранения
        }
      } catch (err) {
        console.error("Ошибка сети:", err);
        alert("Произошла ошибка при отправке данных");
      }
    };

    const handleAddDesc = (e) => {
        e.preventDefault();
        if (!descElem.key.trim()) return;
        setDesc({ ...desc, [descElem.key]: descElem.value });
        setDescElem({ key: "", value: "" }); 
    };

    const handleDeleteDesc = (key) => {
        const newDesc = { ...desc };
        delete newDesc[key];
        setDesc(newDesc);
    };

    const handleUpdateDesc = (key, value) => {
        setDesc({ ...desc, [key]: value });
    };

    const handleAddimg = (e) => {
        const files = Array.from(e.target.files); 
        const newImages = files.map((file) => ({
          pk: -1,
          file: file,
        }));
    
        setImages((prev) => [...prev, ...newImages]);
    
        e.target.value = "";
    }

    
    const handleEditImage = (e,idx,pk) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const newImages = [...images];
        newImages[idx] = {
            pk: pk,
            file: file
        };
        setImages(newImages);
    }

    const handleDeleteImage = (idx) => {
      setDeleted((prev) => {
        if (prev.includes(idx)) {
          return prev.filter((i) => i !== idx);
        } else {
          return [...prev, idx];
        }
      });
    };
    
    useEffect( () => {
        const getData = async () => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API}/api/products/${idx}/`, {
              method: "GET",
              credentials: "include", 
            });
    
            if (!res.ok) {
                console.log("Error")
            } else {
                const d = await res.json();
                setTitle(d.title || "");
                setPrice(d.price || "");
                setDiscount(d.discount || "");
                setCount(d.count || "");
                setCategory(d.category || "");
                setBrand(d.brand || "");
                setCoverPreview(d.cover || null);
                setDesc(d.desc || {});
                setImages(d.gallery || {});

                
            }
          } catch (err) {
                console.log(`error: ${err}`)            
          } 
        };

        getData();
    },[] )

    console.log(coverPreview);

    return (
        <div className="edit_modal_container">
            <div>
                <button onClick={() => set_func(null)}>
                    <RxCross1 />
                </button>
            </div>
            {  isLoad ? <MiniLoad /> :

            <form onSubmit={handleSubmit} encType="multipart/form-data">
            
                <label>
              Название:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
                </label>
              
                <label>
              Цена:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
                </label>
              
                <label>
              Скидка:
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
                </label>
              
                <label>
              Количество:
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
                </label>
              
                <label>
              Категория:
              <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">-- выбери категорию --</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.title}
        </option>
      ))}
              </select>
                </label>
              
                <label>
              Бренд:
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                <option value="">-- выбери бренд --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
                </label>
                

                <label>
                  <div>
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        style={{ width: "120px", marginBottom: "8px" }}
                      />
                    ) : 
                    <div style={{ padding: "10px", border: "1px solid #ccc" }}>Обложка</div>
                    }
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setCover(file);
                      if (file) {
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </label>

                <div className="product_modal_form_desc">
                    <div className="product_modal_form_desc_add">
                        <input
                            value={descElem.key}
                            onChange={(e) =>
                               setDescElem({
                                ...descElem,
                                key: e.target.value,
                               })
                            }
                            placeholder="Key"
                        />

                        <input
                            value={descElem.value}
                            onChange={(e) =>
                                setDescElem({
                                    ...descElem,
                                    value: e.target.value,
                                })
                            }
                            placeholder="Value"
                        />

                        <button type="button" onClick={handleAddDesc}>
                            <FaPlus />
                        </button>
                    </div>
                    
                    <div className="product_modal_form_desc_list">
                           {Object.entries(desc).map(([key, value]) => (
                            <div
                                key={key}
                                className="product_modal_form_desc_edit_elem"
                            >
                                <input
                                    value={key}
                                    onChange={(e) => {
                                        const newKey = e.target.value;
                                        if (!newKey) return; 
                                        
                                        setDesc((prev) => {
                                          const newDesc = { ...prev };
                                          newDesc[newKey] = newDesc[key];
                                          if (newKey !== key) delete newDesc[key];
                                          return newDesc;
                                        });
                                    }}
                                    style={{ width: "100px" }}
                                />

                                <input
                                    value={value}
                                    onChange={(e) =>
                                        handleUpdateDesc(key, e.target.value)
                                    }
                                    style={{ width: "150px" }}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleDeleteDesc(key)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                    </div>
                </div> 


                <div className="product_modal_gallery">
                    <div className="product_modal_gallery_list">
                        {
                            images.map( (elem,idx)  => {
                                const filePath = typeof elem.file === "string" ? elem.file : URL.createObjectURL(elem.file);
                                return (
                                    <div key={idx} className={`product_modal_gallery_elem_${ deleted.includes(elem.pk) ? "d" : "nd" }`}>

                                        <div className="product_gallery_img_control"> 
                                        <input type="file" id={`img_file_setter_${idx}`} onChange={(e) => handleEditImage(e,idx,elem.pk)}/>
    
                                        <label htmlFor={`img_file_setter_${idx}`} >
                                            <MdEdit />
                                        </label>
                                        
                                        <button onClick={() => handleDeleteImage(elem.pk)} > <MdDelete /> </button>
                                        </div>

                                        <img width={"50px"} height={"50px"} src={filePath} /> 
                                        

                                    </div>
                                )
                            } )
                        }
                    </div>

                    <div className="product_modal_gallery_add">
                        <input  type="file" multiple accept="image/*" onChange={handleAddimg} id="file-upload" />
                        <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                          <FaPlus  />
                        </label>
                    </div>
                </div>

                <button type="submit">Сохранить</button>
           </form>
           }
        </div>
    )
}

const ProductEditAll = ({idxs,set_func}) => {
    const { products,setProducts,categories,brands } = useContext(ProductContext);
    
    return (
        <div className="edit_modal_container">
            <div>
                <button onClick={() => set_func(null)}>
                    <RxCross1 />
                </button>
            </div>

            <form>

            </form>

            <h1>Выберите один товар</h1>
        </div>
    )
}

const Products = () => {
    const { info,loading } = useContext(AuthContext);
    
    const { isFilter,setIsFilter,products,setFormData,setMaxPage,maxPage,setProducts,formData } = useContext(ProductContext);

    const [ modal,setModal ] = useState(null);

    const [ selected,setSelected ] = useState([]);

    const [ isLoad,setIsLoad ] = useState(false);

   
    const setPage = async (page) => {
        setFormData(prev => ({ ...prev, page }));
        setIsLoad(true);
    
        try {
        
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/filter/products/?page=${page}&size=${formData.size}`, {
                method: "GET",
                credentials: "include",
            });
            
            const data = await res.json();
            if (res.ok) {
                setProducts(data.results);
                setMaxPage(data.num_pages);
            }
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoad(false);
        }
    };


    if(loading) return <Load />;
    if(!info) return <Not403 />;


    return (
        <div className="product_container">
            { modal && 
            <div className="product_modal">
                <div className="product_modal_container">
                {modal}
                </div>
            </div>
            }

          
            <div className="product_content">
                <div className="product_list">
                    <div className="product_list_edit_actions">
                        <button className="product_list_edit_select"
                            onClick={() => {
                                if (!products) return;
                    
                                if (selected.length === products.length) {
                                    setSelected([]);
                                } else {
                                    const allIds = products.map(product => product.id);
                                    setSelected(allIds);
                                }
                            }}
                        >
                            <RxActivityLog />
                        </button>
                    
                        <button className="product_list_edit_button" onClick={() => {
                            if(selected.length === 0){
                                
                            }
                            else if(selected.length === 1){
                                setModal( <ProductEditOne set_func={setModal} idx={selected[0] } /> );
                            }else{
                                setModal( <ProductEditAll set_func={setModal} idxs={selected} /> );
                            }
                        }}>
                            <MdEdit />
                        </button>

                        <button className="product_list_edit_delete" onClick={() => setModal( <ProductDelete set_func={setModal} indices={selected} /> )}>
                              <MdDelete />
                        </button>


                    </div>
                    
                    {isLoad ? (
                         <MiniLoad />
                     ) : !products || products.length === 0 ? (
                         <h1>No products</h1>
                     ) : (
                         products.map((elem, idx) => (
                             <div key={idx} className="product_list_elem">
                                 <input
                                     type="checkbox"
                                     checked={selected.includes(elem.id)}
                                     onChange={() => {
                                         setSelected(prev =>
                                             prev.includes(elem.id)
                                                 ? prev.filter(i => i !== elem.id)
                                                 : [...prev, elem.id]
                                         );
                                     }}
                                 />
                                 <span>{elem.title}</span>
                                 <p>{elem.price} сом</p>
                                 <p>{elem.count}</p>
                             </div>
                         ))
                    )}
                </div>

                
            </div>

            <div className="product_pagination">
                <div className="product_pagination_list">
                    {
                            Array.from( {length: maxPage}, (_,i) => {
                                const cls = formData.page == i+1 ? "pag-btn-active" : "pag-btn";
                                return <button className={cls} key={i+1} onClick={ () => setPage(i+1) }> {i+1} </button>
                            } )
                    }
                </div>
            </div>


             
            <div className="modals">
                <button  onClick={ () => setModal( <ProductAdd set_func={setModal} /> ) }>
                    <FaPlus />
                </button>
    
    
                <button  onClick={ () => setModal( <ProductFilter set_func={setModal} /> ) }>
                    <FaSearch />
                </button>
            </div>

        </div>
    );
}

export default Products;