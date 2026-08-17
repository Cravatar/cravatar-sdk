import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import {
  hashIdentity,
  isPublicServiceNumber,
  looksLikeHash,
  normalizeEmail,
  normalizeIdentity,
  normalizeNumber,
} from '../src/index.js';

test('email is trim + lowercase then hashed by the shipped hasher', () => {
  const identity = normalizeEmail('  User@Example.COM ');
  assert.equal(identity, 'user@example.com');
  const digest = hashIdentity(identity, 'md5');
  assert.equal(digest, createHash('md5').update(identity, 'utf8').digest('hex'));
  const sha = hashIdentity(identity, 'sha256');
  assert.equal(sha, createHash('sha256').update(identity, 'utf8').digest('hex'));
});

test('public-service number strips +86 when remainder is a short service id', () => {
  assert.equal(normalizeNumber('+86 110'), '110');
  assert.equal(normalizeNumber('0086-12345'), '12345');
  assert.equal(normalizeNumber('10086'), '10086');
  assert.equal(isPublicServiceNumber('+86 110'), true);
  const identity = normalizeNumber(' 110 ');
  const digest = hashIdentity(identity);
  assert.equal(digest, createHash('md5').update(identity, 'utf8').digest('hex'));
});

test('personal 11-digit mobile is not a listed service number', () => {
  const mobile = normalizeNumber('13800138000');
  assert.equal(mobile, '13800138000');
  assert.equal(isPublicServiceNumber('13800138000'), false);
  assert.equal(isPublicServiceNumber('+86 13800138000'), false);
  assert.equal(normalizeNumber('+86 13800138000'), '13800138000');
  assert.equal(normalizeNumber('008613800138000'), '13800138000');
});

test('auto identity picks email vs number vs already-hashed digest', () => {
  assert.equal(normalizeIdentity('  Foo@Bar.COM '), 'foo@bar.com');
  assert.equal(normalizeIdentity('+86 119'), '119');
  const digest = hashIdentity('110');
  assert.equal(looksLikeHash(digest), true);
  assert.equal(normalizeIdentity(digest), digest);
});
