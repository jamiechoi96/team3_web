import React, { useState } from "react";
import Popup from "./Popup/Popup";
import "./ImageCard.css";

function ImageCard({ rank, image, title, hover, overview }) {
  const [hovered, setHovered] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    const timer = setTimeout(() => setHovered(true), 1000); // 1초 후에 호버 상태로 전환
    setHoverTimer(timer);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer); // 타이머 제거
    setHovered(false); // 호버 상태 해제
  };

  const handleInfoClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      className={`movie ${hovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rank">{rank}</div>
      <img src={image} alt={title} className="movie-poster" />
      <div className="movie-hover">
        <img src={hover} alt={title} className="hover-poster" />
        <h3>{title}</h3>
        <div className="movie-buttons">
          <button className="play-btn">▶ 재생</button>
          <button className="info-btn" onClick={handleInfoClick}>ℹ️ 정보</button>
          {/* {showPopup && <Popup movie={{ title, image, overview }} onClose={closePopup} />} */}
        </div>
      </div>
    </div>
  );
}

export default ImageCard;
