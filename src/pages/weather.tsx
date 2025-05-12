"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios from "axios";

interface WeatherData {
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
  };
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const router = useRouter();
  const { lat, lon, name } = router.query;

  useEffect(() => {
    if (lat && lon) {
      const fetchWeather = async () => {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat,
                lon,
                appid: "YOUR_OPENWEATHER_API_KEY",
                units: "metric", // or "imperial" for Fahrenheit
              },
            }
          );
          setWeather(response.data);
        } catch (error) {
          console.error("Error fetching weather data", error);
        }
      };
      fetchWeather();
    }
  }, [lat, lon]);

  if (!weather) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Weather in {name}</h1>
      <div className="mt-4">
        <div className="flex">
          <Image
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            width={50}
            height={50}
          />
          <p className="ml-2">{weather.weather[0].description}</p>
        </div>
        <div className="mt-2">
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  );
}
