import React from 'react';

const Hero = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="home-hero mx-4 lg:mx-auto max-w-7xl mt-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {children}
      </div>
    </div>
  );
};

export default Hero;