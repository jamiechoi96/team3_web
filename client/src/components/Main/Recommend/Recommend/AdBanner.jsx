import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './AdBanner.css';

const AdvertisementBanner = () => {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 2, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, 
    pauseOnHover: true,
    centerMode: false,
    arrows: false
  };

  const bannerImages = [
    {
      src: '/banner_img/apple.webp',
      link: 'https://www.seasonmarket.kr/eventExhibition/1808'
    },
    {
      src: '/banner_img/garlic.webp',
      link: 'https://www.seasonmarket.kr/eventExhibition/1806'
    },
    {
      src: '/banner_img/rice.webp',
      link: 'https://www.seasonmarket.kr/eventExhibition/1827'
    }
   
  ];

  return (
    <div className="advertisement_banner_container">
      <Slider {...settings} className="advertisement_banner_slider">
        {bannerImages.map((banner, index) => (
          <div key={index} className="advertisement_banner_slide">
            <a href={banner.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
              <img 
                src={banner.src}
                alt={`Advertisement ${index + 1}`}
                className="advertisement_banner_image"
              />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AdvertisementBanner;
