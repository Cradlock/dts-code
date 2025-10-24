import React, { useEffect, useState } from "react";

// Функция для расчёта новой цены со скидкой
export function calculateDiscountedPrice(product) {
  if (!product.discount || product.discount <= 1) return null;
  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
  return discountedPrice;
}


const MediaViewer = ({ src,  width = "100%", height = "auto", controls = true }) => {
  const [url, setUrl] = useState("");
  const [type, setType] = useState("unknown");

  useEffect(() => {
    if (!src) return;

    let objectUrl = "";
    let mimeType = "";
    let ext = "";

    if (src instanceof File || src instanceof Blob) {
      objectUrl = URL.createObjectURL(src);
      mimeType = src.type;
      const match = mimeType.match(/\/([a-z0-9]+)/i);
      ext = match ? match[1].toLowerCase() : "";
    } else if (typeof src === "string") {
      objectUrl = src;
      ext = src.split(".").pop().toLowerCase();
    }

    // Определяем тип
    if (mimeType.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext)) {
      setType("image");
    } else if (mimeType.startsWith("video/") || ["mp4", "webm", "ogg", "mov", "mkv"].includes(ext)) {
      setType("video");
    } else if (mimeType.startsWith("audio/") || ["mp3", "wav", "ogg"].includes(ext)) {
      setType("audio");
    } else {
      setType("unknown");
    }

    setUrl(objectUrl);

    return () => {
      if (src instanceof File || src instanceof Blob) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (!url) return <p>Нет файла</p>;

  switch (type) {
    case "image":
      return (
        <img
          src={url}
          alt="media"
          style={{ width, height, objectFit: "cover", borderRadius: "8px" }}
        />
      );

    case "video":
      return (
        <video
          src={url}
          controls={controls}
          style={{ width, height, borderRadius: "8px" }}
        />
      );

    case "audio":
      return <audio src={url} controls={controls} style={{ width }} />;

    default:
      return <p style={{ color: "gray" }}>Неизвестный тип файла</p>;
  }
};

export default MediaViewer;



export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Проверяем, начинается ли cookie с нужного имени
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


