
import React from "react";

export default function Logo({ size = 48, showText = true }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48 8 C36 8 31 22 29 33 C26 45 15 52 15 67 C15 83 27 93 43 92 C60 91 76 79 81 63 C86 48 74 39 65 29 C59 22 57 8 48 8 Z"
          fill="#16A34A"
        />
        <ellipse cx="34" cy="52" rx="6" ry="9" fill="#BBF7D0" />
        <ellipse cx="49" cy="39" rx="6" ry="9" fill="#BBF7D0" />
        <ellipse cx="62" cy="52" rx="5" ry="7" fill="#BBF7D0" />
        <text
          x="49"
          y="72"
          textAnchor="middle"
          fontSize="19"
          fontWeight="bold"
          fill="white"
        >
          CO₂
        </text>
      </svg>

      {showText && (
        <span
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "#166534",
          }}
        >
          CarbonTrack
        </span>
      )}
    </div>
  );
}