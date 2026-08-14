import { useState, useCallback } from "react";
import { uploadImage } from "@/services/upload.service";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState(null);

  const upload = useCallback(async (file, folder = "general", slot = null) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Pass onProgress callback — axios onUploadProgress provides real intermediate values
      const result = await uploadImage(file, folder, slot, (pct) => setProgress(pct));
      setProgress(100);
      return result; // { url, publicId }
    } catch (err) {
      const msg = err.response?.data?.message || "Upload failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, progress, error };
}
