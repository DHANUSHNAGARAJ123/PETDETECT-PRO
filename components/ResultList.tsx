import React from 'react';
import { DetectedAnimal, AnimalSpecies, AnalysisResult } from '../types';
import { Dog, Cat, HelpCircle, Info } from 'lucide-react';

interface ResultListProps {
  result: AnalysisResult;
}

const ResultList: React.FC<ResultListProps> = ({ result }) => {
  const getIcon = (species: AnimalSpecies) => {
    switch (species) {
      case AnimalSpecies.DOG: return <Dog className="w-5 h-5 text-amber-600" />;
      case AnimalSpecies.CAT: return <Cat className="w-5 h-5 text-emerald-600" />;
      default: return <HelpCircle className="w-5 h-5 text-purple-600" />;
    }
  };

  const getBadgeColor = (species: AnimalSpecies) => {
    switch (species) {
      case AnimalSpecies.DOG: return 'bg-amber-100 text-amber-800 border-amber-200';
      case AnimalSpecies.CAT: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
          <span className="block text-2xl font-bold text-amber-700">{result.summary.dogCount}</span>
          <span className="text-xs uppercase tracking-wide font-semibold text-amber-600">Dogs</span>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
          <span className="block text-2xl font-bold text-emerald-700">{result.summary.catCount}</span>
          <span className="text-xs uppercase tracking-wide font-semibold text-emerald-600">Cats</span>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
          <span className="block text-2xl font-bold text-purple-700">{result.summary.otherCount}</span>
          <span className="text-xs uppercase tracking-wide font-semibold text-purple-600">Others</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-gray-500" />
        Identified Breeds (Left to Right)
      </h3>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[500px]">
        {result.animals.length === 0 ? (
          <div className="text-center p-8 text-gray-500 italic bg-gray-50 rounded-lg">
            No animals detected in this image.
          </div>
        ) : (
          result.animals.map((animal) => (
            <div 
              key={animal.id} 
              className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
            >
              {/* ID Badge */}
              <div 
                className={`
                  flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg
                  ${animal.species === AnimalSpecies.DOG ? 'bg-amber-500 text-white' : ''}
                  ${animal.species === AnimalSpecies.CAT ? 'bg-emerald-500 text-white' : ''}
                  ${animal.species === AnimalSpecies.OTHER ? 'bg-purple-500 text-white' : ''}
                `}
              >
                {animal.id}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getBadgeColor(animal.species)}`}>
                    {getIcon(animal.species)}
                    {animal.species}
                  </span>
                  <h4 className="font-bold text-gray-900 truncate">{animal.breed}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {animal.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultList;
