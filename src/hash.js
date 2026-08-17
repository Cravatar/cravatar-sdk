import { createHash } from 'node:crypto';

export function hashIdentity(identity, algorithm = 'md5') {
  const value = String(identity ?? '');
  if (value === '') {
    return '';
  }
  const algo = algorithm === 'sha256' ? 'sha256' : 'md5';
  return createHash(algo).update(value, 'utf8').digest('hex');
}
