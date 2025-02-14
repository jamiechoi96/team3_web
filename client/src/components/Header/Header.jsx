import React, { useEffect, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Header.css";
import WeatherWidget from "./WeatherWidget.jsx";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuPaths = {
    영화: "/movies",
    예능: "/entertainment",
    드라마: "/dramas",
    "키즈/애니": "/kids",
  };

  const handleMenuClick = (menu) => {
    const path = menuPaths[menu];
    if (path) {
      navigate(path);
    }
  };

  const isActiveMenu = (menu) => {
    const path = menuPaths[menu];
    return location.pathname === path;
  };

  return (
    <header
      className={`header ${isHome ? "header-home" : ""} ${
        isScrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="logo" onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate("/");
      }}>
        <img src="/images/VODiscovery_w.png" alt="VODiscovery Logo" className="logo-image" />
      </div>
      <nav className="Nav">
        <ul>
          {["영화", "예능", "드라마", "키즈/애니"].map((menu) => (
            <li
              key={menu}
              className={isActiveMenu(menu) ? "active" : ""}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </nav>
      <div className="icons">
        {location.pathname !== "/search" && (
          <FiSearch 
            className="icon" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              navigate("/search");
            }} 
          />
        )}
        <FiUser
          className={`icon ${location.pathname === "/mypage" ? "active" : ""}`}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate("/mypage");
          }}
        />
        <WeatherWidget />
      </div>
    </header>
  );
};

export default Header;
