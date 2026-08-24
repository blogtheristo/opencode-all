/**
 * MeetingPanel Component
 * Create or join Jitsi Meet video conferences
 * Phase 1: Uses meet.jit.si (free, no self-hosting required)
 */

import { useState, useCallback } from 'react';
import { JitsiMeeting } from './JitsiMeeting';

interface MeetingPanelProps {
  userName: string;
  userEmail?: string;
}

export function MeetingPanel({ userName, userEmail }: MeetingPanelProps) {
  const [roomName, setRoomName] = useState('');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  const generateRoomName = useCallback(() => {
    const id = Math.random().toString(36).substring(2, 8);
    return `dws6-${id}`;
  }, []);

  const handleCreateMeeting = useCallback(() => {
    const room = generateRoomName();
    setActiveRoom(room);
  }, [generateRoomName]);

  const handleJoinMeeting = useCallback(() => {
    const trimmed = roomName.trim();
    if (!trimmed) return;
    setActiveRoom(trimmed);
  }, [roomName]);

  const handleCloseMeeting = useCallback(() => {
    setActiveRoom(null);
    setRoomName('');
  }, []);

  // Active meeting view
  if (activeRoom) {
    return (
      <div className="card p-0 overflow-hidden">
        {/* Meeting header */}
        <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">
              {activeRoom}
            </span>
          </div>
          <button
            onClick={handleCloseMeeting}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Leave Meeting
          </button>
        </div>

        {/* Jitsi IFrame */}
        <JitsiMeeting
          roomName={activeRoom}
          displayName={userName}
          email={userEmail}
          onClose={handleCloseMeeting}
        />
      </div>
    );
  }

  // Meeting lobby view
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <h3 className="text-lg font-semibold text-foreground">Video Meeting</h3>
      </div>

      <p className="text-sm text-fg-muted mb-6">
        Secure, encrypted video conferencing powered by Jitsi Meet.
        No downloads required.
      </p>

      {/* Create new meeting */}
      <button
        onClick={handleCreateMeeting}
        className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        New Meeting
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-fg-muted/20" />
        <span className="text-xs text-fg-muted uppercase">or join existing</span>
        <div className="flex-1 h-px bg-fg-muted/20" />
      </div>

      {/* Join existing meeting */}
      <div className="flex gap-2">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoinMeeting()}
          placeholder="Enter room name..."
          className="flex-1 text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={handleJoinMeeting}
          disabled={!roomName.trim()}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-primary-50 rounded-lg">
        <p className="text-xs text-primary-700">
          Meetings are end-to-end encrypted. Share the room name with participants to invite them.
        </p>
      </div>
    </div>
  );
}
