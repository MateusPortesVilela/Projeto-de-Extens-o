<?php
/**
 * GET /php/pain-records-list.php?patient_id=...
 */
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Método não permitido. Use GET.', 405);
}

$db = require_db();
$patientId = trim($_GET['patient_id'] ?? ORTOAPP_TEST_PATIENT_ID);

$stmt = $db->prepare(
    'SELECT id, user_id, pain_level, symptoms, notes, recorded_at
     FROM pain_records
     WHERE user_id = ? AND deleted_at IS NULL
     ORDER BY recorded_at DESC
     LIMIT 100'
);

if (!$stmt) {
    json_error('Erro ao preparar consulta.', 500, $db->error);
}

$stmt->bind_param('s', $patientId);

if (!$stmt->execute()) {
    json_error('Não foi possível buscar registros.', 500, $stmt->error);
}

$result = $stmt->get_result();
$records = [];

while ($row = $result->fetch_assoc()) {
    $records[] = [
        'id' => $row['id'],
        'patient_id' => $row['user_id'],
        'pain_level' => (int) $row['pain_level'],
        'symptoms' => $row['symptoms'],
        'notes' => $row['notes'],
        'created_at' => $row['recorded_at'],
    ];
}

json_ok([
    'ok' => true,
    'patient_id' => $patientId,
    'records' => $records,
]);
