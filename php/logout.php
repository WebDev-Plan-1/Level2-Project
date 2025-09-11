<?php
// php/logout.php
session_start();

// Clear all session variables
$_SESSION = [];

// Destroy the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// Return JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['ok' => true, 'message' => 'Logged out']);
