<?php

declare(strict_types=1);

namespace Cravatar\Sdk;

final class Identity
{
    public static function normalizeEmail(string $raw): string
    {
        return strtolower(trim($raw));
    }

    public static function digitsOnly(string $raw): string
    {
        return preg_replace('/\D+/', '', $raw) ?? '';
    }

    public static function stripCountryCode(string $digits): string
    {
        foreach (['0086', '086', '86'] as $prefix) {
            if (str_starts_with($digits, $prefix) && strlen($digits) > strlen($prefix)) {
                return substr($digits, strlen($prefix));
            }
        }

        return $digits;
    }

    public static function normalizeNumber(string $raw): string
    {
        $num = self::digitsOnly($raw);
        if ($num === '') {
            return '';
        }
        $stripped = self::stripCountryCode($num);
        if (strlen($stripped) >= 3 && strlen($stripped) <= 6) {
            return $stripped;
        }

        return $num;
    }

    public static function isPublicServiceNumber(string $raw): bool
    {
        $n = self::normalizeNumber($raw);
        $len = strlen($n);

        return $len >= 3 && $len <= 6;
    }

    public static function normalizeIdentity(string $raw, string $kind = 'auto'): string
    {
        if ($kind === 'email' || ($kind === 'auto' && str_contains($raw, '@'))) {
            return self::normalizeEmail($raw);
        }

        return self::normalizeNumber($raw);
    }
}
