import { writePsd, type Layer as PsdLayer } from 'ag-psd';
import { Layer } from '@/pages/Index';

export const createPsdFromLayers = async (layers: Layer[], width: number = 1024, height: number = 1024): Promise<Blob> => {
  // Load all images first
  const loadedLayers: PsdLayer[] = [];
  
  for (const layer of layers) {
    const img = await loadImage(layer.imageUrl);
    const canvas = imageToCanvas(img, width, height);
    
    loadedLayers.push({
      name: layer.name,
      canvas: canvas,
      opacity: 1,
    });
  }

  // Create PSD document
  const psd = {
    width,
    height,
    children: loadedLayers.reverse(), // Reverse so background is at bottom
  };

  // Write PSD to array buffer
  const arrayBuffer = writePsd(psd, {
    generateThumbnail: true,
    trimImageData: false,
  });

  return new Blob([arrayBuffer], { type: 'application/photoshop' });
};

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const imageToCanvas = (img: HTMLImageElement, targetWidth: number, targetHeight: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Draw image centered and scaled to fit
  const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;
  const x = (targetWidth - scaledWidth) / 2;
  const y = (targetHeight - scaledHeight) / 2;
  
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  
  return canvas;
};
