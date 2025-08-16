"use client";

import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0.6rem 1rem",
        borderRadius: 8,
        border: "1px solid #111",
        background: "#111",
        color: "#fff",
        fontWeight: 600
      }}
    />
  );
}
