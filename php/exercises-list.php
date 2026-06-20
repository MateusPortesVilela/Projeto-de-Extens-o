<?php
/**
 * GET /php/exercises-list.php
 * Retorna exercícios e orientações educativas cadastrados no banco.
 */
require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Método não permitido. Use GET.', 405);
}

$db = require_db();

$sql = 'SELECT e.id, e.name AS title, e.description, e.difficulty AS level,
               e.duration_minutes AS duration, c.name AS category
        FROM exercises e
        INNER JOIN exercise_categories c ON c.id = e.category_id
        WHERE e.is_active = 1
        ORDER BY c.name, e.name';

$result = $db->query($sql);

if (!$result) {
    json_error('Não foi possível buscar exercícios.', 500, $db->error);
}

$exercises = [];
$orientations = [];

while ($row = $result->fetch_assoc()) {
    $item = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'level' => difficulty_label($row['level']),
        'duration' => $row['duration'] !== null ? (int) $row['duration'] : null,
        'category' => $row['category'],
    ];

    $category = $row['category'];
    $isOrientation = stripos($category, 'Orienta') !== false;

    if ($isOrientation) {
        $orientations[] = $item;
    } else {
        $exercises[] = $item;
    }
}

json_ok([
    'ok' => true,
    'exercises' => $exercises,
    'orientations' => $orientations,
]);
