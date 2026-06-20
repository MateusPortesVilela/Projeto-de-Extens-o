<?php
/**
 * ORTOAPP - Bootstrap compartilhado dos endpoints JSON
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

/** Paciente de teste (João Silva) — ver seed.sql */
define('ORTOAPP_TEST_PATIENT_ID', '11111111-1111-1111-1111-111111111111');

function json_ok($data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $code = 400, ?string $detail = null): void
{
    $payload = ['ok' => false, 'erro' => $message];
    if ($detail !== null) {
        $payload['detalhe'] = $detail;
    }
    http_response_code($code);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_db(): mysqli
{
    global $conn;
    if (!$conn instanceof mysqli) {
        json_error(
            'Banco de dados indisponível. Verifique se o MySQL está rodando e importe schema.sql + seed.sql.',
            503
        );
    }
    return $conn;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return $_POST;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function difficulty_label(string $level): string
{
    return match ($level) {
        'beginner' => 'Iniciante',
        'intermediate' => 'Intermediário',
        'advanced' => 'Avançado',
        default => $level,
    };
}
