"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadTypes {
  onSuccess: (res: IKUploadResponse) => void;
  onProgress: (progress: number) => void;
  fileType: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadTypes) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUploading, setIsUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const onError = (err: { message: string }) => {
    console.log("Error", err);
    setError(err.message);
    setIsUploading(false);
  };

  const handleOnsuccess = (response: IKUploadResponse) => {
    console.log("Success", response);
    setIsUploading(false);
    setError(null);
    onSuccess(response);
  };

  const handleProgress = (evt: ProgressEvent) => {
    if (evt.lengthComputable && onProgress) {
      const percentComplete = (evt.loaded / evt.total) * 100;
      onProgress(Math.round(percentComplete));
    }
  };
  const handleStartUpload = () => {
    setIsUploading(true);
    setError(null);
  };

  function validateFile(file: File) {
    if (fileType === "video") {
      if (file.type.startsWith("video/")) {
        setError("Please upload video file");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100 MB");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("please upload valid file type: jpeg or png or webp");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100 MB");
        return false;
      }
    }
    return false;
  }

  return (
    <div className="App">
      <IKUpload
        fileName={fileType == "video" ? "video1" : "img1"}
        useUniqueFileName={true}
        validateFile={validateFile}
        onError={onError}
        onSuccess={handleOnsuccess}
        onUploadProgress={handleProgress}
        onUploadStart={handleStartUpload}
      />
    </div>
  );
}
