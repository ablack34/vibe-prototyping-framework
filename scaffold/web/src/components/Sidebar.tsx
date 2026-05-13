import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { usePersonaStore, PERSONAS, type Persona } from "../store";

const NAV_ITEMS: Record<Persona, { to: string; label: string; icon: React.ReactNode }[]> = {
  user: [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  ],
  manager: [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/team", label: "Team", icon: <Users size={18} /> },
  ],
  admin: [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/team", label: "Team", icon: <Users size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ],
};

export function Sidebar() {
  const { persona, setPersona } = usePersonaStore();
  const items = NAV_ITEMS[persona];

  return (
    <aside className="w-56 bg-bg-surface border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-sm font-bold text-brand-light tracking-wide">
          VIBE Prototype
        </h1>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-brand/20 text-brand-light font-medium"
                  : "text-text-muted hover:bg-bg-hover hover:text-text"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <label className="text-[10px] uppercase text-text-dim font-semibold tracking-wider">
          Persona
        </label>
        <select
          value={persona}
          onChange={(e) => setPersona(e.target.value as Persona)}
          className="mt-1 w-full bg-bg-card border border-border rounded-lg px-2 py-1.5 text-sm text-text"
        >
          {Object.entries(PERSONAS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
