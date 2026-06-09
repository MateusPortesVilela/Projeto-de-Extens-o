<?php
// ============================================================
// CLIENTES — CRUD
// GET  → lista todos os clientes
// POST → cadastra novo cliente
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────
if ($method === 'GET') {
    $result = $conn->query("SELECT id_cliente, nome FROM clientes ORDER BY nome ASC");
    $clientes = [];
    while ($row = $result->fetch_assoc()) {
        $clientes[] = $row;
    }
    echo json_encode($clientes, JSON_UNESCAPED_UNICODE);

// ── POST ─────────────────────────────────────────────────────
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $nome = trim($data['nome'] ?? '');

    if (empty($nome)) {
        http_response_code(400);
        echo json_encode(['erro' => 'O nome do cliente é obrigatório.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (mb_strlen($nome) < 3) {
        http_response_code(400);
        echo json_encode(['erro' => 'O nome deve ter pelo menos 3 caracteres.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO clientes (nome) VALUES (?)");
    $stmt->bind_param('s', $nome);

    if ($stmt->execute()) {
        echo json_encode([
            'sucesso'    => true,
            'id_cliente' => (int)$conn->insert_id,
            'nome'       => $nome
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao cadastrar cliente.'], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
}

$conn->close();
