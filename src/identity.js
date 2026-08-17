/**
 * Live contract (origin LookupPipeline / public-number-identity.md):
 * - email: trim + lowercase, then md5/sha256
 * - public-service number: digits only; strip 86/0086/086 when remainder is 3–6 digits
 * - personal 11-digit mobile is not a listed service number
 */

export function normalizeEmail(raw) {
  return String(raw ?? '').trim().toLowerCase();
}

export function digitsOnly(raw) {
  return String(raw ?? '').replace(/\D+/g, '');
}

export function stripCountryCode(digits) {
  const num = String(digits ?? '');
  for (const prefix of ['0086', '086', '86']) {
    if (num.startsWith(prefix) && num.length > prefix.length) {
      return num.slice(prefix.length);
    }
  }
  return num;
}

export function isMainlandMobile(digits) {
  return /^1\d{10}$/.test(String(digits ?? ''));
}

export function looksLikeHash(raw) {
  return /^(?:[a-f0-9]{32}|[a-f0-9]{64})$/i.test(String(raw ?? '').trim());
}

export function normalizeNumber(raw) {
  const num = digitsOnly(raw);
  if (num === '') {
    return '';
  }
  const stripped = stripCountryCode(num);
  if (stripped.length >= 3 && stripped.length <= 6) {
    return stripped;
  }
  if (isMainlandMobile(stripped)) {
    return stripped;
  }
  return num;
}

/** Origin only treats 3–6 digit identities as public-service numbers. */
export function isPublicServiceNumber(raw) {
  const n = normalizeNumber(raw);
  return n.length >= 3 && n.length <= 6;
}

export function normalizeIdentity(raw, kind = 'auto') {
  const text = String(raw ?? '');
  if (kind === 'hash' || (kind === 'auto' && looksLikeHash(text))) {
    return String(text).trim().toLowerCase();
  }
  if (kind === 'email' || (kind === 'auto' && text.includes('@'))) {
    return normalizeEmail(text);
  }
  if (kind === 'number' || kind === 'auto') {
    return normalizeNumber(text);
  }
  return text.trim();
}
