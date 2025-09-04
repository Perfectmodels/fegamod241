
import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children, subtitle }) => {
  return (
    <div className="text-center mb-12">
      {subtitle && <p className="text-emerald font-semibold text-lg mb-2">{subtitle}</p>}
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-deep-black">{children}</h2>
      <div className="mt-4 h-1 w-24 bg-gradient-to-r from-metallic-gold to-golden-yellow mx-auto rounded-full"></div>
    </div>
  );
};

export default SectionTitle;
