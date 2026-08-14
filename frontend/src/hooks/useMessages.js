import { useState, useEffect, useCallback } from "react";
import { getMessages, setReadState, deleteMessage } from "@/services/contact.service";

export function useMessages() {
  const [messages,    setMessages]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMessages();
      setMessages(result.messages);
      setUnreadCount(result.unreadCount);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []); // empty deps — fetchMessages is stable

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Mark as read — optimistic update, no stale closure risk
  const markRead = useCallback(async (id) => {
    setMessages((prev) => {
      const msg = prev.find((m) => m._id === id);
      if (!msg || msg.read) return prev; // already read — skip
      // Optimistic update
      setReadState(id, true).catch((err) => console.error("markRead failed:", err.message));
      setUnreadCount((c) => Math.max(0, c - 1));
      return prev.map((m) => m._id === id ? { ...m, read: true } : m);
    });
  }, []); // empty deps — uses functional setState

  // Toggle read ↔ unread — optimistic, functional update
  const toggleRead = useCallback(async (id) => {
    setMessages((prev) => {
      const msg = prev.find((m) => m._id === id);
      if (!msg) return prev;
      const newRead = !msg.read;
      // Commit to server (fire-and-forget from UI perspective)
      setReadState(id, newRead).catch((err) => console.error("toggleRead failed:", err.message));
      setUnreadCount((c) => newRead ? Math.max(0, c - 1) : c + 1);
      return prev.map((m) => m._id === id ? { ...m, read: newRead } : m);
    });
  }, []); // empty deps

  // Delete — optimistic, functional update
  const deleteMsg = useCallback(async (id) => {
    // Call API first — deletion is non-reversible
    await deleteMessage(id);
    setMessages((prev) => {
      const msg = prev.find((m) => m._id === id);
      if (msg && !msg.read) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((m) => m._id !== id);
    });
  }, []); // empty deps

  return {
    messages, loading, error, unreadCount,
    markRead, toggleRead, deleteMsg,
    refetch: fetchMessages,
  };
}
