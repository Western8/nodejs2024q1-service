import { createHash } from 'node:crypto';

export function isUUID(uuid: string): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export function getHash(data: string): string {
  const hash = createHash('sha256');
  hash.update(data);
  const dataHash = hash.digest('hex');
  return dataHash;
}
