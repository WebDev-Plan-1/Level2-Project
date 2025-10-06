<?php
// php/utils.php

/**
 * Unified helper functions for JSON responses and sessions.
 * Using this file prevents code duplication across endpoints.
 */

// Ensure no direct output before headers
ob_start();

/**
 * Sends a JSON response with HTTP status code and data.
 */
function json_response(int $code, array $data): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Safely starts a PHP session if not already started.
 */
function ensure_session_started(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}
