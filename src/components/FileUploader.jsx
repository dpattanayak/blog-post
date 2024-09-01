import { ID } from "appwrite";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import config from "../../conf/appwrite-config";

const FileUploader = ({ name, control, rules, label = "File Upload :" }) => {
  const fileInputRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (file) {
      setPercentage(0);
      setIsUploading(true);
      handleUpload(file, onChange);
      e.target.value = null;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, onChange) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      console.log("Dropped file:", file.name);
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: { files: e.dataTransfer.files } }, onChange);
      e.dataTransfer.value = null;
    }
  };

  const handleUpload = (file, onChange) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("fileId", ID.unique());
    formData.append("file", file);

    setIsUploading(true);

    axios
      .post(
        `${config.appWriteURL}/storage/buckets/${config.appWriteBucketId}/files`,
        formData,
        {
          headers: {
            "X-Appwrite-Project": config.appWriteProjectId,
            "X-Appwrite-Key": config.appWriteStorageKey,
          },
          onUploadProgress: (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round(
                (event.loaded / event.total) * 100
              );
              setPercentage(percentComplete);
            }
          },
        }
      )
      .then((response) => {
        onChange(response.data.$id);
        setUploadCompleted(true);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      });
  };

  return (
    <>
      {label && <label className="inline-block pl-1">{label}</label>}
      <div className="mt-1 mb-[22px]">
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          rules={rules}
          render={({ field: { onChange } }) => (
            <>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, onChange)}
                className="hidden"
              />

              {/* Clickable div with drag-and-drop functionality */}
              <div
                onClick={handleDivClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, onChange)}
                className={`relative w-full h-[130px] p-4 flex items-center justify-center rounded-lg cursor-pointer transition-colors border border-dashed border-blue-950 text-gray-500 
                  ${isDragging && "bg-red-200"}
                  ${
                    uploadCompleted
                      ? "bg-green-200"
                      : "bg-slate-200 hover:bg-slate-400"
                  }`}
              >
                {isDragging && "Drop the file here..."}
                {uploadCompleted
                  ? "File uploaded successfully"
                  : !isUploading && "Click or drag a file to upload"}
                {/* Progress bar overlay */}
                {isUploading && (
                  <div
                    className={`absolute top-0 left-0 h-full bg-slate-400 opacity-50`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                )}
                {/* Text overlay on top of progress */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                    Uploading {percentage}%
                  </div>
                )}
              </div>
            </>
          )}
        />
      </div>
    </>
  );
};

export default FileUploader;
