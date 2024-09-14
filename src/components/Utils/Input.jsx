import React, { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, type = "text", className = "", ...rest },
  ref
) {
  const id = useId();
  const { readOnly } = { ...rest };
  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`px-3 py-2 rounded-lg ${
          readOnly
            ? "bg-gray-300"
            : "bg-light focus:bg-gray-50 border-gray-200 dark:border-white/10"
        } text-black outline-none duration-200 border w-full ${className}`}
        ref={ref}
        {...rest}
      />
    </div>
  );
});

export default Input;
