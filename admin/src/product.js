import React, { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [ products,setProducts ] = useState([]);
    const [ categories,setCategories ] = useState([]);
    const [ brands,setBrands ] = useState([]);
    const [ maxPage,setMaxPage ] = useState(1);
    const [ isFilter,setIsFilter ] = useState(false);

    const [ formData,setFormData ] = useState({
        title: "",
        minPrice: 0,
        maxPrice: 1000000,
        size: 5,
        discount: 99.0,
        minCount: 1,
        maxCount: 5000,
        minDate: null,
        maxDate: null,
        page: 1,
        category: [],
        brand: []
    });

    useEffect(() => {
        const getProducts = async () => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/filter/products/?page=${formData.page}&size=${formData.size}`, {
              method: "GET",
              credentials: "include",   
            });
    
            if (!res.ok) {
              setProducts(null);
            } else {
              
              const data = await res.json();
              setProducts(data.results);
              setMaxPage(data.num_pages);
              
            }
          } catch (err) {
            setProducts(null);
          } 
        };

        const getCategories = async () => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/category/`, {
              method: "GET",
              credentials: "include", 
            });
    
            if (!res.ok) {
              setCategories(null);
            } else {
              const data = await res.json();
              setCategories(data); 
            }
          } catch (err) {
            setCategories(null);
          } 
        };

        const getBrands = async () => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API}/admin_api/brands/`, {
              method: "GET",
              credentials: "include",
            });
    
            if (!res.ok) {
              setBrands(null);
            } else {
              const data = await res.json();
              setBrands(data); 
            }
          } catch (err) {
            setBrands(null);
          } 
        };

        getProducts();
        getBrands();
        getCategories();

    
        
    }, []);

    return (
       <ProductContext.Provider value={{isFilter,setIsFilter,setFormData,formData,setMaxPage,maxPage,products,setProducts,categories,setCategories,brands,setBrands}}>
            {children}
       </ProductContext.Provider>
    );
}
