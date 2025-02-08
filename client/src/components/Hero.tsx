import React from 'react';

export default function Hero() {
  return (
    <div className="relative h-[300px] bg-gray-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80"
          alt="Restaurant background"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
      <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">FoodHub</h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Une expérience culinaire unique au cœur de la ville
        </p>
      </div>
    </div>
  );
}