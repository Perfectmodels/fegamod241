import React from 'react';
import { MOCK_GALLERY_IMAGES } from '../gallery-constants';
import SectionTitle from '../components/SectionTitle';

const GalleryPage: React.FC = () => {
  return (
    <div className="bg-off-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Instants de Mode">Notre Galerie</SectionTitle>
        <p className="text-center max-w-3xl mx-auto text-gray-700 text-lg mb-12">
            Revivez les moments forts de nos défilés, shootings et coulisses. Une immersion visuelle dans l'univers vibrant de la mode gabonaise.
        </p>

        <div className="columns-2 md:columns-3 gap-4">
          {MOCK_GALLERY_IMAGES.map((src, index) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <img 
                src={src} 
                alt={`Galerie FEGAMOD ${index + 1}`} 
                className="w-full h-auto object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
