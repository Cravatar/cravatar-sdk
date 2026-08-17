#!/usr/bin/env node
/**
 * Throwaway-style consumer: import the published entry, not test/*.test.js.
 */
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { avatarUrl, hashIdentity, normalizeEmail, normalizeNumber } from '../src/index.js';

const out = process.env.SCRATCH_OUT || process.argv[2] || '';

const numberIdentity = normalizeNumber('110');
const numberDigest = hashIdentity(numberIdentity);
const numberUrl = avatarUrl('110', { kind: 'number', size: 261 });
const expectedNumber = createHash('md5').update(numberIdentity, 'utf8').digest('hex');

const emailIdentity = normalizeEmail('User@Example.COM');
const emailDigest = hashIdentity(emailIdentity);
const emailUrl = avatarUrl('User@Example.COM', { kind: 'email', size: 80 });
const expectedEmail = createHash('md5').update(emailIdentity, 'utf8').digest('hex');

const lines = [
  `number.identity=${numberIdentity}`,
  `number.digest=${numberDigest}`,
  `number.expected=${expectedNumber}`,
  `number.url=${numberUrl}`,
  `number.hasAvatar=${numberUrl.includes('/avatar/')}`,
  `number.hasDigest=${numberUrl.includes(numberDigest)}`,
  `email.identity=${emailIdentity}`,
  `email.digest=${emailDigest}`,
  `email.expected=${expectedEmail}`,
  `email.url=${emailUrl}`,
  `email.hasAvatar=${emailUrl.includes('/avatar/')}`,
  `email.hasDigest=${emailUrl.includes(emailDigest)}`,
];

const ok =
  numberDigest === expectedNumber &&
  emailDigest === expectedEmail &&
  numberUrl.includes('/avatar/') &&
  numberUrl.includes(numberDigest) &&
  emailUrl.includes('/avatar/') &&
  emailUrl.includes(emailDigest);

lines.push(`ok=${ok}`);
const text = lines.join('\n') + '\n';
process.stdout.write(text);
if (out) {
  writeFileSync(out, text);
}
process.exit(ok ? 0 : 1);
