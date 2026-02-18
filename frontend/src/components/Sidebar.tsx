import {
  LayoutDashboard,
  Users,
  Camera,
  ClipboardList,
  BarChart3,
  Settings,
  Sparkles,
  GraduationCap,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "camera", label: "Live Camera", icon: Camera },
  { id: "attendance", label: "Attendance", icon: ClipboardList },
  { id: "students", label: "Students", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <aside
      className="w-[260px] h-screen flex flex-col shrink-0"
      style={{ background: "hsl(var(--sidebar-bg))" }}
    >
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3" style={{ borderBottom: "1px solid hsl(var(--sidebar-border))" }}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">SmartFace</h1>
          <p className="text-[11px] font-medium" style={{ color: "hsl(var(--sidebar-fg))" }}>
            Attendance System
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-2" style={{ color: "hsl(var(--sidebar-fg)/0.5)" }}>
          Main Menu
        </p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`sidebar-item w-full ${activeTab === item.id ? "active" : ""}`}
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-5 flex flex-col gap-2">
        <div className="mx-2 p-3.5 rounded-xl" style={{ background: "hsl(var(--sidebar-hover))" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Prof. Admin</p>
              <p className="text-[11px]" style={{ color: "hsl(var(--sidebar-fg))" }}>
                admin@school.edu
              </p>
            </div>
          </div>
        </div>
        <button className="sidebar-item w-full opacity-70 hover:opacity-100">
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
