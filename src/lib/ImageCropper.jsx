import React, { useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button, Input } from "../components";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect.js";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function ImageCropper({
  imgSrc,
  initialCrop,
  onUpload,
  onCancel,
  aspectRatio = 16 / 9,
  circularCrop,
}) {
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState(initialCrop);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(aspectRatio);

  useEffect(() => {
    if (imgSrc && aspect && imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, aspect);
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }, [imgSrc, aspect]);

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function toBlob(canvas, type = "image/jpeg", quality = 0.8) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  async function handleUploadClick(event) {
    if (!completedCrop || !imgRef.current) return;
    event.preventDefault();

    await canvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      completedCrop,
      scale,
      rotate
    );
    const croppedImageBlob = await toBlob(previewCanvasRef.current);
    croppedImageBlob && onUpload(croppedImageBlob);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else {
      setAspect(aspectRatio);

      if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerAspectCrop(width, height, aspectRatio);
        setCrop(newCrop);
        setCompletedCrop(convertToPixelCrop(newCrop, width, height));
      }
    }
  }

  return (
    <div className="mt-8">
      <div className="w-full my-8 flex gap-4">
        <div className="space-y-5 w-1/3">
          <Input
            label="Scale: "
            placeholder="0.1 - 1"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            className="px-2 py-0"
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>

        <div className="space-y-5 w-1/3">
          <Input
            label="Rotate: "
            placeholder="0 - 10"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            className="px-2 py-0"
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>

        <div className="space-y-5 w-1/3">
          <div className="w-full">
            <label
              className="inline-block mb-1 pl-1 text-sm"
              htmlFor="toggle-aspect"
            >
              Aspect Ratio:
            </label>
            <button
              onClick={handleToggleAspectClick}
              className="block"
              type="button"
            >
              <div
                className={`relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in rounded-full ${
                  !!aspect ? "bg-blue-500" : "bg-gray-400"
                }`}
              >
                <span
                  className={`absolute block w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform transition-transform duration-200 ease-in ${
                    !!aspect ? "translate-x-4" : "translate-x-0"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          circularCrop={circularCrop}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (
        <>
          <div className="hidden">
            <canvas
              ref={previewCanvasRef}
              style={{
                border: "1px solid black",
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>
          {/* Upload and Cancel buttons */}
          <div className="flex flex-col md:flex-row justify-center items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
            <Button type="button" bgColor="gray" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="button" bgColor="blue" onClick={handleUploadClick}>
              Upload
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCropper;
