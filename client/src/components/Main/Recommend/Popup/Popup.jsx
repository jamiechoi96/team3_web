import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Popup.css";

function Popup({ movie, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const popupContent = (
    <div className="popup_overlay">
      <div className="popup_content">
        <button className="popup_close" onClick={onClose}>×</button>
        <div className="popup_image_container">
          <div className="popup_image" style={{ backgroundImage: `url(${movie.hover})` }}></div>
          <div className="popup_controls">
            <button className="popup_play">▶ 재생</button>
          </div>
        </div>
        <div className="popup_info">
          <h2 className="popup_title">{movie.title}</h2>
          <p className="popup_overview">{movie.overview || "설명이 없습니다."}</p>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
}

export default Popup;
