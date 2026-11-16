import React from "react";
import Image from "next/image";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export const SidebarHeader = ({ collapsed }: SidebarHeaderProps) => {
  return (
    <>
      {/* Logo row ------------------------------------------------------- */}
      <div className="p-4 flex items-center justify-center sticky top-0 z-10 h-[78px]">
        <div className="flex items-center">
          {collapsed && (
            <div className="w-12 h-12 flex items-center justify-center font-bold">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                width={50}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          {!collapsed && (
            <div className="text-lg font-bold ml-3 w-55 h-16 relative">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                sizes="220px"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
