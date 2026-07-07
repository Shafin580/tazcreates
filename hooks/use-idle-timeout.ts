"use client";

import * as React from "react";

export type UseIdleTimeoutArgs = {
  timeoutMs: number;
  onIdle: () => void;
  enabled: boolean;
  channelName?: string;
  throttleMs?: number;
};

const DEFAULT_CHANNEL_NAME = "hrms-idle-activity";
const DEFAULT_THROTTLE_MS = 1000;
const WINDOW_ACTIVITY_EVENTS: ReadonlyArray<keyof WindowEventMap> = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
];
const DOCUMENT_ACTIVITY_EVENTS: ReadonlyArray<keyof DocumentEventMap> = [
  "visibilitychange",
];

/**
 * Fires `onIdle` after `timeoutMs` of no user activity. Resets on mouse,
 * keyboard, touch, scroll, and visibility events. Coordinates across tabs via
 * BroadcastChannel so activity in one tab keeps siblings alive.
 */
export function useIdleTimeout({
  timeoutMs,
  onIdle,
  enabled,
  channelName = DEFAULT_CHANNEL_NAME,
  throttleMs = DEFAULT_THROTTLE_MS,
}: UseIdleTimeoutArgs): void {
  const onIdleRef = React.useRef(onIdle);
  React.useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastActivityAt = 0;
    let channel: BroadcastChannel | null = null;

    const fire = () => {
      timer = null;
      onIdleRef.current();
    };

    const scheduleFire = () => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(fire, timeoutMs);
    };

    const resetTimer = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      scheduleFire();
    };

    const onLocalActivity = () => {
      const now = Date.now();
      if (now - lastActivityAt < throttleMs) return;
      lastActivityAt = now;
      resetTimer();
      if (channel) {
        try {
          channel.postMessage({ t: now });
        } catch {
          // BroadcastChannel may throw if closed mid-flight; safe to ignore.
        }
      }
    };

    if (typeof BroadcastChannel !== "undefined") {
      channel = new BroadcastChannel(channelName);
      channel.onmessage = () => {
        // Treat a peer tab's activity as activity here too, but skip the
        // re-broadcast to avoid ping-pong.
        lastActivityAt = Date.now();
        resetTimer();
      };
    }

    WINDOW_ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onLocalActivity, { passive: true });
    });
    DOCUMENT_ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, onLocalActivity, { passive: true });
    });

    scheduleFire();

    return () => {
      WINDOW_ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onLocalActivity);
      });
      DOCUMENT_ACTIVITY_EVENTS.forEach((event) => {
        document.removeEventListener(event, onLocalActivity);
      });
      if (timer !== null) clearTimeout(timer);
      if (channel) {
        channel.onmessage = null;
        channel.close();
      }
    };
  }, [enabled, timeoutMs, channelName, throttleMs]);
}
