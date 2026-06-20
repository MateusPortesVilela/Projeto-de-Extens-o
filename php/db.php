<?php
// ============================================================
// CONFIGURAÇÃO DA CONEXÃO COM O BANCO DE DADOS
// ============================================================
// Altere as credenciais abaixo conforme sua instalação XAMPP

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');        // padrão XAMPP: sem senha
define('DB_NAME', 'ortoapp');
define('DB_PORT', 3306);

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    die(json_encode([
        'erro' => 'Falha na conexão com o banco de dados. Verifique se o XAMPP está rodando e o banco "ortoapp" existe.',
        'detalhe' => $conn->connect_error
    ]));
}

$conn->set_charset('utf8mb4');
