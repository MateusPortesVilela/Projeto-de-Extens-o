<?php
// Configuração local — não commitar (está no .gitignore)

define('ALLOWED_ORIGINS', [
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8000',
    'https://seu-projeto.vercel.app',
]);

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'orto_app');
define('DB_PORT', 3306);
