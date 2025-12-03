import type { ImageGenerationRequest, ImageGenerationResponse, HuggingFaceConfig } from './types';

const DEFAULT_CONFIG: HuggingFaceConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  model: 'black-forest-labs/FLUX.1-schnell',
};

/**
 * Build prompt for D&D character transformation
 */
export function buildPrompt(race: string, region: string): string {
  return `Transform this person into a ${race} character from ${region} in a Dungeons & Dragons fantasy style. 
The character should have distinctive ${race} features and wear clothing/armor appropriate for the ${region} region. 
High fantasy art style, detailed, dramatic lighting, epic atmosphere.`;
}

/**
 * Generate a D&D fantasy image from user's photo
 * Currently a mock - replace with actual API call to your backend
 */
export async function generateFantasyImage(
  request: ImageGenerationRequest,
  config: HuggingFaceConfig = {}
): Promise<ImageGenerationResponse> {
  const { baseUrl } = { ...DEFAULT_CONFIG, ...config };
  const prompt = buildPrompt(request.race, request.region);

  console.log('Generating image with:', {
    race: request.race,
    region: request.region,
    prompt,
    imageSize: request.image.length,
  });

  // TODO: Replace with actual API call to your backend
  // Example implementation for when backend is ready:
  /*
  try {
    const response = await fetch(`${baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: request.image,
        prompt,
        model: config.model || DEFAULT_CONFIG.model,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Generation failed' };
    }

    const data = await response.json();
    return { success: true, image: data.image };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
  */

  // Mock response for now - simulates API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    image: request.image, // Returns original image as placeholder
  };
}

/**
 * Regenerate with an existing AI image as base (Add Spiciness)
 */
export async function regenerateImage(
  generatedImage: string,
  race: string,
  region: string,
  config: HuggingFaceConfig = {}
): Promise<ImageGenerationResponse> {
  return generateFantasyImage(
    { image: generatedImage, race, region },
    config
  );
}
