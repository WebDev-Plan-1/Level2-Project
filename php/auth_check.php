<?php
require_once __DIR__ . '/utils.php';
ensure_session_started();

// Redirect unauthenticated users to auth page
if (empty($_SESSION['user'])) {
    // =============================
    // Dynamic Redirect to Login Page
    // =============================

    // Get the current script directory (like /Level2-Project)
    $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
    // Build the full relative path to auth.html
    $loginPath = $basePath . '/auth.html';
    // Redirect using absolute URL for safety
    header('Location: ' . $loginPath);
    exit;
}
