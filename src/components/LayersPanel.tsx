import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Layers, Eye, FileImage } from "lucide-react";
import { toast } from "sonner";
import { Layer } from "@/pages/Index";
import { Skeleton } from "@/components/ui/skeleton";
import { createPsdFromLayers } from "@/utils/psdExport";

interface LayersPanelProps {
  layers: Layer[];
  isGenerating: boolean;
}

export const LayersPanel = ({ layers, isGenerating }: LayersPanelProps) => {
  const downloadLayer = async (layer: Layer) => {
    try {
      const response = await fetch(layer.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${layer.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${layer.name} layer`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download layer");
    }
  };

  const downloadAll = async () => {
    toast.loading("Downloading all layers...", { id: "download-all" });
    
    for (const layer of layers) {
      await downloadLayer(layer);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    
    toast.success("All layers downloaded!", { id: "download-all" });
  };

  const downloadPsd = async () => {
    try {
      toast.loading("Creating PSD file with all layers...", { id: "psd-export" });
      
      const psdBlob = await createPsdFromLayers(layers, 1024, 1024);
      
      const url = window.URL.createObjectURL(psdBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai-design-layers.psd";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("PSD file downloaded! Open in Photoshop to edit layers", { id: "psd-export" });
    } catch (error) {
      console.error("PSD export error:", error);
      toast.error("Failed to create PSD file", { id: "psd-export" });
    }
  };

  if (isGenerating) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          Generated Layers
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-32 bg-muted" />
              <Skeleton className="h-48 w-full bg-muted" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (layers.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          Generated Layers
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Eye className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Your generated layers will appear here
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Enter a prompt and click generate to start
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" />
          Generated Layers
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={downloadPsd}
            className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90"
            size="sm"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Export PSD
          </Button>
          <Button
            onClick={downloadAll}
            variant="outline"
            size="sm"
            className="border-border hover:bg-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            PNG Layers
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {layers.map((layer, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg">{layer.name}</h3>
              </div>
              <Button
                onClick={() => downloadLayer(layer)}
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative rounded-lg overflow-hidden">
              <img
                src={layer.imageUrl}
                alt={layer.name}
                className="w-full h-auto transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-xs text-foreground">{layer.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
