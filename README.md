# @cravatar/sdk

Client SDK for the public Cravatar avatar API. It only builds identities and `GET /avatar/{hash}` URLs. It does not claim domains, import rosters, or talk to the WordPress console.

Origin: `https://cravatar.com` (optional host `cn` → `https://cn.cravatar.com`).

## Identity contract (same as live origin)

| Kind | Normalize | Then |
|---|---|---|
| **Email** | `trim` + lowercase | `md5` or `sha256` of that string |
| **Public-service number** | digits only; strip `86` / `0086` / `086` **only when the remainder is 3–6 digits** (`110`, `12345`, `10086`) | same hash |
| **Personal 11-digit mobile** | digits only; `+86`/`0086` stripped when the remainder is `1` + 10 digits; **not** a listed service number | you may still hash the 11 digits; origin will not show a service badge |

The 44-number catalog lives on the origin. This client does not need that list to build a URL.

## Install

```bash
git clone https://feicode.com/Cravatar/cravatar-sdk.git
# or: npm install git+ssh://git@feicode.com:2222/Cravatar/cravatar-sdk.git
```

Works in Node and in browsers (no `node:crypto` import). Default hash is portable md5.

```js
import { avatarUrl, isPublicServiceNumber, normalizeEmail, normalizeNumber } from '@cravatar/sdk';
// or: import { avatarUrl } from './src/index.js'

avatarUrl('User@Example.COM', { size: 80 });
avatarUrl('+86 110', { kind: 'number', size: 256 });
isPublicServiceNumber('13800138000'); // false
```

PHP (same contract, no Composer required):

```php
require 'php/src/autoload.php';
echo Cravatar\Sdk\Url::avatar('+86 110', ['kind' => 'number', 'size' => 256]);
```

## URL knobs (origin already honors these)

| Option | Query / path | Notes |
|---|---|---|
| `size` / `s` | `?s=` | clamped 10–2000, default 80 |
| `default` / `d` | `?d=` | e.g. `404`, `mp` |
| `forceDefault` / `f` | `?f=y` | force default image |
| `rating` / `r` | `?r=` | `g`, `pg`, `r`, `x` |
| `format` | `/{hash}.png` | `webp`, `png`, `jpeg`, `gif`, `avif` |
| `algorithm` | hash length | `md5` (32) or `sha256` (64) |
| `host` | hostname | default apex; `'cn'` / `'hk'` / `'en'` / `'www'` |

## Tests

```bash
npm test
npm run test:php   # optional, needs php CLI
```

## License

MIT
