import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('Москва');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '34673816897e5d946d5d7b3f5cf6d68b';

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Введите город');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Город не найден. Попробуйте другой.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="app-container">
      <div className="app-window">
        <div className="app-header">
          <h1>Погодное приложение</h1>
          <p>Узнайте текущую погоду в любом городе мира</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите город"
            className="search-input"
            aria-label="Введите город"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="search-button"
            aria-label="Получить погоду"
          >
            {loading ? (
              <span className="button-loader" aria-hidden="true"></span>
            ) : (
              'Узнать погоду'
            )}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {weather && (
          <div className="weather-window">
            <div className="weather-header">
              <h2>
                {weather.name}, {weather.sys?.country}
              </h2>
              <p className="weather-date">
                {formatDate()}
              </p>
            </div>

            <div className="weather-main">
              <div className="weather-icon-temp">
                {weather.weather[0]?.icon && (
                  <img 
                    src={getWeatherIcon(weather.weather[0].icon)} 
                    alt={weather.weather[0]?.description || 'Погодные условия'}
                    className="weather-icon"
                    loading="lazy"
                  />
                )}
                <span className="temperature">
                  {Math.round(weather.main?.temp)}°C
                </span>
              </div>
              
              <p className="weather-description">
                {weather.weather[0]?.description}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-card">
                <span className="detail-label">Ощущается как</span>
                <span className="detail-value">
                  {Math.round(weather.main?.feels_like)}°C
                </span>
              </div>
              
              <div className="detail-card">
                <span className="detail-label">Влажность</span>
                <span className="detail-value">
                  {weather.main?.humidity}%
                </span>
              </div>
              
              <div className="detail-card">
                <span className="detail-label">Ветер</span>
                <span className="detail-value">
                  {weather.wind?.speed} м/с
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="app-footer">
          <p>Данные предоставлены OpenWeatherMap</p>
        </div>
      </div>
    </div>
  );
}

export default App;