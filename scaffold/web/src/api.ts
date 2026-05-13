import { useQuery } from "@tanstack/react-query";

const API_BASE = "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

/** Health check */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => fetchJson<{ status: string }>("/health"),
    staleTime: 30_000,
  });
}

/**
 * Add data-specific hooks here after running /vibe-data-prep.
 * Example:
 *
 * export function usePeople() {
 *   return useQuery({
 *     queryKey: ["people"],
 *     queryFn: () => fetchJson<Person[]>("/people"),
 *   });
 * }
 */
