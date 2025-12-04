import { InferenceClient } from '@huggingface/inference';
import type { ImageGenerationRequest, ImageGenerationResponse, HuggingFaceConfig } from './types';

const DEFAULT_CONFIG: HuggingFaceConfig = {
  model: 'black-forest-labs/FLUX.1-dev',
  captionModel: 'Salesforce/blip-image-captioning-large',
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
 * Get image caption/description using BLIP
 */
async function getImageCaption(imageBlob: Blob, captionModel: string): Promise<string> {
  console.log('Getting image caption with:', captionModel);
  
  const result = await client.imageToText({
    model: captionModel,
    data: imageBlob,
  });
  
  console.log('Image caption result:', result);
  return result.generated_text || 'a person';
}

/**
 * Build master prompt combining image description, race, and region
 */
function buildMasterPrompt(imageDescription: string, race: string, region: string): string {
  return `A highly detailed fantasy portrait of ${imageDescription}, transformed into a ${race} from ${region} in Dungeons & Dragons style. 
The character has distinctive ${race} racial features and wears clothing and armor appropriate for ${region}. 
Epic fantasy art, dramatic lighting, intricate details, professional digital painting, 8k resolution, artstation quality.`;
}

/**
 * Generate a D&D fantasy image using caption + text-to-image pipeline
 */
export async function generateFantasyImage(
  request: ImageGenerationRequest,
  config: HuggingFaceConfig = {}
): Promise<ImageGenerationResponse> {
  const model = config.model || DEFAULT_CONFIG.model;
  const captionModel = config.captionModel || DEFAULT_CONFIG.captionModel;

  console.log('Starting image generation pipeline:', {
    race: request.race,
    region: request.region,
    model,
    captionModel,
  });

  try {
    // Step 1: Convert uploaded image to text description
    const imageBlob = base64ToBlob(request.image);
    const imageDescription = await getImageCaption(imageBlob, captionModel);
    
    // Step 2: Build master prompt
    const masterPrompt = buildMasterPrompt(imageDescription, request.race, request.region);
    console.log('Master prompt:', masterPrompt);
    
    // Step 3: Generate new image with FLUX
    const result = await client.textToImage({
      model,
      inputs: masterPrompt,
    });

    // Result is a Blob from textToImage
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
