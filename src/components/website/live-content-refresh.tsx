"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 4000;

/**
 * When an admin saves content, the server bumps a revision stamp.
 * This polls that stamp and soft-refreshes the page so visitors see
 * updates without a manual reload.
 */
export function LiveContentRefresh() {
  const router = useRouter();
  const revisionRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/v1/content-revision", {
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const json = (await res.json()) as {
          data?: { revision?: string };
        };
        const next = String(json.data?.revision ?? "");
        if (!next || cancelled) return;

        if (revisionRef.current === null) {
          revisionRef.current = next;
          return;
        }

        if (revisionRef.current !== next) {
          revisionRef.current = next;
          router.refresh();
        }
      } catch {
        /* offline / transient — ignore */
      }
    }

    void check();
    const timer = window.setInterval(() => {
      void check();
    }, POLL_MS);

    function onVisible() {
      if (document.visibilityState === "visible") {
        void check();
      }
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
