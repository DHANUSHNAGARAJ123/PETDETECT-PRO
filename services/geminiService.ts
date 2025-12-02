import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AnimalSpecies, DetectedAnimal } from "../types";

const processEnvApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!processEnvApiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: processEnvApiKey || "" });

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  // Strip the prefix if present (e.g. "data:image/jpeg;base64,")
  const data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this image to identify all dogs, cats, and other animals. 
    For each animal found:
    1. Identify the species (Dog, Cat, or Other).
    2. Identify the specific breed. If it is a mixed breed, give the most likely mix. If it's not a dog or cat, state the animal type.
    3. Provide a brief physical description.
    4. Estimate a 2D bounding box for the animal's face or full body (whichever is more prominent) using a 0-1000 scale, where [0,0] is top-left and [1000,1000] is bottom-right. Format: [ymin, xmin, ymax, xmax].
    
    Sort the list of animals from LEFT to RIGHT based on their horizontal position in the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, but works with PNG too usually
              data: data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            animals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  species: { type: Type.STRING, enum: ["Dog", "Cat", "Other"] },
                  breed: { type: Type.STRING },
                  description: { type: Type.STRING },
                  confidence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  box_2d: { 
                    type: Type.ARRAY, 
                    items: { type: Type.NUMBER },
                    description: "Bounding box [ymin, xmin, ymax, xmax] on 0-1000 scale"
                  }
                },
                required: ["species", "breed", "description", "box_2d"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(jsonText);
    
    // Transform raw data into our typed structure with IDs and counts
    const animals: DetectedAnimal[] = (parsed.animals || []).map((item: any, index: number) => ({
      id: index + 1, // 1-based index for UI numbering
      species: item.species as AnimalSpecies,
      breed: item.breed,
      description: item.description,
      confidence: item.confidence || "High",
      box_2d: item.box_2d || [0, 0, 0, 0]
    }));

    const summary = {
      dogCount: animals.filter(a => a.species === AnimalSpecies.DOG).length,
      catCount: animals.filter(a => a.species === AnimalSpecies.CAT).length,
      otherCount: animals.filter(a => a.species === AnimalSpecies.OTHER).length,
      total: animals.length
    };

    return { animals, summary };

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};
