
import React from 'react';
import { Utensils } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-culinary-peach/30 border-b py-4 sticky top-0 z-10 backdrop-blur-sm">
      <div className="container">
        <div className="flex items-center justify-center">
          <Utensils className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-semibold">Culinary Photo Genius</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
