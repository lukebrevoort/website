"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileChallengeProps = {
  siteKey: string;
  resetKey: number;
  onToken: (token: string | null) => void;
};

export default function TurnstileChallenge({ siteKey, resetKey, onToken }: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(Boolean(globalThis.window?.turnstile));

  const removeWidget = useCallback(() => {
    if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    widgetId.current = null;
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !window.turnstile) return;
    removeWidget();
    onToken(null);
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      appearance: "interaction-only",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
    return removeWidget;
  }, [onToken, removeWidget, resetKey, scriptReady, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div ref={containerRef} aria-label="Human verification" />
    </>
  );
}
