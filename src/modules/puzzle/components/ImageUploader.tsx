"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";

interface ImageUploaderProps {
  onDrop: (files: File[]) => void;
  disabled?: boolean;
}

export function ImageUploader({ onDrop, disabled }: ImageUploaderProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        isDragActive
          ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
          : "border-neutral-300 hover:border-violet-400 dark:border-neutral-700"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      <ImagePlus className="mx-auto size-8 text-neutral-400" />
      <p className="mt-2 text-sm font-medium">
        {isDragActive ? "Drop image here" : "Drag & drop a puzzle image"}
      </p>
      <p className="mt-1 text-xs text-neutral-500">PNG, JPG, or WebP</p>
    </div>
  );
}
