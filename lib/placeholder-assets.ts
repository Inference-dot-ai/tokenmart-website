// Placeholder images pulled from /public/model-assets — used as a stable
// fallback for any model card that doesn't have an explicit assetUrl yet.
export const PLACEHOLDER_IMAGES: string[] = [
  "/model-assets/claude-opus-4-6.png",
  "/model-assets/claude-opus-4-5.png",
  "/model-assets/claude-haiku-4-5.png",
  "/model-assets/gpt-5-4.png",
  "/model-assets/gpt-5-2.png",
  "/model-assets/gpt-image-1-5.png",
  "/model-assets/gemini-3-pro-preview.png",
  "/model-assets/gemini-3-flash-preview.png",
  "/model-assets/nano-banana-pro.png",
  "/model-assets/midjourney-v7.png",
  "/model-assets/qwen-image-edit.png",
  "/model-assets/qwen-3.png",
  "/model-assets/seedream-5-0.png",
  "/model-assets/seedream-4-5.png",
  "/model-assets/wan-image.png",
  "/model-assets/z-image-turbo.png",
  "/model-assets/deepseek-v4.png",
  "/model-assets/deepseek-reasoner.png",
];

export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getPlaceholderImage(key: string): string {
  return PLACEHOLDER_IMAGES[hashString(key) % PLACEHOLDER_IMAGES.length];
}
