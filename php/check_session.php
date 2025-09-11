<?php
// php/check_session.php
header('Content-Type: application/json; charset=utf-8');
session_start();
if (!empty($_SESSION['user'])) {
    echo json_encode(['ok' => true, 'user' => $_SESSION['user']]);
} else {
    echo json_encode(['ok' => false]);
}
