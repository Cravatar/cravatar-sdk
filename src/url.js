import { hashIdentity } from './hash.js';
import { looksLikeHash, normalizeIdentity } from './identity.js';

export const DEFAULT_HOST = 'https://cravatar.com';
export const CN_HOST = 'https://cn.cravatar.com';
export const HK_HOST = 'https://hk.cravatar.com';
export const EN_HOST = 'https://en.cravatar.com';

const FORMATS = new Set(['webp', 'avif', 'jpeg', 'jpg', 'png', 'gif']);
const RATINGS = new Set(['g', 'pg', 'r', 'x']);

export function resolveHost(host) {
  const key = String(host ?? '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (key === 'cn' || key === 'cn.cravatar.com') {
    return CN_HOST;
  }
  if (key === 'hk' || key === 'hk.cravatar.com') {
    return HK_HOST;
  }
  if (key === 'en' || key === 'en.cravatar.com') {
    return EN_HOST;
  }
  if (key === 'www' || key === 'www.cravatar.com') {
    return 'https://www.cravatar.com';
  }
  if (!key || key === 'default' || key === 'cravatar.com') {
    return DEFAULT_HOST;
  }
  if (/^https?:\/\//i.test(String(host))) {
    return String(host).replace(/\/$/, '');
  }
  return String(host).replace(/\/$/, '');
}

export function clampSize(size) {
  const n = Number.parseInt(String(size ?? 80), 10);
  if (!Number.isFinite(n)) {
    return 80;
  }
  return Math.min(2000, Math.max(10, n));
}

function formatExtension(format) {
  if (format == null || format === '') {
    return '';
  }
  let ext = String(format).toLowerCase().replace(/^\./, '');
  if (ext === 'jpg') {
    ext = 'jpeg';
  }
  if (!FORMATS.has(ext) && ext !== 'jpeg') {
    return '';
  }
  return '.' + (ext === 'jpeg' ? 'jpeg' : ext);
}

/**
 * Build GET /avatar/{hash} against a live host.
 * Honors origin knobs: s/size, d/default, f/forcedefault, r/rating, optional format extension.
 */
export function avatarUrl(raw, options = {}) {
  const kind = options.kind ?? 'auto';
  const algorithm = options.algorithm === 'sha256' ? 'sha256' : 'md5';
  let hash;
  if (kind === 'hash' || (kind === 'auto' && looksLikeHash(raw))) {
    hash = String(raw ?? '').toLowerCase().trim();
  } else {
    const identity = normalizeIdentity(raw, kind);
    hash = hashIdentity(identity, algorithm);
  }
  if (hash === '') {
    return '';
  }

  const size = clampSize(options.size ?? options.s ?? 80);
  const host = resolveHost(options.host);
  const ext = formatExtension(options.format);
  const params = new URLSearchParams();
  params.set('s', String(size));

  const def = options.default ?? options.d;
  if (def != null && String(def) !== '') {
    params.set('d', String(def));
  }

  const force = options.forceDefault ?? options.forcedefault ?? options.f;
  if (force === true || force === 'y' || force === 'yes' || force === '1' || force === 'true') {
    params.set('f', 'y');
  }

  const rating = String(options.rating ?? options.r ?? '').toLowerCase();
  if (RATINGS.has(rating)) {
    params.set('r', rating);
  }

  return `${host}/avatar/${hash}${ext}?${params.toString()}`;
}
