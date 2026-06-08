import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Layer } from "@/pages/Index";

interface ImageGeneratorProps {
  onLayersGenerated: (layers: Layer[]) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export const ImageGenerator = ({ onLayersGenerated, isGenerating, setIsGenerating }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setReferenceFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReferenceImage(event.target?.result as string);
      toast.success("Reference image loaded");
    };
    reader.readAsDataURL(file);
  };

  const clearReference = () => {
    setReferenceImage(null);
    setReferenceFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    onLayersGenerated([]);

    try {
      toast.loading("Generating layers... This may take a minute", { id: "generating" });

      const { data, error } = await supabase.functions.invoke("generate-layers", {
        body: {
          prompt: prompt.trim(),
          referenceImage: referenceImage || undefined,
        },
      });

      if (error) throw error;

      if (!data.layers || data.layers.length === 0) {
        throw new Error("No layers generated");
      }

      onLayersGenerated(data.layers);
      toast.success(`Generated ${data.layers.length} layers!`, { id: "generating" });
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate layers", {
        id: "generating",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        Create Your Design
      </h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Design Prompt</label>
          <Textarea
            placeholder="Describe your design... (e.g., 'A futuristic city at sunset with flying cars and neon lights')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none bg-background/50 border-border"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Reference Image (Optional)</label>
          
          {!referenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors bg-background/30"
            >
              <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload a reference image
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                The AI will use this for style and composition
              </p>
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden bg-background/30 p-4">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={clearReference}
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={referenceImage}
                alt="Reference"
                className="w-full rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {referenceFileName}
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isGenerating ? (
            <>
              <span className="animate-pulse">Generating Layers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Layers
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
