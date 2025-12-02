import React, { useState, useRef, useEffect } from 'react';
import { DetectedAnimal, AnimalSpecies } from '../types';

interface AnalysisOverlayProps {
  imageSrc: string;
  animals: DetectedAnimal[];
}

const AnalysisOverlay: React.FC<AnalysisOverlayProps> = ({ imageSrc, animals }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Define colors based on species
  const getSpeciesColor = (species: AnimalSpecies) => {
    switch (species) {
      case AnimalSpecies.DOG: return 'border-amber-500 bg-amber-500';
      case AnimalSpecies.CAT: return 'border-emerald-500 bg-emerald-500';
      default: return 'border-purple-500 bg-purple-500';
    }
  };

  const getSpeciesBorder = (species: AnimalSpecies) => {
     switch (species) {
      case AnimalSpecies.DOG: return 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      case AnimalSpecies.CAT: return 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
      default: return 'border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]';
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-xl bg-gray-900 group">
      {/* Image container */}
      <img 
        src={imageSrc} 
        alt="Analyzed content" 
        className={`w-full h-auto block transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />

      {/* Overlay Layer */}
      {loaded && animals.map((animal) => {
        // Convert 0-1000 scale to percentages
        const [ymin, xmin, ymax, xmax] = animal.box_2d;
        
        const top = ymin / 10;
        const left = xmin / 10;
        const height = (ymax - ymin) / 10;
        const width = (xmax - xmin) / 10;

        // Skip invalid boxes
        if (width <= 0 || height <= 0) return null;

        return (
          <div
            key={animal.id}
            className={`absolute border-2 ${getSpeciesBorder(animal.species)} transition-all duration-300 hover:opacity-100`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            {/* Number Badge */}
            <div 
              className={`
                absolute -top-3 -left-3 w-7 h-7 flex items-center justify-center 
                rounded-full text-white font-bold text-sm shadow-md
                ${getSpeciesColor(animal.species)}
              `}
            >
              {animal.id}
            </div>
            
            {/* Tooltip on hover (desktop) */}
            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap pointer-events-none transition-opacity duration-200">
               {animal.breed}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalysisOverlay;
