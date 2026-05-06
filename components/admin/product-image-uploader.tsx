"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      toast.error("Choose an image first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as { error?: string; url?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Upload failed.");
      }

      setUploadedUrl(payload.url);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  }

  async function copyUrl() {
    if (!uploadedUrl) return;
    await navigator.clipboard.writeText(uploadedUrl);
    toast.success("Image URL copied.");
  }

  return (
    <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">Upload Product Image</h2>
      <p className="mt-1 text-sm text-slate-500">Upload JPG, PNG, WEBP, or GIF (max 5MB).</p>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full cursor-pointer rounded-xl border p-2 text-sm"
        />
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
          Upload
        </Button>
      </div>

      {uploadedUrl ? (
        <div className="mt-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
          <p className="mb-2 text-xs text-slate-500">Uploaded URL</p>
          <div className="flex items-center gap-2">
            <input readOnly value={uploadedUrl} className="w-full rounded-lg border bg-white px-3 py-2 text-sm dark:bg-slate-900" />
            <Button variant="outline" size="sm" onClick={copyUrl}>
              <Copy className="mr-1 h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
