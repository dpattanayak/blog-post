import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "blue",
  textColor = "text-text-dark",
  className = "",
  disabled = false,
  ...rest
}) {
  return (
    <button
      className={`px-4 py-2 rounded-lg w-full hover:bg-${bgColor}-700 ${
        disabled ? `bg-${bgColor}-800 bg-opacity-60` : `bg-${bgColor}-600`
      } ${textColor} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
