"use client";
import CityTable from '../components/CityTable';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Weather Forecast App</h1>
      <CityTable />
    </main>
  );
}

