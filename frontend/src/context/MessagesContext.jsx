"use client";

import { createContext, useContext } from "react";
import { useMessages } from "@/hooks/useMessages";

/**
 * MessagesContext — shared singleton that fetches contact messages ONCE
 * when the dashboard mounts and shares the state with all consumers.
 *
 * Without this, both DashboardOverviewPage and MessagesPage call useMessages()
 * independently — two API calls on every dashboard navigation.
 *
 * Usage:
 *   Wrap inside DashboardShell (after auth check).
 *   Replace `useMessages()` in pages with `useMessagesContext()`.
 */
const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  // useMessages() owns the fetch, state, and all action callbacks
  const messagesData = useMessages();
  return (
    <MessagesContext.Provider value={messagesData}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessagesContext() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error("useMessagesContext must be inside <MessagesProvider>");
  return ctx;
}
