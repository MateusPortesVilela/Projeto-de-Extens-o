<?php
// ============================================================
// DEVOLUÇÕES — Controle e Taxa
// GET  → lista itens com informações de devolução
// POST → registra devolução e aplica taxa R$20 na 2ª vez
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
    $sql = "SELECT
                iv.id_item,
                iv.id_venda,
                iv.quantidade,
                iv.valor_total,
                iv.devolucoes,
                iv.taxa_devolucao,
                p.nome  AS produto,
                c.nome  AS cliente,
                v.data
            FROM itens_venda  iv
            JOIN vendas   v  ON iv.id_venda   = v.id_venda
            JOIN clientes c  ON v.id_cliente  = c.id_cliente
            JOIN produtos p  ON iv.id_produto = p.id_produto
            ORDER BY v.data DESC, iv.id_venda DESC, iv.id_item DESC
            LIMIT 300";

    $result = $conn->query($sql);
    $itens  = [];
    while ($row = $result->fetch_assoc()) {
        $row['id_item']        = (int)$row['id_item'];
        $row['id_venda']       = (int)$row['id_venda'];
        $row['quantidade']     = (int)$row['quantidade'];
        $row['valor_total']    = (float)$row['valor_total'];
        $row['devolucoes']     = (int)$row['devolucoes'];
        $row['taxa_devolucao'] = (float)$row['taxa_devolucao'];
        $itens[] = $row;
    }
    echo json_encode($itens, JSON_UNESCAPED_UNICODE);

// ── POST ─────────────────────────────────────────────────────
} elseif ($method === 'POST') {
    $input   = json_decode(file_get_contents('php://input'), true);
    $id_item = intval($input['id_item'] ?? 0);

    if ($id_item <= 0) {
        http_response_code(400);
        echo json_encode(['erro' => 'ID do item inválido.'], JSON_UNESCAPED_UNICODE); exit;
    }

    // Buscar dados atuais do item
    $stmt = $conn->prepare("SELECT * FROM itens_venda WHERE id_item = ?");
    $stmt->bind_param('i', $id_item);
    $stmt->execute();
    $item = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$item) {
        http_response_code(404);
        echo json_encode(['erro' => 'Item não encontrado.'], JSON_UNESCAPED_UNICODE); exit;
    }

    $novas_devolucoes = (int)$item['devolucoes'] + 1;
    $taxa             = (float)$item['taxa_devolucao'];
    $mensagem         = '';

    // ⚠️ REGRA DE NEGÓCIO: Taxa de R$20 na 2ª devolução do mesmo item
    if ($novas_devolucoes === 2) {
        $taxa    += 20.00;
        $mensagem = '⚠️ 2ª devolução detectada! Taxa de R$ 20,00 aplicada (despesas de transportadora).';
    } elseif ($novas_devolucoes === 1) {
        $mensagem = 'ℹ️ 1ª devolução registrada. Atenção: a próxima devolução deste item gerará uma taxa de R$ 20,00.';
    } else {
        $mensagem = "Devolução #{$novas_devolucoes} registrada para o item.";
    }

    $stmtUpd = $conn->prepare(
        "UPDATE itens_venda SET devolucoes = ?, taxa_devolucao = ? WHERE id_item = ?"
    );
    $stmtUpd->bind_param('idi', $novas_devolucoes, $taxa, $id_item);

    if ($stmtUpd->execute()) {
        echo json_encode([
            'sucesso'        => true,
            'id_item'        => $id_item,
            'devolucoes'     => $novas_devolucoes,
            'taxa_devolucao' => $taxa,
            'mensagem'       => $mensagem
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(['erro' => 'Erro interno ao registrar devolução.'], JSON_UNESCAPED_UNICODE);
    }
    $stmtUpd->close();

} else {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
}

$conn->close();
