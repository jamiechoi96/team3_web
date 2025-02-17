import React, { useState, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 위치에 따라 버튼 표시 여부 결정
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <div 
          className="scroll-to-top"
          onClick={scrollToTop}
          aria-label="맨 위로 스크롤"
        >
          <IoIosArrowUp size={24} />
        </div>
      )}
    </>
  );
};

export default ScrollToTop;
