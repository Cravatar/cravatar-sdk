#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { avatarUrl } from '../src/index.js';

const out = process.env.SCRATCH_OUT || process.argv[2] || '';
const url = avatarUrl('110', { kind: 'number', size: 261 });

let text = `url=${url}\n`;
try {
  const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
  const from = res.headers.get('avatar-from') || '';
  text += `status=${res.status}\n`;
  text += `avatar-from=${from}\n`;
  for (const [k, v] of res.headers.entries()) {
    text += `${k}: ${v}\n`;
  }
  const ok = res.status === 200 && from === 'public';
  text += `ok=${ok}\n`;
  process.stdout.write(text);
  if (out) {
    writeFileSync(out, text);
  }
  process.exit(ok ? 0 : 1);
} catch (err) {
  text += `error=${err instanceof Error ? err.message : String(err)}\n`;
  process.stdout.write(text);
  if (out) {
    writeFileSync(out, text);
  }
  process.exit(0);
}
