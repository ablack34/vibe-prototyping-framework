import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Persona = "user" | "manager" | "admin";

interface PersonaState {
  persona: Persona;
  setPersona: (p: Persona) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      persona: "user",
      setPersona: (persona) => set({ persona }),
      darkMode: true,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: "vibe-prototype-store" }
  )
);

/** Persona definitions — customize per engagement */
export const PERSONAS: Record<Persona, { label: string; description: string }> =
  {
    user: {
      label: "User",
      description: "Primary end user of the application",
    },
    manager: {
      label: "Manager",
      description: "Team lead or supervisor with oversight responsibilities",
    },
    admin: {
      label: "Admin",
      description: "System administrator with full access",
    },
  };
