/*
 * components/HalftoneCanvas.tsx
 *
 * Client-side canvas that draws a static halftone dot cloud.
 * Rendered once on mount; static and aria-hidden.
 */

"use client";

import { useEffect, useRef } from "react";

export default function HalftoneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 280;
    const height = 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Detect dark mode for dot tint
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dotColor = isDark
      ? "rgba(139, 148, 158, 0.45)"
      : "rgba(107, 114, 128, 0.35)";

    ctx.fillStyle = dotColor;

    const spacing = 10;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const maxDist = Math.hypot(cx, cy);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing + spacing / 2;
        const y = r * spacing + spacing / 2;

        // Distance from center to form a soft organic cloud
        const dist = Math.hypot(x - cx, y - cy);
        const norm = dist / maxDist;

        // Radius varies smoothly from 3px down to 0.4px
        const radius = Math.max(0.4, 3.2 * Math.cos(norm * Math.PI * 0.9));

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-[200px] w-[280px] max-w-full"
      style={{ width: "280px", height: "200px" }}
      aria-hidden="true"
    />
  );
}
