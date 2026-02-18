import { Users, UserCheck, UserX, Clock, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    label: "Total Students",
    value: "1,248",
    change: "+12",
    changeLabel: "this semester",
    trend: "up" as const,
    icon: Users,
    color: "info",
  },
  {
    label: "Present Today",
    value: "1,089",
    change: "87.2%",
    changeLabel: "attendance rate",
    trend: "up" as const,
    icon: UserCheck,
    color: "success",
  },
  {
    label: "Absent Today",
    value: "142",
    change: "-3.1%",
    changeLabel: "vs last week",
    trend: "down" as const,
    icon: UserX,
    color: "destructive",
  },
  {
    label: "Late Arrivals",
    value: "17",
    change: "-22%",
    changeLabel: "improvement",
    trend: "down" as const,
    icon: Clock,
    color: "warning",
  },
];

const colorMap: Record<string, string> = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
              <stat.icon className="w-[18px] h-[18px]" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
            <div className="flex items-center gap-1.5 mt-1">
              {stat.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-success" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-destructive" />
              )}
              <span className="text-xs font-semibold text-success">{stat.change}</span>
              <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
