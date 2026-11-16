"use client";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  href?: string;
  label: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItemType[];
  background?: string;
}

export default function PageHeader({ title, breadcrumbs, background }: PageHeaderProps) {
  return (
    <section
      className="relative w-full h-[250px] flex items-center justify-center text-center"
      style={{
        backgroundImage: background ? `url(${background})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay (for readability) */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList className="flex justify-center text-sm text-white">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.href || index}>
                <BreadcrumbItem>
                  {!item.active ? (
                    <BreadcrumbLink
                      className="text-white/80 hover:text-white"
                      href={item.href}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className="font-semibold text-white">
                      {item.label}
                    </span>
                  )}
                </BreadcrumbItem>

                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="text-white/60" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </section>
  );
}
