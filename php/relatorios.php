<?php
// ============================================================
// RELATÓRIOS — Diário, Mensal e Anual
// GET ?tipo=diario&data=YYYY-MM-DD
// GET ?tipo=mensal&ano=YYYY
// GET ?tipo=anual&ano=YYYY   (meses em ordem decrescente de faturamento)
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

$tipo = $_GET['tipo'] ?? 'diario';

// ── RELATÓRIO DIÁRIO ─────────────────────────────────────────
if ($tipo === 'diario') {
    $data = $_GET['data'] ?? date('Y-m-d');

    $sql = "SELECT
                v.id_venda,
                c.nome        AS cliente,
                p.nome        AS produto,
                iv.quantidade,
                iv.valor_total,
                iv.devolucoes,
                iv.taxa_devolucao,
                (iv.valor_total + iv.taxa_devolucao) AS total_item
            FROM vendas v
            JOIN clientes    c  ON v.id_cliente  = c.id_cliente
            JOIN itens_venda iv ON v.id_venda    = iv.id_venda
            JOIN produtos    p  ON iv.id_produto = p.id_produto
            WHERE v.data = ?
            ORDER BY v.id_venda ASC, iv.id_item ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $data);
    $stmt->execute();
    $result = $stmt->get_result();

    // Agrupar por pedido
    $pedidos = [];
    while ($row = $result->fetch_assoc()) {
        $id = (int)$row['id_venda'];
        if (!isset($pedidos[$id])) {
            $pedidos[$id] = ['id_venda' => $id, 'cliente' => $row['cliente'], 'itens' => [], 'total' => 0.0];
        }
        $ti = round((float)$row['total_item'], 2);
        $pedidos[$id]['itens'][] = [
            'produto'        => $row['produto'],
            'quantidade'     => (int)$row['quantidade'],
            'valor_total'    => round((float)$row['valor_total'], 2),
            'devolucoes'     => (int)$row['devolucoes'],
            'taxa_devolucao' => round((float)$row['taxa_devolucao'], 2),
            'total_item'     => $ti
        ];
        $pedidos[$id]['total'] += $ti;
    }
    $stmt->close();

    $pedidos_arr = array_values($pedidos);
    $total_dia   = array_sum(array_column($pedidos_arr, 'total'));

    echo json_encode([
        'data'              => $data,
        'pedidos'           => $pedidos_arr,
        'total_dia'         => round($total_dia, 2),
        'quantidade_vendas' => count($pedidos_arr)
    ], JSON_UNESCAPED_UNICODE);

// ── RELATÓRIO MENSAL ─────────────────────────────────────────
} elseif ($tipo === 'mensal') {
    $ano = intval($_GET['ano'] ?? date('Y'));

    $sql = "SELECT
                MONTH(v.data)              AS mes,
                COUNT(DISTINCT v.id_venda) AS quantidade_vendas,
                SUM(iv.valor_total + iv.taxa_devolucao) AS total_mes
            FROM vendas v
            JOIN itens_venda iv ON v.id_venda = iv.id_venda
            WHERE YEAR(v.data) = ?
            GROUP BY MONTH(v.data)
            ORDER BY MONTH(v.data) ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $ano);
    $stmt->execute();
    $result = $stmt->get_result();

    $meses = []; $total_anual = 0.0;
    while ($row = $result->fetch_assoc()) {
        $row['mes']              = (int)$row['mes'];
        $row['quantidade_vendas']= (int)$row['quantidade_vendas'];
        $row['total_mes']        = round((float)$row['total_mes'], 2);
        $meses[]                 = $row;
        $total_anual            += $row['total_mes'];
    }
    $stmt->close();

    echo json_encode([
        'ano'         => $ano,
        'meses'       => $meses,
        'total_anual' => round($total_anual, 2)
    ], JSON_UNESCAPED_UNICODE);

// ── RELATÓRIO ANUAL ──────────────────────────────────────────
// Meses ordenados de forma DECRESCENTE por faturamento
} elseif ($tipo === 'anual') {
    $ano = intval($_GET['ano'] ?? date('Y'));

    $sql = "SELECT
                MONTH(v.data)              AS mes,
                COUNT(DISTINCT v.id_venda) AS quantidade_vendas,
                SUM(iv.valor_total + iv.taxa_devolucao) AS total_mes
            FROM vendas v
            JOIN itens_venda iv ON v.id_venda = iv.id_venda
            WHERE YEAR(v.data) = ?
            GROUP BY MONTH(v.data)
            ORDER BY total_mes DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $ano);
    $stmt->execute();
    $result = $stmt->get_result();

    $meses = []; $total_anual = 0.0;
    while ($row = $result->fetch_assoc()) {
        $row['mes']              = (int)$row['mes'];
        $row['quantidade_vendas']= (int)$row['quantidade_vendas'];
        $row['total_mes']        = round((float)$row['total_mes'], 2);
        $meses[]                 = $row;
        $total_anual            += $row['total_mes'];
    }
    $stmt->close();

    echo json_encode([
        'ano'         => $ano,
        'meses'       => $meses,
        'total_anual' => round($total_anual, 2)
    ], JSON_UNESCAPED_UNICODE);

} else {
    http_response_code(400);
    echo json_encode(['erro' => 'Tipo inválido. Use: diario, mensal ou anual.'], JSON_UNESCAPED_UNICODE);
}

$conn->close();
