

import React from "react";
import { FaArrowRight } from "react-icons/fa";

const CircleLink = ({ url }) => {
  if (!url) return <div></div>; 

  const circleStyle = {
    position: "fixed",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#007bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 1000,
    transition: "background-color 0.2s",
  };

  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <div
      style={circleStyle}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
    >
      <FaArrowRight size={24} />
    </div>
  );
};

export default CircleLink;
