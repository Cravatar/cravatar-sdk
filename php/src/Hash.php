<?php

declare(strict_types=1);

namespace Cravatar\Sdk;

final class Hash
{
    public static function identity(string $identity, string $algorithm = 'md5'): string
    {
        if ($identity === '') {
            return '';
        }

        return $algorithm === 'sha256' ? hash('sha256', $identity) : md5($identity);
    }
}
