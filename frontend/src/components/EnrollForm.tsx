import { Camera, Save, User, Hash, BookOpen } from "lucide-react";
import { useState } from "react";

const EnrollForm = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [section, setSection] = useState("");
  const [captured, setCaptured] = useState(0);

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-bold text-foreground">Enroll a Student</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Capture face samples — embeddings are stored locally for the demo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <User className="w-3.5 h-3.5" /> Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maria Santos"
            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <Hash className="w-3.5 h-3.5" /> Student ID
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 2024-00123"
            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Class / Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          >
            <option value="">Select section…</option>
            <option value="BSCS-3A">BSCS-3A</option>
            <option value="BSCS-3B">BSCS-3B</option>
            <option value="BSIT-2A">BSIT-2A</option>
            <option value="BSIT-2B">BSIT-2B</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={() => setCaptured(Math.min(captured + 1, 5))}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm transition-all hover:bg-secondary/80 active:scale-[0.98]"
        >
          <Camera className="w-4 h-4" />
          Capture ({captured}/5)
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
          <Save className="w-4 h-4" />
          Enroll
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Multiple samples improve recognition accuracy. Preview captured images before saving.
      </p>

      {/* Capture preview grid */}
      {captured > 0 && (
        <div className="flex gap-2">
          {Array.from({ length: captured }).map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium"
            >
              #{i + 1}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollForm;
