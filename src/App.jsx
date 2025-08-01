import React, { useState } from 'react'
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa'
import HourlyForecast from './components/HourlyForecast'
import axios from 'axios';

const App = () => {

  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState("");

  const apiKey = '88656d76dc8d4080ad472705250706';
  const apiUrl = 'https://api.weatherapi.com/v1//forecast.json';

  const fetchData = async (query) => {
    try {
      const response = await axios.get(`${apiUrl}?key=${apiKey}&q=${query}&days=1`);
      console.log("API Location Name:", response.data.location.name);
      console.log(response.data.forecast.forecastday[0].hour);
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      console.log("City was not found", error);
      setError("City was not found.");
      setWeatherData(null);
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Geolocation coords:", latitude, longitude);
        const query = `${latitude},${longitude}`;
        fetchData(query);
      }, (error) => {
        setError(error.message);
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchData(city);
    }
  }

  return (
    <div className='bg-green-100 min-h-screen flex items-center justify-center'>
      <div className='bg-white shadow-lg mt-10 p-4 rounded w-full max-w-sm'>
        <div className='flex'>
          <div className='flex items-center border border-gray-300 rounded px-2 py-2 w-full'>
            <FaSearch className='h-5 w-5' />
            <input type="text"
              placeholder='Enter City Name'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyUp={handleKeyPress}
              className='pl-2 border-none focus:outline-none w-full' />
          </div>
          <button onClick={getCurrentLocation}
            className='bg-green-500 text-white rounded px-3 py-2 ml-2 flex items-center justify-center hover:bg-green-600 transition-colors duration-300'>
            <FaMapMarkerAlt className='w-5 h-5' />
          </button>
        </div>
        {error && <p className='text-red-500 text-center text-sm mt-2'>{error}</p>}
        {weatherData && (
          <div className='mt-4 text-center'>
            <h2 className='text-xl font-semibold'>{weatherData.location.name}</h2>
            <img
              src={weatherData.current.condition.icon} alt=""
              className='mx-auto h-40' />
            <p className='text-lg font-semibold'>{weatherData.current.temp_c}°C</p>
            <p className='text-sm capitalize font-semibold'>{weatherData.current.condition.text}</p>
            <HourlyForecast hourlyData={weatherData.forecast.forecastday[0].hour} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App