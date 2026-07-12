export type MeterName =
  | 'WORKSPACE'
  | 'MANAGED_SPEND'
  | 'OPTIMIZER_RUN'
  | 'EVIDENCE_STORAGE'
  | 'INTEGRATION'
  | 'ENTERPRISE_FEATURE';
export interface MeterEvent {
  readonly id: string;
  readonly tenantId: string;
  readonly meter: MeterName;
  readonly units: number;
  readonly occurredAt: string;
}
export function recordMeter(event: MeterEvent): MeterEvent {
  if (!event.id || !event.tenantId || event.units < 0) throw new TypeError('invalid meter event');
  return Object.freeze({ ...event });
}
