"use client";
import React from "react";
import { useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface CustomModalProps {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  size?: string;
}

export default function CustomModal({
  open,
  handleClose,
  children,
  size = "max-w-3xl",
}: CustomModalProps) {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Wrapper */}
      <div
        className={`relative w-full lg:max-w-4xl md:max-w-2xl z-40 overflow-visible`} // allow overflow
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute cursor-pointer -top-7 md:top-0 right-0 md:-right-7 w-6 h-6 rounded-full bg-primary text-primary-foreground
         flex items-center justify-center shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Modal Panel */}
        <div className="relative bg-card text-card-foreground border border-border rounded-lg shadow-xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-90">
          {/* <div className="flex justify-end shadow sticky top-0 bg-white z-10 p-2 md:hidden">
            <button
              onClick={handleClose}
              className=" cursor-pointer w-6 h-6 rounded-full bg-primary text-white
              flex items-center justify-center shadow-lg "
              aria-label="Close modal"
            >
              <X className="w-3 h-3" />
            </button>
          </div> */}
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
}
