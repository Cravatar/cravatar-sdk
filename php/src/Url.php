<?php

declare(strict_types=1);

namespace Cravatar\Sdk;

final class Url
{
    public const DEFAULT_HOST = 'https://cravatar.com';
    public const CN_HOST = 'https://cn.cravatar.com';
    public const HK_HOST = 'https://hk.cravatar.com';
    public const EN_HOST = 'https://en.cravatar.com';

    /** @var list<string> */
    private const FORMATS = ['webp', 'avif', 'jpeg', 'jpg', 'png', 'gif'];

    /** @var list<string> */
    private const RATINGS = ['g', 'pg', 'r', 'x'];

    public static function resolveHost(string $host): string
    {
        $key = preg_replace('#^https?://#', '', rtrim($host, '/')) ?? $host;
        if ($key === 'cn' || $key === 'cn.cravatar.com') {
            return self::CN_HOST;
        }
        if ($key === 'hk' || $key === 'hk.cravatar.com') {
            return self::HK_HOST;
        }
        if ($key === 'en' || $key === 'en.cravatar.com') {
            return self::EN_HOST;
        }
        if ($key === 'www' || $key === 'www.cravatar.com') {
            return 'https://www.cravatar.com';
        }
        if ($key === '' || $key === 'default' || $key === 'cravatar.com') {
            return self::DEFAULT_HOST;
        }

        return rtrim($host, '/');
    }

    public static function clampSize(int $size): int
    {
        return min(2000, max(10, $size));
    }

    /**
     * @param array{
     *   kind?:string,algorithm?:string,size?:int,s?:int,default?:string,d?:string,
     *   forceDefault?:bool|string,f?:mixed,rating?:string,r?:string,format?:string,host?:string
     * } $options
     */
    public static function avatar(string $raw, array $options = []): string
    {
        $kind = $options['kind'] ?? 'auto';
        $algorithm = ($options['algorithm'] ?? 'md5') === 'sha256' ? 'sha256' : 'md5';
        if ($kind === 'hash' || ($kind === 'auto' && Identity::looksLikeHash($raw))) {
            $hash = strtolower(trim($raw));
        } else {
            $hash = Hash::identity(Identity::normalizeIdentity($raw, $kind), $algorithm);
        }
        if ($hash === '') {
            return '';
        }

        $size = self::clampSize((int) ($options['size'] ?? $options['s'] ?? 80));
        $host = self::resolveHost((string) ($options['host'] ?? ''));
        $ext = self::formatExtension((string) ($options['format'] ?? ''));
        $query = ['s' => (string) $size];

        $def = $options['default'] ?? $options['d'] ?? null;
        if (is_string($def) && $def !== '') {
            $query['d'] = $def;
        }

        $force = $options['forceDefault'] ?? $options['forcedefault'] ?? $options['f'] ?? null;
        if ($force === true || in_array($force, ['y', 'yes', '1', 'true'], true)) {
            $query['f'] = 'y';
        }

        $rating = strtolower((string) ($options['rating'] ?? $options['r'] ?? ''));
        if (in_array($rating, self::RATINGS, true)) {
            $query['r'] = $rating;
        }

        return $host . '/avatar/' . $hash . $ext . '?' . http_build_query($query);
    }

    private static function formatExtension(string $format): string
    {
        $ext = strtolower(ltrim($format, '.'));
        if ($ext === 'jpg') {
            $ext = 'jpeg';
        }
        if ($ext === '' || ! in_array($ext, self::FORMATS, true)) {
            return '';
        }

        return '.' . $ext;
    }
}
