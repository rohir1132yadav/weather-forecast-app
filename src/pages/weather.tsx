import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  wind: number;
  pressure: number;
  icon: string;
}

export default function WeatherPage() {
  const router = useRouter();
  const { lat, lon, name } = router.query;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lat && lon) {
      fetchWeather(lat as string, lon as string);
    }
  }, [lat, lon]);

  const fetchWeather = async (lat: string, lon: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = response.data;
      setWeather({
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        pressure: data.main.pressure,
        icon: data.weather[0].icon,
      });
    } catch (e) {
      setError('Failed to fetch weather.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather for {name}</h1>
      {error && <p className="text-red-500">{error}</p>}
      {weather && (
        <div className="flex items-center gap-4">
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="weather icon" />
          <div>
            <p>Temperature: {weather.temperature}°C</p>
            <p>Description: {weather.description}</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind Speed: {weather.wind} m/s</p>
            <p>Pressure: {weather.pressure} hPa</p>
          </div>
        </div>
      )}
    </div>
  );
}
