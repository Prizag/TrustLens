"use client"

import { useState, useEffect } from "react"

/**
 * Hook to safely handle client-side only rendering
 * Prevents hydration errors by ensuring components only render on the client
 */
export function useClientOnly() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
