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
  const { lat, lon, name } = router.query; // Extract lat, lon, and name from the query params
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure lat and lon are valid and of type string before proceeding
    if (!lat || !lon || typeof lat !== "string" || typeof lon !== "string") {
      return;
    }

    const fetchWeather = async () => {
      try {
        // Fetch weather data from OpenWeatherMap API
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: "8dea25d74f20fed0ec84088a8df7624a", // Replace with your OpenWeatherMap API key
              units: "metric", // Using metric units (Celsius)
            },
          }
        );
        setWeather(response.data); // Store the fetched weather data in state
      } catch (err: any) {
        setError("Failed to fetch weather data. Please try again later."); // Handle API errors
        console.error("Weather API error:", err); // Log the error to the console for debugging
      }
    };

    fetchWeather(); // Call the fetchWeather function to get the data
  }, [lat, lon]); // Re-run the effect whenever lat or lon changes

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>; // Display error message
  }

  if (!weather) {
    return <div className="text-center mt-4">Loading weather data...</div>; // Display loading message if weather data is not available
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-xl rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Weather in {weather.name || name} {/* Display the city name */}
      </h1>
      <div className="flex items-center justify-center mb-4">
        <Image
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} // Weather icon
          alt="Weather Icon"
          width={100}
          height={100}
        />
        <p className="text-xl capitalize">{weather.weather[0].description}</p> {/* Weather description */}
      </div>
      <div className="grid grid-cols-2 gap-4 text-center text-gray-700">
        <div>
          <p className="text-lg font-semibold">Temperature</p>
          <p>{weather.main.temp}°C</p> {/* Current temperature */}
        </div>
        <div>
          <p className="text-lg font-semibold">High / Low</p>
          <p>{weather.main.temp_max}°C / {weather.main.temp_min}°C</p> {/* Max and Min temperatures */}
        </div>
        <div>
          <p className="text-lg font-semibold">Humidity</p>
          <p>{weather.main.humidity}%</p> {/* Humidity percentage */}
        </div>
        <div>
          <p className="text-lg font-semibold">Wind Speed</p>
          <p>{weather.wind.speed} m/s</p> {/* Wind speed */}
        </div>
        <div className="col-span-2">
          <p className="text-lg font-semibold">Pressure</p>
          <p>{weather.main.pressure} hPa</p> {/* Air pressure */}
        </div>
      </div>
    </div>
  );
}
