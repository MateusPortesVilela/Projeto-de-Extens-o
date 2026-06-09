<?php
// ============================================================
// PRODUTOS — CRUD
// GET  → lista todos os produtos
// POST → cadastra novo produto
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
    $result = $conn->query("SELECT id_produto, nome, preco FROM produtos ORDER BY nome ASC");
    $produtos = [];
    while ($row = $result->fetch_assoc()) {
        $row['preco'] = (float)$row['preco'];
        $produtos[] = $row;
    }
    echo json_encode($produtos, JSON_UNESCAPED_UNICODE);

// ── POST ─────────────────────────────────────────────────────
} elseif ($method === 'POST') {
    $data  = json_decode(file_get_contents('php://input'), true);
    $nome  = trim($data['nome'] ?? '');
    $preco = floatval($data['preco'] ?? 0);

    if (empty($nome)) {
        http_response_code(400);
        echo json_encode(['erro' => 'O nome do produto é obrigatório.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (mb_strlen($nome) < 2) {
        http_response_code(400);
        echo json_encode(['erro' => 'O nome deve ter pelo menos 2 caracteres.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($preco <= 0) {
        http_response_code(400);
        echo json_encode(['erro' => 'O preço deve ser maior que zero.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO produtos (nome, preco) VALUES (?, ?)");
    $stmt->bind_param('sd', $nome, $preco);

    if ($stmt->execute()) {
        echo json_encode([
            'sucesso'    => true,
            'id_produto' => (int)$conn->insert_id,
            'nome'       => $nome,
            'preco'      => $preco
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro ao cadastrar produto.'], JSON_UNESCAPED_UNICODE);
    }
    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
}

$conn->close();
