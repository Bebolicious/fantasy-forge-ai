export interface ImageGenerationRequest {
  image: string; // base64 encoded image
  race: string;
  region: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  image?: string; // base64 encoded result
  error?: string;
}

export interface HuggingFaceConfig {
  apiKey?: string;
  baseUrl?: string; // For self-hosted backend
  model?: string;
}
