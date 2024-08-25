import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-neutral-100 rounded">
      <div className="flex justify-center items-center space-x-2">
        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    </div>
  );
}

export default Loading;
