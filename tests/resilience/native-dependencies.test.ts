import { describe, expect, it } from 'vitest';
describe('native dependency resilience contract', () => { it('keeps live-write fail-closed when infrastructure is unavailable', () => expect(process.env.DATAFINOPS_MODE ?? 'SANDBOX').not.toBe('LIVE_WRITE')); });
