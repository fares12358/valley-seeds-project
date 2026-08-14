import { useState, useEffect, useCallback, useMemo } from "react";
import { getSection, updateSection } from "@/services/content.service";
import { invalidateTranslationCache } from "@/i18n/index";
import toast from "react-hot-toast";

/**
 * useSection — fetch + save layer for one CMS section.
 *
 * ARCHITECTURE: useSection provides the initial fetch (data) and the
 * save function. SectionForm owns the live editing state (formData) and
 * passes it back via onSave(formData) → save(payload). This dual-state
 * design is intentional — SectionForm needs instant local updates per
 * keystroke without re-fetching or touching the "server truth" copy.
 */
export function useSection(section) {
  const [data,      setData]      = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // Memoised isDirty — avoids JSON.stringify on every render
  const isDirty = useMemo(
    () => data !== null && JSON.stringify(data) !== JSON.stringify(savedData),
    [data, savedData]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getSection(section)
      .then((result) => {
        if (cancelled) return;
        const initial = {
          en:     result.en     || {},
          ar:     result.ar     || {},
          images: result.images || [],
        };
        setData(initial);
        setSavedData(initial);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || "Failed to load content");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [section]);

  // save(payload) — payload is SectionForm's live formData copy.
  // Falls back to hook's internal data if called programmatically without a form.
  const save = useCallback(async (payload) => {
    const toSave = payload || data;
    if (!toSave) return;
    try {
      const updated = await updateSection(section, toSave);
      const saved = {
        en:     updated.en     || {},
        ar:     updated.ar     || {},
        images: updated.images || [],
      };
      setData(saved);
      setSavedData(saved);
      // Bust in-memory i18n cache — public site re-fetches on next visit
      invalidateTranslationCache();
      toast.success("Saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
      throw err;
    }
  }, [data, section]);

  return { data, loading, error, isDirty, save };
}
