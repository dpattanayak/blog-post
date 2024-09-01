import React from "react";

function ProgressBar({ progress }) {
  return (
    <div className="relative mb-16 w-full bg-gray-200 rounded-md h-4">
      <div
        className="absolute inset-0 bg-blue-600 rounded-md flex items-center justify-center text-white text-sm font-sm"
        style={{ width: `${progress}%` }}
      >
        {progress > 10 && `${progress}%`}
      </div>
    </div>
  );
}

export default ProgressBar;
