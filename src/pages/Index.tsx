import { useState } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { LayersPanel } from "@/components/LayersPanel";

export interface Layer {
  name: string;
  imageUrl: string;
  description: string;
}

const Index = () => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            AI Layer Designer
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate images layer by layer • See your design come to life • Download each layer
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <ImageGenerator 
            onLayersGenerated={setLayers}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <LayersPanel 
            layers={layers}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
