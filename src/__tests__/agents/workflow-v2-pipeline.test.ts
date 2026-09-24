import { describe, expect, it } from 'vitest';
import {
  buildPipelineView,
  loadRegistry,
  parseFrontMatter,
  parseSignalFile,
} from '../../agents/workflow-v2/pipeline.js';

const SAMPLE = `---
signal_id: MS-2026-09-001
reality: 17 construction leads this week.
observation: They talk about documentation, not emissions.
signal: Demand for documentation automation is growing.
insight: Construction does not buy reporting; it buys less waste.
confidence: high
occurrences: 3
affected: [lifetime.fi, dws10.com]
decision: roolimalli_v1_5
status: implemented
evidence: {leads: 17, conversations: 8}
impact:
  - {target: lifetime.fi, status: done}
  - {target: onelifetime.world, status: in progress, note: series 0 pending}
  - {target: buy, status: done}
evaluation: null
---

Body text is ignored by the parser.
`;

describe('registry front matter parser', () => {
  it('parses scalars, inline lists, inline maps and block lists of inline maps', () => {
    const fm = parseFrontMatter(SAMPLE);
    expect(fm.signal_id).toBe('MS-2026-09-001');
    expect(fm.occurrences).toBe(3);
    expect(fm.affected).toEqual(['lifetime.fi', 'dws10.com']);
    expect(fm.evidence).toEqual({ leads: '17', conversations: '8' });
    expect(fm.evaluation).toBeNull();
    expect((fm.impact as unknown[]).length).toBe(3);
  });
});

describe('registry front matter parser (prettier-wrapped inline maps)', () => {
  it('re-joins an inline map that prettier wrapped across lines', () => {
    const fm = parseFrontMatter(`---
impact:
  - {
      target: lifetime.fi,
      status: in progress,
      note: strategy approved, phase A waiting,
    }
---
`);
    expect(fm.impact).toEqual([
      { target: 'lifetime.fi', status: 'in progress', note: 'strategy approved, phase A waiting' },
    ]);
  });
});

describe('pipeline view', () => {
  it('answers the four HIC questions from one signal and counts content vs offer impact', () => {
    const view = buildPipelineView([parseSignalFile('x.md', SAMPLE)]);
    expect(view.counters).toMatchObject({
      observed: 1,
      signals: 1,
      insights: 1,
      decisions: 1,
      implemented: 1,
      contentUpdates: 1,
      offerUpdates: 1,
      evaluated: 0,
    });
    expect(view.activeSignals[0]?.insight).toContain('less waste');
    expect(view.impact[0]?.rows.map((r) => r.status)).toEqual(['done', 'in progress', 'done']);
    expect(view.outcomes).toHaveLength(0);
  });

  it('keeps dismissed signals out of the active list but in the observed count', () => {
    const dismissed = parseSignalFile(
      'd.md',
      SAMPLE.replace('status: implemented', 'status: dismissed'),
    );
    const view = buildPipelineView([dismissed]);
    expect(view.counters.observed).toBe(1);
    expect(view.activeSignals).toHaveLength(0);
    expect(view.decisions).toHaveLength(0);
  });
});

describe('docs/market-signals registry', () => {
  it('loads the shipped registry and finds MS-2026-09-001 traceable to impact rows', async () => {
    const signals = await loadRegistry();
    const first = signals.find((s) => s.signal_id === 'MS-2026-09-001');
    expect(first).toBeDefined();
    expect(first?.insight).toBeTruthy();
    expect(first?.impact.length).toBeGreaterThanOrEqual(5);
    expect(first?.impact.map((r) => r.target)).toContain('lifetime.fi');
    expect(first?.timeline.observed_at).toBe('2026-09-23');
    expect(first?.timeline.decided_at).toBe('2026-09-24');
  });
});
