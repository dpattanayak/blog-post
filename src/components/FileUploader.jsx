import { ID } from "appwrite";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import config from "../../conf/appwrite-config";
import ImageCropper from "../lib/ImageCropper";
import { storage } from "../services";

const FileUploader = ({
  name,
  control,
  rules,
  label = "File Upload :",
  width = 90,
  aspect = 16 / 9,
  circularCrop = false,
}) => {
  const fileInputRef = useRef(null);
  const [percentage, setPercentage] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [initialCrop, setInitialCrop] = useState(null);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result);
        setInitialCrop({
          unit: "%",
          width,
          aspect,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      setIsModalOpen(true);
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      console.log("Dropped file:", file.name);
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.value = null;
    }
  };

  const handleUpload = (file, onChange) => {
    if (!file) return;
    if (existingFile) {
      setIsUploading(false);
      setUploadCompleted(false);
      storage.deleteFile(existingFile);
    }

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
        setExistingFile(response.data.$id);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        setIsUploading(false);
      });
  };

  const handleUploadCroppedImage = (croppedFile, onChange) => {
    const fileExtension = croppedFile.type.split("/")[1];
    const newFileName = `${circularCrop ? "profile" : "blog"}_${
      userData.email
    }.${fileExtension}`;

    const newCroppedFile = new File([croppedFile], newFileName, {
      type: croppedFile.type,
      lastModified: Date.now(),
    });

    handleCancel();
    setPercentage(0);
    setIsUploading(true);
    handleUpload(newCroppedFile, onChange);
  };

  const handleCancel = () => {
    setImgSrc(null);
    setSelectedFile(null);
    setIsModalOpen(false);
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
                onChange={(e) => handleFileChange(e)}
                accept="image/*"
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

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl mb-4">
                      Selected File : {selectedFile.name}
                    </h2>
                    {imgSrc && (
                      <ImageCropper
                        imgSrc={imgSrc}
                        initialCrop={initialCrop}
                        onUpload={(croppedFile) =>
                          handleUploadCroppedImage(croppedFile, onChange)
                        }
                        onCancel={handleCancel}
                        aspectRatio={aspect}
                        circularCrop={circularCrop}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        />
      </div>
    </>
  );
};

export default FileUploader;
