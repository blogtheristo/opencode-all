/**
 * Tests for the Claude-side token recorder (scripts/record-session-tokens.mjs).
 *
 * Rule 9: these assert INTENT, not shape. Each one fails if the recorder stops
 * producing a usable cost-per-task ledger — a stubbed aggregator returning [] or
 * a constant breaks every case below.
 */
import { describe, expect, it } from 'vitest';
// @ts-expect-error — .mjs script under test, no type declarations by design
import { aggregateTranscript } from '../../scripts/record-session-tokens.mjs';

type Event = {
  provider: string;
  product: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  sessionId: string;
  taskId: string;
  timestamp: string;
};

const userTurn = (text: string) =>
  JSON.stringify({ type: 'user', message: { role: 'user', content: text } });

const toolResult = () =>
  JSON.stringify({
    type: 'user',
    message: { role: 'user', content: [{ type: 'tool_result', content: 'ok' }] },
  });

const assistant = (
  usage: Record<string, number>,
  model = 'claude-opus-5',
  timestamp = '2026-07-30T12:00:00.000Z',
) => JSON.stringify({ type: 'assistant', timestamp, message: { role: 'assistant', model, usage } });

describe('aggregateTranscript', () => {
  it('attributes usage to the user turn that requested it', () => {
    const events: Event[] = aggregateTranscript(
      [
        userTurn('first ask'),
        assistant({ input_tokens: 100, output_tokens: 10 }),
        userTurn('second ask'),
        assistant({ input_tokens: 200, output_tokens: 20 }),
      ],
      'sess',
    );

    expect(events).toHaveLength(2);
    const byTask = Object.fromEntries(events.map((e) => [e.taskId, e]));
    // The point of the recorder: cost is attributable per task, not per session.
    expect(byTask['sess#turn-1'].promptTokens).toBe(100);
    expect(byTask['sess#turn-2'].promptTokens).toBe(200);
  });

  it('does not open a new task for tool results replayed as user messages', () => {
    // A long agentic turn is many tool round-trips. If each opened a task, the
    // per-task figure would be meaningless — which is the whole deliverable.
    const events: Event[] = aggregateTranscript(
      [
        userTurn('one ask, many tools'),
        assistant({ input_tokens: 100, output_tokens: 10 }),
        toolResult(),
        assistant({ input_tokens: 50, output_tokens: 5 }),
        toolResult(),
        assistant({ input_tokens: 25, output_tokens: 5 }),
      ],
      'sess',
    );

    expect(events).toHaveLength(1);
    expect(events[0].taskId).toBe('sess#turn-1');
    expect(events[0].promptTokens).toBe(175);
    expect(events[0].completionTokens).toBe(20);
  });

  it('counts cache creation as prompt cost and cache reads as cached', () => {
    // These are billed differently; collapsing them would misprice every task.
    const [event]: Event[] = aggregateTranscript(
      [
        userTurn('ask'),
        assistant({
          input_tokens: 2,
          cache_creation_input_tokens: 66_168,
          cache_read_input_tokens: 1_000,
          output_tokens: 804,
        }),
      ],
      'sess',
    );

    expect(event.promptTokens).toBe(66_170);
    expect(event.cachedTokens).toBe(1_000);
    expect(event.completionTokens).toBe(804);
  });

  it('separates models within the same task', () => {
    const events: Event[] = aggregateTranscript(
      [
        userTurn('ask'),
        assistant({ input_tokens: 100, output_tokens: 10 }, 'claude-opus-5'),
        assistant({ input_tokens: 40, output_tokens: 4 }, 'claude-haiku-4-5-20251001'),
      ],
      'sess',
    );

    expect(events).toHaveLength(2);
    expect(new Set(events.map((e) => e.model))).toEqual(
      new Set(['claude-opus-5', 'claude-haiku-4-5-20251001']),
    );
    // Same task, two models — cost per task is the sum, and the split stays visible.
    expect(new Set(events.map((e) => e.taskId))).toEqual(new Set(['sess#turn-1']));
  });

  it('emits events shaped for token_usage_events ingest', () => {
    const [event]: Event[] = aggregateTranscript(
      [userTurn('ask'), assistant({ input_tokens: 10, output_tokens: 1 })],
      'sess-abc',
    );

    // The service already accepts product 'claude-code'; the recorder exists to
    // feed that path, so drifting off it silently would defeat the purpose.
    expect(event.provider).toBe('anthropic');
    expect(event.product).toBe('claude-code');
    expect(event.sessionId).toBe('sess-abc');
    expect(event.timestamp).toBe('2026-07-30T12:00:00.000Z');
  });

  it('survives a truncated final line and zero-usage entries', () => {
    const events: Event[] = aggregateTranscript(
      [
        userTurn('ask'),
        assistant({ input_tokens: 10, output_tokens: 1 }),
        assistant({ input_tokens: 0, output_tokens: 0 }),
        '{"type":"assistant","message":{"role":"assist', // container killed mid-write
      ],
      'sess',
    );

    expect(events).toHaveLength(1);
    expect(events[0].promptTokens).toBe(10);
  });
});
