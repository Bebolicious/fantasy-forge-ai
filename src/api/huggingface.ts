import { InferenceClient } from '@huggingface/inference';
import type { ImageGenerationRequest, ImageGenerationResponse, HuggingFaceConfig } from './types';

const DEFAULT_CONFIG: HuggingFaceConfig = {
  model: 'black-forest-labs/FLUX.1-dev',
};

// Initialize client with user-provided token
const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_TOKEN);

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
 * Build prompt for D&D character transformation
 */
function buildPrompt(race: string, region: string): string {
  return `Transform this person into a ${race} character from ${region} in Dungeons & Dragons style. 
The character has distinctive ${race} racial features and wears clothing and armor appropriate for ${region}. 
Epic fantasy art, dramatic lighting, intricate details, professional digital painting, 8k resolution, artstation quality.`;
}

/**
 * Generate a D&D fantasy image using FLUX image-to-image
 */
export async function generateFantasyImage(
  request: ImageGenerationRequest,
  config: HuggingFaceConfig = {}
): Promise<ImageGenerationResponse> {
  const model = config.model || DEFAULT_CONFIG.model;
  const prompt = buildPrompt(request.race, request.region);

  console.log('Starting image-to-image generation:', {
    race: request.race,
    region: request.region,
    model,
    prompt,
  });

  try {
    const imageBlob = base64ToBlob(request.image);
    
    const result = await client.imageToImage({
      model,
      inputs: imageBlob,
      parameters: { prompt },
    });

    const base64Image = await blobToBase64(result as unknown as Blob);
    
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
 * Regenerate with same settings (Add Spiciness) - uses the generated image's description
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
