import { useEffect, useState } from "react";

type State<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "error"; data: null; error: string }
  | { status: "ready"; data: T; error: null };

/** Fetches a JSON file from /data (produced by pipeline/export_for_web.py). */
export function useJson<T>(name: string): State<T> {
  const [state, setState] = useState<State<T>>({ status: "loading", data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    fetch(`${import.meta.env.BASE_URL}data/${name}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`${name}.json: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setState({ status: "error", data: null, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  return state;
}
