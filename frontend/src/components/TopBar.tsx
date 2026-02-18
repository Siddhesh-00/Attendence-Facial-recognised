import { Bell, Search, CalendarDays } from "lucide-react";

const TopBar = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 shrink-0 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground font-medium">{today}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, records..."
            className="pl-9 pr-4 py-2 w-64 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
          PA
        </div>
      </div>
    </header>
  );
};

export default TopBar;
