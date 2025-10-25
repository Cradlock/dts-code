import React, { useEffect, useState } from "react";

const MediaViewer = ({ src, id, width = "100%", height = "auto", controls = true }) => {
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

  if (!url) return <p>Файл жок</p>; // "Нет файла" -> "Файл жок"

  switch (type) {
    case "image":
      return (
        <img
          id={id}
          src={url}
          alt="медиа" // "media" -> "медиа"
          style={{ width, height, objectFit: "cover", borderRadius: "8px" }}
        />
      );

    case "video":
      return (
        <video
          id={id}
          src={url}
          controls={controls}
          style={{ width, height, borderRadius: "8px" }}
        />
      );

    case "audio":
      return <audio id={id} src={url} controls={controls} style={{ width }} />;

    default:
      return <p style={{ color: "gray" }}>Белгисиз файл түрү</p>; // "Неизвестный тип файла" -> "Белгисиз файл түрү"
  }
};

export default MediaViewer;
