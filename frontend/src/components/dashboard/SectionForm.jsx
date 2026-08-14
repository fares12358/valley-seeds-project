"use client";

import { useState, useEffect, useCallback } from "react";
import SaveBar from "@/components/dashboard/SaveBar";

/**
 * SectionForm — owns EN+AR form state for one section
 * Sprint 1: initialData from mock/local; onSave is a mock handler
 * Sprint 3: replace initialData from useSection hook, onSave calls real API
 */
export default function SectionForm({ initialData, onSave, children }) {
  const [formData, setFormData] = useState(initialData || { en: {}, ar: {}, images: [] });
  const [savedData, setSavedData] = useState(initialData || { en: {}, ar: {}, images: [] });
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSavedData(initialData);
      setIsDirty(false);
    }
  }, [initialData]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(savedData));
  }, [formData, savedData]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const setField = useCallback((lang, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value },
    }));
  }, []);

  const setNestedField = useCallback((lang, parentKey, index, key, value) => {
    setFormData((prev) => {
      const arr = [...(prev[lang]?.[parentKey] || [])];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [lang]: { ...prev[lang], [parentKey]: arr } };
    });
  }, []);

  const setImages = useCallback((images) => {
    setFormData((prev) => ({ ...prev, images }));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(formData);
      setSavedData(formData);
      setIsDirty(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData(savedData);
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1">
        {children({ formData, setField, setNestedField, setImages })}
      </div>
      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={handleDiscard} />
    </div>
  );
}
