import { Routes, Route } from "react-router-dom";

/**
 * App shell — intentionally minimal.
 * 
 * The /vibe-prototype-scaffold prompt generates pages, components,
 * layout, and routes based on your engagement's requirements.
 * 
 * Do not add pre-built UI patterns here. The prototype's shape
 * should emerge from the problem being solved, not a template.
 */
export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-lg text-center">
              <h1 className="text-2xl font-bold mb-4">VIBE Prototype</h1>
              <p className="text-gray-500 mb-6">
                This scaffold is ready for customization. Run{" "}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">
                  /vibe-prototype-scaffold
                </code>{" "}
                in Copilot Chat to generate pages and components from your
                engagement requirements.
              </p>
              <div className="text-left bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
                <p>The prototype's UI will be shaped by:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your prioritized requirements</li>
                  <li>Your identified personas and user flows</li>
                  <li>Your customer's context and industry</li>
                </ul>
              </div>
            </div>
          </div>
        }
      />
    </Routes>
  );
}
