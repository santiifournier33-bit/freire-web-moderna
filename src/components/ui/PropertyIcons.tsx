"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  DoorOpen, 
  Bath, 
  Bed, 
  Calendar, 
  Compass, 
  Sun,
  Maximize2
} from "lucide-react";

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Metros Totales (Ruler with arrows) - Matches Image
export const TotalSurfaceIcon = ({ className, size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 3v18h3M7 7h3M7 12h3M7 17h3" />
    <path d="M15 5l2-2 2 2" />
    <path d="M15 19l2 2 2-2" />
    <path d="M17 3v18" />
  </svg>
);

// 2. Metros Cubiertos (Maximize2 matches closely but this is slightly more custom)
export const CubiertaSurfaceIcon = ({ className, size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="5" y="5" width="14" height="14" rx="1" />
    <path d="M14 10l5-5" />
    <path d="M19 8V5h-3" />
  </svg>
);

// 3. Ambientes (DoorOpen matches well)
export const RoomsIcon = ({ className, size = 20 }: IconProps) => (
  <DoorOpen size={size} className={className} strokeWidth={1.5} />
);

// 4. Baños (Bath matches well)
export const BathroomsIcon = ({ className, size = 20 }: IconProps) => (
  <Bath size={size} className={className} strokeWidth={1.5} />
);

// 5. Cocheras (Car under roof)
export const ParkingIcon = ({ className, size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 10V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
    <path d="M18 17h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M8 12h8" />
  </svg>
);

// 6. Dormitorios (Bed matches well)
export const BedIcon = ({ className, size = 20 }: IconProps) => (
  <Bed size={size} className={className} strokeWidth={1.5} />
);

// 7. Toilette (Toilet)
export const ToiletIcon = ({ className, size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 2h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M6 9v3a6 6 0 0 0 12 0V9" />
    <path d="M10 22h4" />
    <path d="M12 15v7" />
  </svg>
);

// 8. Antigüedad (Calendar matches well)
export const AgeIcon = ({ className, size = 20 }: IconProps) => (
  <Calendar size={size} className={className} strokeWidth={1.5} />
);

// 9. Disposición (Frente - Window + Curtains)
export const PropertyFacingIcon = ({ className, size = 20 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 12h16" />
    <path d="M12 4v16" />
    <path d="M4 4c4 4 4 12 0 16" />
    <path d="M20 4c-4 4-4 12 0 16" />
  </svg>
);

// 10. Orientación (Compass matches well)
export const OrientationIcon = ({ className, size = 20 }: IconProps) => (
  <Compass size={size} className={className} strokeWidth={1.5} />
);

// 11. Luminosidad (Sun matches well)
export const BrightnessIcon = ({ className, size = 20 }: IconProps) => (
  <Sun size={size} className={className} strokeWidth={1.5} />
);
