import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { usePersonaStore } from "./store";

/** Add more pages here as the prototype grows. */
export default function App() {
  const { persona } = usePersonaStore();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add persona-specific routes here:
              <Route path="/team" element={<TeamView />} />
              <Route path="/settings" element={<Settings />} />
          */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
