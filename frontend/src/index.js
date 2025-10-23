import React from "react";
import ReactDOM from "react-dom/client";
import "./css/style.css";
import App from "./App";
import {InfoProvider} from "./providers/info.js";
import {CategoryProvider} from "./providers/category.js";
import { BrandProvider } from "./providers/brand.js";
import {AuthProvider} from "./providers/auth.js"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<InfoProvider>
    <CategoryProvider>
        <BrandProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrandProvider>
    </CategoryProvider>
</InfoProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
