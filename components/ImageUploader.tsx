import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isLoading }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelected]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-xl cursor-pointer 
          transition-all duration-300 ease-in-out
          ${isLoading 
            ? 'bg-gray-50 border-gray-300 cursor-not-allowed opacity-50' 
            : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-500 shadow-sm hover:shadow-md'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className={`p-4 rounded-full mb-4 ${isLoading ? 'bg-gray-100' : 'bg-blue-100 text-blue-600'}`}>
            {isLoading ? (
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          <p className="mb-2 text-lg font-medium text-gray-700">
            {isLoading ? 'Analyzing...' : 'Click to upload image'}
          </p>
          <p className="text-sm text-gray-500">
            JPG, PNG (max 10MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isLoading}
        />
      </label>
      
      {!isLoading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
          <ImageIcon className="w-4 h-4" />
          <span>Upload a photo with dogs, cats, or other animals to identify them.</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
