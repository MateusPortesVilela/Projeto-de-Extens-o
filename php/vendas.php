<?php
// ============================================================
// VENDAS — Registro e Listagem
// GET  → lista vendas de uma data com totais
// POST → registra nova venda com itens (limite: 50/dia)
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
    $data = $_GET['data'] ?? date('Y-m-d');

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) {
        http_response_code(400);
        echo json_encode(['erro' => 'Formato de data inválido. Use YYYY-MM-DD.']);
        exit;
    }

    $sql = "SELECT v.id_venda, v.data, c.nome AS cliente,
                   SUM(iv.valor_total + iv.taxa_devolucao) AS total_venda
            FROM vendas v
            JOIN clientes c    ON v.id_cliente  = c.id_cliente
            JOIN itens_venda iv ON v.id_venda   = iv.id_venda
            WHERE v.data = ?
            GROUP BY v.id_venda, v.data, c.nome
            ORDER BY v.id_venda DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $data);
    $stmt->execute();
    $result = $stmt->get_result();

    $vendas = [];
    while ($row = $result->fetch_assoc()) {
        $row['total_venda'] = round((float)$row['total_venda'], 2);
        $vendas[] = $row;
    }
    $stmt->close();

    $quantidade = count($vendas);
    $total_dia  = array_sum(array_column($vendas, 'total_venda'));

    echo json_encode([
        'vendas'     => $vendas,
        'quantidade' => $quantidade,
        'total_dia'  => round($total_dia, 2),
        'limite'     => 50,
        'restante'   => max(0, 50 - $quantidade)
    ], JSON_UNESCAPED_UNICODE);

// ── POST ─────────────────────────────────────────────────────
} elseif ($method === 'POST') {
    $input      = json_decode(file_get_contents('php://input'), true);
    $id_cliente = intval($input['id_cliente'] ?? 0);
    $itens      = $input['itens'] ?? [];
    $hoje       = date('Y-m-d');

    // Validações
    if ($id_cliente <= 0) {
        http_response_code(400);
        echo json_encode(['erro' => 'Cliente inválido.'], JSON_UNESCAPED_UNICODE); exit;
    }
    if (empty($itens)) {
        http_response_code(400);
        echo json_encode(['erro' => 'A venda deve ter pelo menos um item.'], JSON_UNESCAPED_UNICODE); exit;
    }

    // Verificar se cliente existe
    $stmtC = $conn->prepare("SELECT id_cliente FROM clientes WHERE id_cliente = ?");
    $stmtC->bind_param('i', $id_cliente);
    $stmtC->execute();
    if (!$stmtC->get_result()->fetch_assoc()) {
        http_response_code(400);
        echo json_encode(['erro' => 'Cliente não encontrado no sistema.'], JSON_UNESCAPED_UNICODE); exit;
    }
    $stmtC->close();

    // ⚠️ REGRA: Limite de 50 vendas por dia
    $stmtLim = $conn->prepare("SELECT COUNT(*) AS total FROM vendas WHERE data = ?");
    $stmtLim->bind_param('s', $hoje);
    $stmtLim->execute();
    $count = (int)$stmtLim->get_result()->fetch_assoc()['total'];
    $stmtLim->close();

    if ($count >= 50) {
        http_response_code(429);
        echo json_encode([
            'erro' => 'Limite diário de 50 vendas atingido. Não é possível registrar novas vendas hoje.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Transação
    $conn->begin_transaction();
    try {
        // Inserir cabeçalho da venda
        $stmtV = $conn->prepare("INSERT INTO vendas (id_cliente, data) VALUES (?, ?)");
        $stmtV->bind_param('is', $id_cliente, $hoje);
        $stmtV->execute();
        $id_venda    = (int)$conn->insert_id;
        $total_venda = 0.0;
        $stmtV->close();

        // Inserir cada item
        foreach ($itens as $item) {
            $id_produto = intval($item['id_produto'] ?? 0);
            $quantidade = intval($item['quantidade'] ?? 0);

            if ($id_produto <= 0 || $quantidade <= 0) {
                throw new Exception("Item inválido: produto=$id_produto, qtd=$quantidade.");
            }

            // Pegar preço atual do produto
            $stmtP = $conn->prepare("SELECT preco FROM produtos WHERE id_produto = ?");
            $stmtP->bind_param('i', $id_produto);
            $stmtP->execute();
            $prod = $stmtP->get_result()->fetch_assoc();
            $stmtP->close();

            if (!$prod) throw new Exception("Produto ID $id_produto não encontrado.");

            $valor_total  = round((float)$prod['preco'] * $quantidade, 2);
            $total_venda += $valor_total;

            $stmtI = $conn->prepare(
                "INSERT INTO itens_venda (id_venda, id_produto, quantidade, valor_total) VALUES (?, ?, ?, ?)"
            );
            $stmtI->bind_param('iiid', $id_venda, $id_produto, $quantidade, $valor_total);
            $stmtI->execute();
            $stmtI->close();
        }

        $conn->commit();
        echo json_encode([
            'sucesso'  => true,
            'id_venda' => $id_venda,
            'total'    => round($total_venda, 2),
            'restante' => max(0, 49 - $count)
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['erro' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
    }

} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
}

$conn->close();
