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

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header
      className={`header ${isHome ? "header-home" : ""} ${
        isScrolled ? "header-scrolled" : ""
      }`}
    >
      <div className="logo" onClick={handleLogoClick}>
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
          <FiSearch className="icon" onClick={() => navigate("/search")} />
        )}
        <Link to="/mypage">
          <FiUser
            className={`icon ${
              location.pathname === "/mypage" ? "active" : ""
            }`}
          />
        </Link>
        <WeatherWidget />
      </div>
    </header>
  );
};

export default Header;
