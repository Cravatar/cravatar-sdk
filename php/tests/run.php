<?php

declare(strict_types=1);

require dirname(__DIR__) . '/src/autoload.php';

use Cravatar\Sdk\Hash;
use Cravatar\Sdk\Identity;
use Cravatar\Sdk\Url;

$failed = 0;
$passed = 0;

function check(string $name, bool $ok): void
{
    global $failed, $passed;
    if ($ok) {
        ++$passed;
        echo "ok  {$name}\n";
        return;
    }
    ++$failed;
    echo "not ok  {$name}\n";
}

$email = Identity::normalizeEmail('  User@Example.COM ');
check('email normalize', $email === 'user@example.com');
check('email md5 is shipped hasher vs php md5', Hash::identity($email) === md5($email));
check('email sha256 is shipped hasher vs php hash', Hash::identity($email, 'sha256') === hash('sha256', $email));

check('number +86 110', Identity::normalizeNumber('+86 110') === '110');
check('110 is public service', Identity::isPublicServiceNumber('+86 110') === true);

$mobile = Identity::normalizeNumber('13800138000');
check('11-digit mobile stays 11 digits', $mobile === '13800138000');
check('11-digit mobile is not public service', Identity::isPublicServiceNumber('13800138000') === false);

$url = Url::avatar('User@Example.COM', ['kind' => 'email', 'size' => 128]);
$digest = Hash::identity(Identity::normalizeEmail('User@Example.COM'));
check('email url has /avatar/', str_contains($url, '/avatar/'));
check('email url has shipped digest', str_contains($url, $digest));

$nurl = Url::avatar('+86 110', ['kind' => 'number', 'algorithm' => 'sha256', 'size' => 256, 'host' => 'cn']);
$ndigest = Hash::identity(Identity::normalizeNumber('+86 110'), 'sha256');
check('number url has digest', str_contains($nurl, $ndigest));
check('number url uses cn host', str_starts_with($nurl, Url::CN_HOST));

echo $failed === 0 ? "PASS {$passed}\n" : "FAIL {$failed} failed, {$passed} passed\n";
exit($failed === 0 ? 0 : 1);
