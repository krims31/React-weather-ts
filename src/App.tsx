import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  weather: Array<{ description: string; icon: string }>;
  dt: number;
}


interface UnitSwitcherProps {
  unit: 'metric' | 'imperial';
  onUnitChange: (unit: 'metric' | 'imperial') => void;
}

const UnitSwitcher = ({ unit, onUnitChange }: UnitSwitcherProps) => {
  return (
    <div className="unit-switcher">
      <button
        className={unit === 'metric' ? 'active' : ''}
        onClick={() => onUnitChange('metric')}
      >
        °C
      </button>
      <button
        className={unit === 'imperial' ? 'active' : ''}
        onClick={() => onUnitChange('imperial')}
      >
        °F
      </button>
    </div>
  );
};

function App() {
  const [city, setCity] = useState('Москва');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const API_KEY = '34673816897e5d946d5d7b3f5cf6d68b';

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Введите город');
      return;
    }
    
    setLoading(true);
    setError('');
    setShouldAnimate(false); 
    
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
      );
      setWeather(response.data);
      setTimeout(() => setShouldAnimate(true), 50);
    } catch (err) {
      setError('Город не найден');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [unit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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
            className={`search-button ${loading ? 'loading' : ''}`}
            aria-label="Получить погоду"
          >
            {loading ? (
              <>
                <span className="button-loader"></span>
                <span className="loading-text">Загрузка...</span>
              </>
            ) : (
              'Узнать погоду'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message animate-fade-in">
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="weather-skeleton">
            <div className="skeleton-header shimmer"></div>
            <div className="skeleton-main shimmer"></div>
            <div className="skeleton-details shimmer"></div>
          </div>
        )}

        {weather && (
          <div className={`weather-window ${shouldAnimate ? 'animate-fade-in' : ''}`}>
            <div className="weather-header">
              <h2>
                {weather.name}, {weather.sys?.country}
              </h2>
              <p className="weather-date">
                {new Date(weather.dt * 1000).toLocaleDateString('ru-RU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>

            <div className="weather-main">
              <div className="weather-icon-temp">
                {weather.weather[0]?.icon && (
                  <img 
                    src={getWeatherIcon(weather.weather[0].icon)} 
                    alt={weather.weather[0]?.description || 'Погодные условия'}
                    className="weather-icon animate-float"
                    loading="lazy"
                  />
                )}
                <span className="temperature animate-pop-in">
                  {Math.round(weather.main?.temp)}°C
                </span>
              </div>
              
              <p className="weather-description animate-fade-in-delay">
                {weather.weather[0]?.description}
              </p>
            </div>

            <div className="weather-details">
              <div className="detail-card animate-slide-in-left">
                <span className="detail-label">Ощущается как</span>
                <span className="detail-value">
                  {Math.round(weather.main?.feels_like)}°C
                </span>
              </div>
              
              <div className="detail-card animate-slide-in-up">
                <span className="detail-label">Влажность</span>
                <span className="detail-value">
                  {weather.main?.humidity}%
                </span>
              </div>
              
              <div className="detail-card animate-slide-in-right">
                <span className="detail-label">Ветер</span>
                <span className="detail-value">
                  {weather.wind?.speed} м/с
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="app-footer animate-fade-in">
          <p>Данные предоставлены OpenWeatherMap</p>
        </div>
      </div>
    </div>
  );
}

export default App;