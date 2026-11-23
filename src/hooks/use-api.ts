"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";

/** Loads a protected Express endpoint on mount and exposes reload()/setData(). */
export function useApi<T>(path: string, query?: Record<string, string | undefined>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryKey = JSON.stringify(query || {});
  const seq = useRef(0);

  const load = useCallback(async () => {
    const id = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const res = await api<T>(path, { query: JSON.parse(queryKey) });
      if (id === seq.current) setData(res);
    } catch (e) {
      if (id === seq.current) setError(e instanceof ApiError ? e.message : "Failed to load data");
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [path, queryKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}
