import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Camera, Wifi, WifiOff, MonitorSmartphone } from "lucide-react";

const sectionData = [
  { name: "BSCS-3A", value: 42, total: 45 },
  { name: "BSCS-3B", value: 38, total: 44 },
  { name: "BSIT-2A", value: 40, total: 43 },
  { name: "BSIT-2B", value: 35, total: 41 },
];

const COLORS = [
  "hsl(351, 83%, 61%)",
  "hsl(217, 91%, 60%)",
  "hsl(152, 69%, 40%)",
  "hsl(38, 92%, 50%)",
];

const SectionBreakdown = () => (
  <div className="glass-card p-5 flex flex-col gap-4">
    <div>
      <h3 className="text-sm font-bold text-foreground">By Section</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Today's breakdown</p>
    </div>
    <div className="h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sectionData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            strokeWidth={2}
            stroke="hsl(0, 0%, 100%)"
          >
            {sectionData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {sectionData.map((s, i) => (
        <div key={s.name} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
          <span className="text-muted-foreground">{s.name}</span>
          <span className="font-bold text-foreground ml-auto">
            {s.value}/{s.total}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const SystemStatus = () => (
  <div className="glass-card p-5 flex flex-col gap-4">
    <div>
      <h3 className="text-sm font-bold text-foreground">System Status</h3>
      <p className="text-xs text-muted-foreground mt-0.5">Device & connectivity</p>
    </div>
    <div className="flex flex-col gap-3">
      {[
        { icon: Camera, label: "Camera Feed", status: "Active", ok: true },
        { icon: Wifi, label: "Network", status: "Connected", ok: true },
        { icon: MonitorSmartphone, label: "Recognition Engine", status: "Running", ok: true },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <item.icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground flex-1">{item.label}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.ok ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
    <div className="pt-2 border-t border-border">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Confidence threshold</span>
        <span className="font-bold text-foreground">0.60</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full w-[60%] rounded-full bg-primary" />
      </div>
    </div>
  </div>
);

export { SectionBreakdown, SystemStatus };
