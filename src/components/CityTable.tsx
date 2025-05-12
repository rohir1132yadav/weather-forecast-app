"use client";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface City {
  name: string;
  country: string;
  timezone: string;
  geoname_id: string;
  coordinates: { lat: number; lon: number };
}

export default function CityTable() {
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(0);
  const loader = useRef<HTMLDivElement>(null);

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setCities([]); // clear for new query
      setPage(0); // reset to first page
      setDebouncedQuery(query);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch cities on page or debouncedQuery change
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/`,
          {
            params: {
              dataset: 'geonames-all-cities-with-a-population-1000',
              q: debouncedQuery,
              rows: 50,
              start: page * 50,
            },
          }
        );

        const newCities: City[] = response.data.records.map((r: any) => ({
          name: r.fields.name,
          country: r.fields.cou_name_en,
          timezone: r.fields.timezone,
          geoname_id: r.fields.geoname_id,
          coordinates: {
            lat: r.fields.coordinates[0],
            lon: r.fields.coordinates[1],
          },
        }));

        setCities((prev) => (page === 0 ? newCities : [...prev, ...newCities]));
      } catch (error) {
        console.error("Error fetching cities", error);
      }
    };

    fetchCities();
  }, [page, debouncedQuery]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = loader.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="overflow-x-auto px-4">
      <input
        type="text"
        placeholder="Search city..."
        className="mb-4 mt-2 w-full max-w-md border p-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">City</th>
            <th className="p-2">Country</th>
            <th className="p-2">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.geoname_id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <Link
                  href={{
                    pathname: '/weather',
                    query: {
                      lat: city.coordinates.lat,
                      lon: city.coordinates.lon,
                      name: city.name,
                    },
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {city.name}
                </Link>
              </td>
              <td className="p-2">{city.country}</td>
              <td className="p-2">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div ref={loader} className="h-10" />
    </div>
  );
}
