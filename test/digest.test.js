import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { hashIdentity } from '../src/index.js';

test('portable hasher matches Node crypto on email, number, and CJK', () => {
  for (const sample of ['110', 'user@example.com', '中文', '+86 110']) {
    assert.equal(
      hashIdentity(sample, 'md5'),
      createHash('md5').update(sample, 'utf8').digest('hex'),
    );
    assert.equal(
      hashIdentity(sample, 'sha256'),
      createHash('sha256').update(sample, 'utf8').digest('hex'),
    );
  }
});

test('hash implementation does not import node:crypto', () => {
  const root = dirname(fileURLToPath(import.meta.url));
  const hashSrc = readFileSync(join(root, '../src/hash.js'), 'utf8');
  const digestSrc = readFileSync(join(root, '../src/digest.js'), 'utf8');
  assert.equal(/from ['"]node:crypto['"]/.test(hashSrc), false);
  assert.equal(/from ['"]node:crypto['"]/.test(digestSrc), false);
  assert.equal(/require\(['"]crypto['"]\)/.test(hashSrc + digestSrc), false);
});
