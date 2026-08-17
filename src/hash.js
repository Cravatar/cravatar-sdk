import { md5Hex, sha256Hex } from './digest.js';

export function hashIdentity(identity, algorithm = 'md5') {
  const value = String(identity ?? '');
  if (value === '') {
    return '';
  }
  return algorithm === 'sha256' ? sha256Hex(value) : md5Hex(value);
}
