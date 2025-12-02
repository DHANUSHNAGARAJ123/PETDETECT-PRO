export enum AnimalSpecies {
  DOG = 'Dog',
  CAT = 'Cat',
  OTHER = 'Other'
}

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedAnimal {
  id: number;
  species: AnimalSpecies;
  breed: string;
  confidence: string; // High, Medium, Low description from AI
  description: string;
  box_2d: number[]; // [ymin, xmin, ymax, xmax] 0-1000 scale
}

export interface AnalysisResult {
  animals: DetectedAnimal[];
  summary: {
    dogCount: number;
    catCount: number;
    otherCount: number;
    total: number;
  };
}
