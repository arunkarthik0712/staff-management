"use client";

import React, { useState, useRef } from "react";

interface FacultyCardProps {
  name: string;
  designation: string;
  img: string;
  targetUserId: string;
}

export default function FacultyCard({
  name,
  designation,
  img,
  targetUserId,
}: FacultyCardProps) {
  const [src, setSrc] = useState(img);
  const cardRef = useRef<HTMLDivElement>(null);

  // Windows 10 Reveal Highlight tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--reveal-opacity", "1");
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--reveal-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full h-full rounded-xl p-[1px] transition-all duration-300"
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
          "--reveal-opacity": "0",
        } as React.CSSProperties
      }
    >
      {/* Windows 10 Reveal Highlight Border Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(220px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.15) 55%, transparent 80%)`,
          opacity: "var(--reveal-opacity)",
        }}
      />

      {/* Card Body */}
      <div
        className="relative w-full h-full rounded-[11px] p-5 flex flex-col items-center text-center backdrop-blur-md transition-colors duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-white/20"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.07) 65%, rgba(255, 255, 255, 0.04))`,
        }}
      >
        {/* Responsive Image Container */}
        <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden mb-4 bg-white/10 border border-white/25 shadow-md flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => {
              setSrc(
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80"
              );
            }}
          />
        </div>

        {/* Faculty Name */}
        <h5 className="font-semibold text-sm sm:text-base text-white mb-1 leading-snug drop-shadow-sm min-h-[44px] flex items-center justify-center">
          {name}
        </h5>

        {/* Designation */}
        <h4 className="text-xs sm:text-sm text-blue-100 font-bold mb-4 drop-shadow-sm min-h-[36px] flex items-center justify-center">
          {designation}
        </h4>

        {/* Profile Button */}
        <a
          href={`/api/report?user_id=${targetUserId}`}
          target="_blank"
          rel="noreferrer"
          className="mt-auto inline-block text-xs font-semibold text-red-300 hover:text-white px-6 py-2 rounded-md backdrop-blur-sm transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-white/25 bg-white/10 hover:bg-white/30"
        >
          View Profile
        </a>
      </div>
    </div>
  );
}
