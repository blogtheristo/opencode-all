import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Jitsi Video Meeting Tests
 * Validates the meet page HTML structure, room name logic,
 * and React component interface contracts.
 */

// --- Meet page HTML tests ---

const meetPagePath = resolve(__dirname, '../../dws6.com/meet/index.html');
const meetPageHtml = readFileSync(meetPagePath, 'utf-8');

describe('Jitsi Meet Page (dws6.com/meet/index.html)', () => {
  it('should load the Jitsi IFrame API script', () => {
    expect(meetPageHtml).toContain('https://meet.jit.si/external_api.js');
  });

  it('should use meet.jit.si as the Jitsi domain', () => {
    expect(meetPageHtml).toContain("const JITSI_DOMAIN = 'meet.jit.si'");
  });

  it('should have a lobby section with room input', () => {
    expect(meetPageHtml).toContain('id="lobby"');
    expect(meetPageHtml).toContain('id="room"');
  });

  it('should have a meeting view with jitsi-container', () => {
    expect(meetPageHtml).toContain('id="meeting-view"');
    expect(meetPageHtml).toContain('id="jitsi-container"');
  });

  it('should have share URL inputs for link sharing', () => {
    expect(meetPageHtml).toContain('id="share-url"');
    expect(meetPageHtml).toContain('id="jitsi-direct-url"');
  });

  it('should have email invitation section', () => {
    expect(meetPageHtml).toContain('id="invite-email"');
    expect(meetPageHtml).toContain('sendInvite()');
  });

  it('should configure prejoin and audio/video defaults', () => {
    expect(meetPageHtml).toContain('startWithAudioMuted: true');
    expect(meetPageHtml).toContain('startWithVideoMuted: false');
    expect(meetPageHtml).toContain('prejoinConfig: { enabled: true }');
  });

  it('should configure toolbar buttons including recording', () => {
    const toolbarButtons = [
      'microphone', 'camera', 'desktop', 'chat',
      'raisehand', 'participants-pane', 'tileview',
      'select-background', 'fullscreen', 'hangup',
      'recording', 'settings',
    ];
    for (const btn of toolbarButtons) {
      expect(meetPageHtml).toContain(`'${btn}'`);
    }
  });

  it('should hide Jitsi watermark branding', () => {
    expect(meetPageHtml).toContain('SHOW_JITSI_WATERMARK: false');
    expect(meetPageHtml).toContain('SHOW_BRAND_WATERMARK: false');
  });

  it('should support room hash parameter (#room=name)', () => {
    expect(meetPageHtml).toContain("params.get('room')");
    expect(meetPageHtml).toContain("window.location.hash = 'room='");
  });

  it('should have a leave meeting handler that disposes the API', () => {
    expect(meetPageHtml).toContain('function leaveMeeting()');
    expect(meetPageHtml).toContain('jitsiApi.dispose()');
  });
});

// --- Room name sanitization tests ---

function sanitizeRoomName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

describe('Room Name Sanitization', () => {
  it('should pass through clean names unchanged', () => {
    expect(sanitizeRoomName('my-meeting')).toBe('my-meeting');
    expect(sanitizeRoomName('dws6-test123')).toBe('dws6-test123');
  });

  it('should replace spaces with hyphens', () => {
    expect(sanitizeRoomName('my meeting room')).toBe('my-meeting-room');
  });

  it('should replace special characters with hyphens', () => {
    expect(sanitizeRoomName('room@#$%test')).toBe('room-test');
  });

  it('should collapse multiple hyphens', () => {
    expect(sanitizeRoomName('room---test')).toBe('room-test');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(sanitizeRoomName('---room---')).toBe('room');
  });

  it('should handle empty string', () => {
    expect(sanitizeRoomName('')).toBe('');
  });

  it('should allow underscores', () => {
    expect(sanitizeRoomName('my_meeting_room')).toBe('my_meeting_room');
  });
});

// --- React component interface tests ---

const jitsiComponentPath = resolve(
  __dirname,
  '../../dws6.com/dashboard/firehorse/v10-react/src/components/JitsiMeeting.tsx'
);
const jitsiComponentSrc = readFileSync(jitsiComponentPath, 'utf-8');

const meetingPanelPath = resolve(
  __dirname,
  '../../dws6.com/dashboard/firehorse/v10-react/src/components/MeetingPanel.tsx'
);
const meetingPanelSrc = readFileSync(meetingPanelPath, 'utf-8');

describe('JitsiMeeting React Component', () => {
  it('should export a JitsiMeeting component', () => {
    expect(jitsiComponentSrc).toContain('export function JitsiMeeting');
  });

  it('should accept roomName and displayName props', () => {
    expect(jitsiComponentSrc).toContain('roomName: string');
    expect(jitsiComponentSrc).toContain('displayName: string');
  });

  it('should support VITE_JITSI_DOMAIN env override', () => {
    expect(jitsiComponentSrc).toContain('import.meta.env.VITE_JITSI_DOMAIN');
  });

  it('should start with audio muted and video muted', () => {
    expect(jitsiComponentSrc).toContain('startWithAudioMuted: true');
    expect(jitsiComponentSrc).toContain('startWithVideoMuted: true');
  });

  it('should clean up on unmount by disposing the API', () => {
    expect(jitsiComponentSrc).toContain('apiRef.current?.dispose()');
  });

  it('should listen for readyToClose event', () => {
    expect(jitsiComponentSrc).toContain("addEventListener('readyToClose'");
  });
});

describe('MeetingPanel React Component', () => {
  it('should export a MeetingPanel component', () => {
    expect(meetingPanelSrc).toContain('export function MeetingPanel');
  });

  it('should import JitsiMeeting', () => {
    expect(meetingPanelSrc).toContain("import { JitsiMeeting } from './JitsiMeeting'");
  });

  it('should generate room names with dws6- prefix', () => {
    expect(meetingPanelSrc).toContain('`dws6-${id}`');
  });

  it('should have create and join meeting handlers', () => {
    expect(meetingPanelSrc).toContain('handleCreateMeeting');
    expect(meetingPanelSrc).toContain('handleJoinMeeting');
  });

  it('should have a leave/close meeting handler', () => {
    expect(meetingPanelSrc).toContain('handleCloseMeeting');
  });
});

// --- Landing pages sync test ---

describe('Landing Pages Sync', () => {
  it('dws6.com/meet and landing-pages/dws6-com/meet should be identical', () => {
    const landingMeetPath = resolve(__dirname, '../../landing-pages/dws6-com/meet/index.html');
    const landingMeetHtml = readFileSync(landingMeetPath, 'utf-8');
    expect(meetPageHtml).toBe(landingMeetHtml);
  });

  it('JitsiMeeting.tsx should be synced between source and landing-pages', () => {
    const landingJitsiPath = resolve(
      __dirname,
      '../../landing-pages/dws6-com/dashboard/firehorse/v10-react/src/components/JitsiMeeting.tsx'
    );
    const landingJitsiSrc = readFileSync(landingJitsiPath, 'utf-8');
    expect(jitsiComponentSrc).toBe(landingJitsiSrc);
  });

  it('MeetingPanel.tsx should be synced between source and landing-pages', () => {
    const landingPanelPath = resolve(
      __dirname,
      '../../landing-pages/dws6-com/dashboard/firehorse/v10-react/src/components/MeetingPanel.tsx'
    );
    const landingPanelSrc = readFileSync(landingPanelPath, 'utf-8');
    expect(meetingPanelSrc).toBe(landingPanelSrc);
  });
});
