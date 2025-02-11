import React, { useState } from "react";
import Popup from "../Popup/Popup";
import "./ImageCard.css";

function ImageCard({ rank, image, title, hover, overview }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleInfoClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="movie">
      <div className="movie-content">
        <div className="rank" data-rank={rank}>{rank}</div>
        <img src={image} alt={title} className="movie-poster" />
        <div className="movie-hover">
          <div className="movie-buttons">
            <button className="play-btn">▶ 재생</button>
            <button className="info-btn" onClick={handleInfoClick}>ℹ️ 정보</button>
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup
          movie={{
            title,
            hover,
            overview,
            image
          }}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default ImageCard;
