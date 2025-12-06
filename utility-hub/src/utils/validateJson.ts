import { Config } from '@/types/config';

export function validateConfigJson(json: any): { valid: boolean; error?: string } {
  if (
    typeof json !== 'object' ||
    typeof json.version !== 'number' ||
    typeof json.lastUpdated !== 'string' ||
    typeof json.data !== 'object'
  ) {
    return { valid: false, error: 'Invalid config schema.' };
  }
  return { valid: true };
}
