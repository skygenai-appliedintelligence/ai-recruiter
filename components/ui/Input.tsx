"use client";

import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "0.6rem 0.7rem",
        borderRadius: 8,
        border: "1px solid #ccc"
      }}
    />
  );
}
