/**
 * JitsiMeeting Component
 * Embeds Jitsi Meet video conferencing via IFrame API
 * Phase 1: Uses meet.jit.si (free) — switch domain for self-hosted
 *
 * @see https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe/
 */

import { useEffect, useRef, useCallback } from 'react';

// Jitsi domain — change to self-hosted domain in Phase 2
const JITSI_DOMAIN = import.meta.env.VITE_JITSI_DOMAIN || 'meet.jit.si';

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiOptions) => JitsiAPI;
  }
}

interface JitsiOptions {
  roomName: string;
  parentNode: HTMLElement | null;
  userInfo?: { displayName: string; email?: string };
  configOverwrite?: Record<string, unknown>;
  interfaceConfigOverwrite?: Record<string, unknown>;
  width?: string | number;
  height?: string | number;
}

interface JitsiAPI {
  dispose: () => void;
  addEventListener: (event: string, callback: (...args: unknown[]) => void) => void;
  executeCommand: (command: string, ...args: unknown[]) => void;
}

interface JitsiMeetingProps {
  roomName: string;
  displayName: string;
  email?: string;
  onClose?: () => void;
  onParticipantJoined?: () => void;
  onParticipantLeft?: () => void;
}

export function JitsiMeeting({
  roomName,
  displayName,
  email,
  onClose,
  onParticipantJoined,
  onParticipantLeft,
}: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiAPI | null>(null);

  const handleReadyToClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the Jitsi IFrame API script
    const script = document.createElement('script');
    script.src = `https://${JITSI_DOMAIN}/external_api.js`;
    script.async = true;

    script.onload = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

      apiRef.current = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName,
        parentNode: containerRef.current,
        width: '100%',
        height: '100%',
        userInfo: {
          displayName,
          email,
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinConfig: { enabled: true },
          disableDeepLinking: true,
          defaultLanguage: 'en',
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'desktop', 'chat',
            'raisehand', 'participants-pane', 'tileview',
            'select-background', 'fullscreen', 'hangup',
          ],
        },
      });

      // Wire up event listeners
      apiRef.current.addEventListener('readyToClose', handleReadyToClose);

      if (onParticipantJoined) {
        apiRef.current.addEventListener('participantJoined', onParticipantJoined);
      }
      if (onParticipantLeft) {
        apiRef.current.addEventListener('participantLeft', onParticipantLeft);
      }
    };

    document.head.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      apiRef.current = null;
      script.remove();
    };
  }, [roomName, displayName, email, handleReadyToClose, onParticipantJoined, onParticipantLeft]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-lg overflow-hidden border border-border"
      style={{ height: '500px' }}
    />
  );
}
