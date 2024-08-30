import React, { useState } from 'react';
import axios from 'axios';
import './weather.css'; 
import nuvolaImg from './img/nuvola.png';
const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [showLogo, setShowLogo] = useState(true);
  const [forecastData, setForecastData] = useState(null);
  const [showForecast, setShowForecast] = useState(false);

  const apiKey = '8e87ca0360a02b21ffbb65590c0ba35b';

  const weatherTranslations = {
    "clear sky": "cielo sereno",
    "few clouds": "poche nuvole",
    "scattered clouds": "nuvole sparse",
    "broken clouds": "nuvole sparse",
    "shower rain": "pioggia leggera",
    "rain": "pioggia",
    "thunderstorm": "temporale",
    "snow": "neve",
    "mist": "nebbia",
    "moderate rain": "pioggia moderata",
    "light rain": "pioggia leggera",
    "heavy intensity rain": "pioggia forte",
    "light snow": "neve leggera",
    "heavy snow": "neve pesante",
    "fog": "nebbia",
    "drizzle": "pioggerella",
    "overcast clouds": "cielo completamente coperto",
  };

  const translateCondition = (condition) => {
    return weatherTranslations[condition] || condition;
  };

  const getBackgroundImage = (condition) => {
    switch (condition) {
      case "clear sky":
        return `url('https://i.gifer.com/CRC.gif')`;
      case "few clouds":
      case "scattered clouds":
      case "broken clouds":
        return `url('https://i.gifer.com/srG.gif')`;
      case "overcast clouds":
        return `url('https://i.gifer.com/1F1V.gif')`;
      case "rain":
      case "light rain":
      case "shower rain":
        return `url('https://i.gifer.com/JTCO.gif')`;
      case "moderate rain":
      case "heavy intensity rain":
        return `url('https://i.gifer.com/FRRX.gif')`;
      case "thunderstorm":
        return `url('https://i.gifer.com/Rnim.gif')`;
      case "snow":
      case "light snow":
      case "heavy snow":
        return `url('https://i.gifer.com/VYsc.gif')`;
      case "fog":
      case "mist":
        return `url('https://i.gifer.com/IJNs.gif')`;
      default:
        return `url('https://i.gifer.com/WGWo.gif')`;
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
      setError('');
      setShowLogo(false);
      fetchForecast();
    } catch (err) {
      setError('Errore: non è stato possibile recuperare i dati meteo.');
      setWeatherData(null);
      setShowForecast(false); // Nascondi le previsioni in caso di errore
      setShowLogo(true);
      setForecastData(null); //azzera i dati delle previsioni in caso di errore
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      setForecastData(aggregateForecastData(response.data));
    } catch (err) {
      setError('Errore: non è stato possibile recuperare le previsioni meteo.');
      setForecastData(null);
    }
  };

  const aggregateForecastData = (data) => {
    const forecasts = {};
    const now = new Date().toLocaleDateString();

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (date !== now && !forecasts[date]) {
        forecasts[date] = item;
      }
    });

    return Object.values(forecasts);
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const formatTemperature = (temp) => Math.round(temp);

  return (
    <div className="weather-container">
      <h1>Meteo Cloud</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Inserisci una città..."
        />
        <button type="submit">Cerca</button>
      </form>

      {error && <p className="error">{error}</p>}
      
      {showLogo && (
        <img
          className="App-logo"
          src={nuvolaImg}
          alt="logo"
          width={100}
        />
      )}

      {weatherData && (
        <div 
          className="weather-info"
          style={{ backgroundImage: getBackgroundImage(weatherData.weather[0].description) }}
        >
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <hr />
          <h4 className='fw-normal'>{translateCondition(weatherData.weather[0].description)}</h4>
          <p>Temperatura: {formatTemperature(weatherData.main.temp)}°C</p>
          <p>Percepito: {formatTemperature(weatherData.main.feels_like)}°C</p>
          <p>
            <span>Minima: {formatTemperature(weatherData.main.temp_min)}°C</span>
            <span> - Massima: {formatTemperature(weatherData.main.temp_max)}°C</span>
          </p>
          <p>Pressione: {weatherData.main.pressure} hPa</p>
          <p>Umidità: {weatherData.main.humidity}%</p>
          <p>Vento: {weatherData.wind.speed} m/s</p>
          <p>Pioggia: {weatherData.rain ? weatherData.rain['1h'] + ' mm' : 'Nessuna'}</p>
          
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            width={100}
          />
          
          <div className="forecast-miniatures">
            {forecastData && forecastData.map((forecast, index) => (
              <div key={index} className="forecast-miniature">
                <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>{formatTemperature(forecast.main.temp)}°C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                  alt={forecast.weather[0].description}
                  width={50}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {forecastData && (
        <div className="forecast-info mt-3">
          <h4 className='fw-normal'>
            Previsioni a 5 Giorni in dettaglio
          </h4>
          <button onClick={() => setShowForecast(!showForecast)} className="mb-2">
            {showForecast ? 'Nascondi' : 'Mostra'} Tutto
          </button>
          {showForecast && forecastData.map((forecast, index) => (
            <div key={index} className="forecast-item">
              <p>{new Date(forecast.dt * 1000).toLocaleDateString()}</p>
              <p>Temperatura: {formatTemperature(forecast.main.temp)}°C</p>
              <p>Condizioni: {translateCondition(forecast.weather[0].description)}</p>
              <img
                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                alt={forecast.weather[0].description}
                width={50}
              />
              <hr className='separatori'/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather;
