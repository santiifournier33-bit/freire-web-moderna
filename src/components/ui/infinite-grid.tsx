"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

interface InfiniteGridProps {
  children?: React.ReactNode;
  className?: string;
}

export const InfiniteGrid = ({ children, className }: InfiniteGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden bg-white",
        className
      )}
    >
      {/* Background patterns - Subtle for light mode */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} stroke="#071828" />
      </div>
      <motion.div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} stroke="#2196f3" />
      </motion.div>

      {/* Subtle Light mode Glow Orbs - aligned with brand but very soft */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[120px]" />
        <div className="absolute left-[-5%] bottom-[-10%] w-[40%] h-[40%] rounded-full bg-slate-100/40 blur-[100px]" />
      </div>

      {/* Main Content Rendered Here */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY, stroke }: { offsetX: any, offsetY: any, stroke: string }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern-infinite-light"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern-infinite-light)" />
    </svg>
  );
};
