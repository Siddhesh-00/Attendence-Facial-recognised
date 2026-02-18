import { Download, Trash2, Clock, UserCheck } from "lucide-react";

const demoLog = [
  { name: "Maria Santos", id: "2024-00123", time: "8:02 AM", section: "BSCS-3A" },
  { name: "Juan Dela Cruz", id: "2024-00045", time: "8:05 AM", section: "BSCS-3A" },
  { name: "Ana Reyes", id: "2024-00198", time: "8:07 AM", section: "BSIT-2A" },
  { name: "Carlos Garcia", id: "2024-00067", time: "8:12 AM", section: "BSCS-3B" },
];

const AttendanceLog = () => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground">Attendance Log</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Recent check-ins today</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {demoLog.length} present
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        {demoLog.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.id} · {entry.section}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {entry.time}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5 pt-1">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm transition-all hover:bg-secondary/80 active:scale-[0.98]">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground font-medium text-sm transition-all hover:bg-muted active:scale-[0.98]">
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default AttendanceLog;
