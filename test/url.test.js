import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import {
  CN_HOST,
  DEFAULT_HOST,
  avatarUrl,
  clampSize,
  hashIdentity,
  normalizeEmail,
  normalizeNumber,
} from '../src/index.js';

test('email URL path is /avatar/ plus shipped digest', () => {
  const identity = normalizeEmail('User@Example.COM');
  const digest = hashIdentity(identity);
  const url = avatarUrl('User@Example.COM', { kind: 'email', size: 128 });
  assert.ok(url.startsWith(DEFAULT_HOST + '/avatar/'));
  assert.ok(url.includes(digest));
  assert.ok(url.includes('s=128'));
  assert.equal(digest, createHash('md5').update(identity, 'utf8').digest('hex'));
});

test('number URL uses normalized digits and origin query knobs', () => {
  const identity = normalizeNumber('+86 110');
  const digest = hashIdentity(identity, 'sha256');
  const url = avatarUrl('+86 110', {
    kind: 'number',
    algorithm: 'sha256',
    size: 256,
    default: '404',
    forceDefault: false,
    rating: 'g',
    format: 'png',
    host: 'cn',
  });
  assert.ok(url.startsWith(CN_HOST + '/avatar/'));
  assert.ok(url.includes(digest + '.png'));
  assert.ok(url.includes('s=256'));
  assert.ok(url.includes('d=404'));
  assert.ok(url.includes('r=g'));
  assert.equal(false, url.includes('f=y'));
});

test('forceDefault and size aliases match origin knobs', () => {
  const url = avatarUrl('110', { kind: 'number', s: 80, f: 'y', r: 'pg' });
  assert.ok(url.includes('f=y'));
  assert.ok(url.includes('r=pg'));
  assert.equal(clampSize(3), 10);
  assert.equal(clampSize(9000), 2000);
});

test('empty identity yields empty URL', () => {
  assert.equal(avatarUrl(''), '');
  assert.equal(avatarUrl('abc', { kind: 'number' }), '');
});
