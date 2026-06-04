import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * App store — intentionally minimal.
 *
 * The /vibe-prototype-scaffold prompt will add persona definitions,
 * role-based state, and any other client-side state the requirements call for.
 *
 * Do not pre-build personas or UI preferences here. They should be
 * driven by the engagement's identified users and use cases.
 */

interface AppState {
  /** Add engagement-specific state after scaffolding */
  _placeholder: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (): AppState => ({
      _placeholder: true,
    }),
    { name: "vibe-prototype-store" }
  )
);
