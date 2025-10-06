<?php
require_once __DIR__ . '/utils.php';
ensure_session_started();

// Clear all session data
$_SESSION = [];

// Remove session cookie if it exists
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}

// Destroy session
session_destroy();

// Return success JSON
json_response(200, ['ok' => true, 'message' => 'Logged out successfully']);
