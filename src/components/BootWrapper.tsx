"use client";

import { useState, useEffect } from "react";
import BootPreloader from "@/components/BootPreloader";

const SESSION_KEY = "portfolio_boot_done";

export default function BootWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPreloader, setShowPreloader] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only show preloader once per session
    const alreadyBooted = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyBooted) {
      setShowPreloader(true);
    }
    setChecked(true);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowPreloader(false);
  };

  return (
    <>
      {/* Children ALWAYS render so Next.js hydration is never blocked */}
      {children}

      {/* Before sessionStorage is checked, show a solid cover to prevent
          a single-frame flash of unhidden content */}
      {!checked && (
        <div
          className="fixed inset-0 z-[9998]"
          style={{ backgroundColor: "#0a0a0a" }}
          aria-hidden
        />
      )}

      {/* Preloader overlays on top — purely visual, never blocks rendering */}
      {showPreloader && <BootPreloader onComplete={handleComplete} />}
    </>
  );
}
