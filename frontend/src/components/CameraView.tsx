import { Camera, Pause, Play, Sparkles } from "lucide-react";
import { useState } from "react";

const CameraView = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Camera feed */}
      <div className="relative w-full aspect-video bg-foreground/95 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="w-12 h-12 text-muted-foreground/30" />
        </div>
        <div className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-lg" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm">
          <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`} />
          <span className="text-xs font-medium text-primary-foreground">
            {isPaused ? "Paused" : "Camera active"}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-foreground/60 backdrop-blur-sm">
          <span className="text-xs font-medium text-primary-foreground">
            Confidence: 0.60
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2.5">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
          <Sparkles className="w-4 h-4" />
          Check In
        </button>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm transition-all hover:bg-muted active:scale-[0.98]"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold">Tip:</span> Allow camera access. Use good lighting and remove masks or hats for best results.
      </p>
    </div>
  );
};

export default CameraView;
