import { usePersonaStore, PERSONAS } from "../store";
import { useHealth } from "../api";
import { Activity, CheckCircle2, AlertCircle } from "lucide-react";

export function Dashboard() {
  const { persona } = usePersonaStore();
  const health = useHealth();
  const personaInfo = PERSONAS[persona];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-text-muted mt-1">
          Welcome, {personaInfo.label}. {personaInfo.description}.
        </p>
      </div>

      {/* API Health Status */}
      <div className="bg-bg-surface border border-border rounded-xl p-5 mb-6">
        <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
          <Activity size={18} className="text-brand-light" />
          System Status
        </h3>
        <div className="flex items-center gap-2">
          {health.isLoading && (
            <span className="text-text-muted text-sm">Checking API...</span>
          )}
          {health.isSuccess && (
            <>
              <CheckCircle2 size={16} className="text-success" />
              <span className="text-sm text-success">API Connected</span>
            </>
          )}
          {health.isError && (
            <>
              <AlertCircle size={16} className="text-danger" />
              <span className="text-sm text-danger">
                API Offline — run <code>start.ps1</code> to start both servers
              </span>
            </>
          )}
        </div>
      </div>

      {/* Placeholder KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Metric A", "Metric B", "Metric C"].map((label) => (
          <div
            key={label}
            className="bg-bg-surface border border-border rounded-xl p-5"
          >
            <p className="text-[10px] uppercase text-text-dim font-semibold tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold mt-1">—</p>
            <p className="text-xs text-text-muted mt-1">
              Configure via /vibe-data-prep
            </p>
          </div>
        ))}
      </div>

      {/* Getting Started */}
      <div className="bg-bg-surface border border-border rounded-xl p-5">
        <h3 className="text-base font-semibold mb-3">Getting Started</h3>
        <ol className="space-y-2 text-sm text-text-muted">
          <li>
            1. Run <code className="text-brand-light">/vibe-data-prep</code> to
            load customer data
          </li>
          <li>
            2. Customize personas in{" "}
            <code className="text-brand-light">src/store.ts</code>
          </li>
          <li>
            3. Add pages in{" "}
            <code className="text-brand-light">src/pages/</code>
          </li>
          <li>
            4. Run <code className="text-brand-light">/vibe-deploy</code> to
            deploy to Azure
          </li>
        </ol>
      </div>
    </div>
  );
}
