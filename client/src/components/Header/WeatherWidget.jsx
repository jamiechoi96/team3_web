import { useState, useEffect } from "react";
import "./WeatherWidget.css";

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=${
            import.meta.env.VITE_OpenWeather_Key
          }&units=metric`
        );
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError("날씨 정보를 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading)
    return <div className="weather-widget loading">날씨 정보 로딩중...</div>;
  if (error) return <div className="weather-widget error">{error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-widget">
      <div className="weather-info">
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={weather.weather[0].description}
          className="weather-icon"
        />
        <span className="temperature">{Math.round(weather.main.temp)}°C</span>
      </div>
      <span className="location">서울</span>
    </div>
  );
}

export default WeatherWidget;
