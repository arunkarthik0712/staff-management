"use client";

import { useEffect, useState } from "react";

interface SvgImageProps {
  src: string;
  className?: string;
  color?: string;
}

export function SvgImage({ src, className = "", color = "currentColor" }: SvgImageProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(src);
        let svgText = await response.text();

        // Replace fill colors with the desired color
        svgText = svgText
          .replace(/fill="[^"]*"/g, `fill="${color}"`)
          .replace(/stroke="[^"]*"/g, `stroke="${color}"`);

        // Ensure SVG has proper attributes for scaling
        svgText = svgText.replace(
          /<svg([^>]*)>/,
          '<svg$1 width="100%" height="100%" preserveAspectRatio="xMidYMid meet">'
        );

        setSvg(svgText);
        setLoading(false);
      } catch (error) {
        console.error("Error loading SVG:", error);
        setLoading(false);
      }
    };

    fetchSvg();
  }, [src, color]);

  if (loading) {
    return <div className={className} />;
  }

  return (
    <div
      className={`${className} flex items-center justify-center`}
      style={{ maxWidth: "100%", maxHeight: "100%" }}
      dangerouslySetInnerHTML={{ __html: svg! }}
    />
  );
}
