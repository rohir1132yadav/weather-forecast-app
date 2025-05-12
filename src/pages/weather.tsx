"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

interface WeatherData {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  name: string;
}

export default function WeatherPage() {
  const router = useRouter();
  const lat = router.query.lat as string | undefined;
  const lon = router.query.lon as string | undefined;
  const name = router.query.name as string | undefined;
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
              units: "metric",
            },
          }
        );
        setWeather(response.data);
      } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    setError("Failed to fetch weather data. Please try again later.");
    console.error("Axios error:", err.response?.data || err.message);
  } else {
    setError("An unexpected error occurred.");
    console.error("Unexpected error:", err);
  }
}

    };

    fetchWeather();
  }, [lat, lon]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!weather) {
    return <div className="text-center mt-4">Loading weather data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Weather in {weather.name || name}
      </h1>
      <div className="flex items-center justify-center mb-4">
        <Image
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather Icon"
          width={100}
          height={100}
        />
        <p className="text-xl capitalize">{weather.weather[0].description}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-center text-gray-700">
        <div>
          <p className="text-lg font-semibold">Temperature</p>
          <p>{weather.main.temp}°C</p>
        </div>
        <div>
          <p className="text-lg font-semibold">High / Low</p>
          <p>{weather.main.temp_max}°C / {weather.main.temp_min}°C</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Humidity</p>
          <p>{weather.main.humidity}%</p>
        </div>
        <div>
          <p className="text-lg font-semibold">Wind Speed</p>
          <p>{weather.wind.speed} m/s</p>
        </div>
        <div className="col-span-2">
          <p className="text-lg font-semibold">Pressure</p>
          <p>{weather.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
}
