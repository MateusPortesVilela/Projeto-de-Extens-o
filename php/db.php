<?php
// ============================================================
// CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS
// ============================================================

if (file_exists(__DIR__ . '/config.local.php')) {
    require_once __DIR__ . '/config.local.php';
}

if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_NAME')) define('DB_NAME', 'ortoapp');
if (!defined('DB_PORT')) define('DB_PORT', 3306);

function ortoapp_get_db(): ?mysqli
{
    static $connection = null;
    static $failed = false;

    if ($failed) {
        return null;
    }

    if ($connection instanceof mysqli) {
        return $connection;
    }

    $connection = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($connection->connect_error) {
        $failed = true;
        $connection = null;
        return null;
    }

    $connection->set_charset('utf8mb4');
    return $connection;
}

$conn = ortoapp_get_db();
