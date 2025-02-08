import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative pt-16 bg-yellow-400">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-red-600 sm:text-5xl md:text-6xl">
            WonderFood
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-900 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Commandez à l'avance et récupérez quand vous voulez
          </p>
          <div className="mt-5 max-w-md mx-auto flex justify-center">
            <div className="rounded-md shadow">
              <a
                href="#menu"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
              >
                Commander
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};

export default Hero;