import type { ColorData } from '../../src/domain/color/color.repository';

export const makeColorData = (overrides: Partial<ColorData> = {}): ColorData => ({
  id: 'uuid-test-' + Math.random().toString(36).substr(2, 9),
  color: 'RED',
  isActive: true,
  createdAt: new Date('2026-05-06T10:00:00Z'),
  updatedAt: new Date('2026-05-06T10:00:00Z'),
  ...overrides,
});
