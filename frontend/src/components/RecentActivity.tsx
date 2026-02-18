import { UserCheck, Clock, AlertTriangle } from "lucide-react";

const recentEntries = [
  { name: "Maria Santos", id: "2024-00123", section: "BSCS-3A", time: "8:02 AM", status: "present" },
  { name: "Juan Dela Cruz", id: "2024-00045", section: "BSCS-3A", time: "8:05 AM", status: "present" },
  { name: "Ana Reyes", id: "2024-00198", section: "BSIT-2A", time: "8:17 AM", status: "late" },
  { name: "Carlos Garcia", id: "2024-00067", section: "BSCS-3B", time: "8:12 AM", status: "present" },
  { name: "Lea Morales", id: "2024-00301", section: "BSIT-2B", time: "—", status: "absent" },
  { name: "Mark Tan", id: "2024-00089", section: "BSCS-3A", time: "8:21 AM", status: "late" },
  { name: "Sofia Lim", id: "2024-00212", section: "BSCS-3B", time: "7:58 AM", status: "present" },
];

const statusConfig: Record<string, { label: string; classes: string; icon: typeof UserCheck }> = {
  present: { label: "Present", classes: "bg-success/10 text-success", icon: UserCheck },
  late: { label: "Late", classes: "bg-warning/10 text-warning", icon: Clock },
  absent: { label: "Absent", classes: "bg-destructive/10 text-destructive", icon: AlertTriangle },
};

const RecentActivity = () => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Latest check-ins & alerts</p>
        </div>
        <button className="text-xs font-semibold text-primary hover:underline">View All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Student</th>
              <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4 hidden sm:table-cell">Section</th>
              <th className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4">Time</th>
              <th className="text-left text-xs font-semibold text-muted-foreground pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.map((entry, i) => {
              const config = statusConfig[entry.status];
              return (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground shrink-0">
                        {entry.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">{entry.section}</td>
                  <td className="py-3 pr-4 text-muted-foreground font-medium">{entry.time}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.classes}`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
