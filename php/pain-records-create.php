<?php
/**
 * POST /php/pain-records-create.php
 * Body JSON: { patient_id?, pain_level, symptoms, notes? }
 */
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método não permitido. Use POST.', 405);
}

$db = require_db();
$data = read_json_body();

$patientId = trim($data['patient_id'] ?? ORTOAPP_TEST_PATIENT_ID);
$painLevel = isset($data['pain_level']) ? (int) $data['pain_level'] : null;
$symptoms = trim($data['symptoms'] ?? '');
$notes = trim($data['notes'] ?? '');

if ($painLevel === null || $painLevel < 0 || $painLevel > 10) {
    json_error('Informe pain_level entre 0 e 10.');
}

if ($symptoms === '') {
    json_error('Informe os sintomas.');
}

$stmt = $db->prepare(
    'INSERT INTO pain_records (user_id, pain_level, symptoms, notes) VALUES (?, ?, ?, ?)'
);

if (!$stmt) {
    json_error('Erro ao preparar consulta.', 500, $db->error);
}

$stmt->bind_param('siss', $patientId, $painLevel, $symptoms, $notes);

if (!$stmt->execute()) {
    json_error('Não foi possível salvar o registro.', 500, $stmt->error);
}

json_ok([
    'ok' => true,
    'id' => $stmt->insert_id ?: $db->insert_id,
    'message' => 'Registro salvo com sucesso.',
], 201);
