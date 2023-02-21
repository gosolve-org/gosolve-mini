import React from 'react';

interface GradientDotProps {
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

/* eslint-disable */
export function GradientDot({ style, width = 16, height = 16 }: GradientDotProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" fill="none" style={style}>
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="6.5"
        fill="#1CBF84"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
    </svg>
  );
}
