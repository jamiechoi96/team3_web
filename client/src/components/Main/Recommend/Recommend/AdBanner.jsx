import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AdBanner.css';

const AdvertisementBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    pauseOnHover: false
  };

  const bannerImages = [
    '/banner_img/apple.webp',
    '/banner_img/garlic.webp',
    '/banner_img/rice.webp',
    '/banner_img/seasonmarket_og.jpg'
  ];

  return (
    <div className="advertisement_banner_container">
      <Slider {...settings} className="advertisement_banner_slider">
        {bannerImages.map((image, index) => (
          <div key={index} className="advertisement_banner_slide">
            <img 
              src={image}
              alt={`Advertisement ${index + 1}`}
              className="advertisement_banner_image"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdvertisementBanner;
