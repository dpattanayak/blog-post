import React, { forwardRef } from "react";

const Error = forwardRef(function Error({ message }, ref) {
  return <p className="text-red-600 my-2 text-sm">{message}</p>;
});

export default Error;
