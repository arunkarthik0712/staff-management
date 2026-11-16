"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export default function AuthWatcher() {
  const { status } = useSession();
  const hasRun = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated" && !hasRun.current) {
      hasRun.current = true;
    }
  }, [status]);

  return null;
}
