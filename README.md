# @cravatar/sdk

Client SDK for the public Cravatar avatar API. It only builds identities and `GET /avatar/{hash}` URLs. It does not claim domains, import rosters, or talk to the WordPress console.

Origin: `https://cravatar.com` (optional host `cn` → `https://cn.cravatar.com`).

## Identity contract (same as live origin)

| Kind | Normalize | Then |
|---|---|---|
| **Email** | `trim` + lowercase | `md5` or `sha256` of that string |
| **Public-service number** | digits only; strip `86` / `0086` / `086` **only when the remainder is 3–6 digits** (`110`, `12345`, `10086`) | same hash |
| **Personal 11-digit mobile** | digits only; **not** treated as a listed service number (no `86` strip into a short id) | you may still hash it; origin will not show a service badge |

The 44-number catalog lives on the origin. This client does not need that list to build a URL.

## Install

```bash
# from FeiCode
git clone https://feicode.com/Cravatar/cravatar-sdk.git
```

Node 18+:

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
| `host` | hostname | default apex; `'cn'` for the China edge |

## Tests

```bash
npm test
npm run test:php   # optional, needs php CLI
```

## License

MIT
