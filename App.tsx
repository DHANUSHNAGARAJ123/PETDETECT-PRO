import React, { useState } from 'react';
import { PawPrint, RotateCcw } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisOverlay from './components/AnalysisOverlay';
import ResultList from './components/ResultList';
import { analyzeImage } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelected = async (base64: string) => {
    setCurrentImage(base64);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      const result = await analyzeImage(base64);
      setAnalysisResult(result);
    } catch (err: any) {
      setError("Failed to analyze image. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetApp = () => {
    setCurrentImage(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
              <PawPrint size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              PetDetect Pro
            </h1>
          </div>
          {currentImage && !isAnalyzing && (
            <button 
              onClick={resetApp}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw size={16} />
              New Analysis
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-center">
            {error}
          </div>
        )}

        {/* Initial Upload State */}
        {!currentImage && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
                Know Your <span className="text-blue-600">Best Friend</span>
              </h2>
              <p className="text-lg text-slate-600">
                Upload a photo to instantly identify dog and cat breeds. We'll count them, name them, and tell you exactly who is who.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelected} isLoading={isAnalyzing} />
          </div>
        )}

        {/* Loading State with Image Preview */}
        {currentImage && isAnalyzing && (
          <div className="flex flex-col items-center justify-center pt-12">
             <div className="w-full max-w-lg mb-8 relative">
               <div className="absolute inset-0 bg-blue-500/10 animate-pulse rounded-xl"></div>
               <img src={currentImage} alt="Analyzing" className="w-full rounded-xl shadow-lg opacity-50 blur-sm" />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
                    <div className="animate-spin text-blue-600 mb-3 mx-auto">
                      <PawPrint size={32} />
                    </div>
                    <p className="text-lg font-semibold text-slate-800">Identifying breeds...</p>
                    <p className="text-sm text-slate-500">Scanning from left to right</p>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* Analysis Results */}
        {currentImage && analysisResult && !isAnalyzing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Image with Overlay */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                <AnalysisOverlay imageSrc={currentImage} animals={analysisResult.animals} />
              </div>
              <div className="text-sm text-slate-500 italic text-center">
                * Bounding boxes indicate the approximate location of each identified animal.
              </div>
            </div>

            {/* Right Column: Detailed List */}
            <div className="lg:col-span-5 xl:col-span-4">
               <ResultList result={analysisResult} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
