import { InferenceClient } from '@huggingface/inference';
import type { ImageGenerationRequest, ImageGenerationResponse, HuggingFaceConfig } from './types';

const DEFAULT_CONFIG: HuggingFaceConfig = {
  model: 'stabilityai/sdxl-turbo',
};

// Initialize client with user-provided token
const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_TOKEN);

/**
 * Build prompt for D&D character transformation
 */
export function buildPrompt(race: string, region: string): string {
  return `Transform this person into a ${race} character from ${region} in a Dungeons & Dragons fantasy style. 
The character should have distinctive ${race} features and wear clothing/armor appropriate for the ${region} region. 
High fantasy art style, detailed, dramatic lighting, epic atmosphere.`;
}

/**
 * Convert base64 image to Blob
 */
function base64ToBlob(base64: string): Blob {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: 'image/png' });
}

/**
 * Convert Blob to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a D&D fantasy image using image-to-image transformation
 */
export async function generateFantasyImage(
  request: ImageGenerationRequest,
  config: HuggingFaceConfig = {}
): Promise<ImageGenerationResponse> {
  const model = config.model || DEFAULT_CONFIG.model;
  const prompt = buildPrompt(request.race, request.region);

  console.log('Generating image with:', {
    race: request.race,
    region: request.region,
    prompt,
    model,
  });

  try {
    const imageBlob = base64ToBlob(request.image);
    
    const result = await client.imageToImage({
      model,
      inputs: imageBlob,
      parameters: {
        prompt,
        strength: 0.7,
        guidance_scale: 7.5,
      },
    });

    const base64Image = await blobToBase64(result);
    
    return {
      success: true,
      image: base64Image,
    };
  } catch (error) {
    console.error('HuggingFace API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Image generation failed',
    };
  }
}

/**
 * Regenerate with same settings (Add Spiciness)
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
