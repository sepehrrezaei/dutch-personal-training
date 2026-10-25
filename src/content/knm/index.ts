import type { KnmTheme } from '../schema';
import { knmA } from './knmA';

export const KNM: KnmTheme[] = [...knmA];

export function getKnm(id: string): KnmTheme | undefined {
  return KNM.find((k) => k.id === id);
}
