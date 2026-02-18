import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", present: 1120, absent: 128 },
  { day: "Tue", present: 1089, absent: 159 },
  { day: "Wed", present: 1145, absent: 103 },
  { day: "Thu", present: 1050, absent: 198 },
  { day: "Fri", present: 1089, absent: 142 },
  { day: "Sat", present: 420, absent: 30 },
];

const AttendanceChart = () => {
  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Weekly Attendance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">This week's overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
            <span className="text-xs text-muted-foreground">Absent</span>
          </div>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(351, 83%, 61%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(351, 83%, 61%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(220, 9%, 46%)" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid hsl(220, 13%, 91%)",
                boxShadow: "0 4px 12px hsla(220, 20%, 10%, 0.08)",
                fontSize: "13px",
              }}
            />
            <Area type="monotone" dataKey="present" stroke="hsl(351, 83%, 61%)" strokeWidth={2.5} fill="url(#presentGrad)" />
            <Area type="monotone" dataKey="absent" stroke="hsl(0, 84%, 60%)" strokeWidth={1.5} fill="url(#absentGrad)" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
