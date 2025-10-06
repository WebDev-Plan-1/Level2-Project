<?php
require_once __DIR__ . '/utils.php';
ensure_session_started();

// Return session state as JSON
if (!empty($_SESSION['user'])) {
    json_response(200, ['ok' => true, 'user' => $_SESSION['user'], 'timestamp' => time()]);
} else {
    json_response(200, ['ok' => false]);
}
