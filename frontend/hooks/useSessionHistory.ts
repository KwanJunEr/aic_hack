/**
 * hooks/useSessionHistory.ts
 *
 * Fetch and manage the user's past extraction sessions from MongoDB.
 * Use this in a history/sidebar component to let users reload old sessions.
 */

import { useState, useEffect, useCallback } from "react"
import type { ExtractionSession } from "@/lib/extractText"

export interface SessionSummary {
  session_id: string
  session_name: string
  total_files: number
  successful: number
  created_at: string
}

// ── List sessions ──────────────────────────────────────────────────────────

export function useSessionHistory(limit = 20) {
  const [sessions, setSessions]   = useState<SessionSummary[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const fetchSessions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/upload/sessions?limit=${limit}`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch sessions")
      setSessions(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  // ── Delete a session ────────────────────────────────────────────────────

  const deleteSession = useCallback(async (sessionId: string) => {
    const res = await fetch(`/upload/sessions/${sessionId}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (!res.ok) throw new Error("Failed to delete session")
    // Optimistic update
    setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))
  }, [])

  return { sessions, loading, error, refresh: fetchSessions, deleteSession }
}

// ── Single session detail ──────────────────────────────────────────────────

export function useSession(sessionId: string | null) {
  const [session, setSession]   = useState<ExtractionSession | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    setError(null)

    fetch(`/upload/sessions/${sessionId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Session not found")
        return res.json()
      })
      .then(setSession)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [sessionId])

  return { session, loading, error }
}