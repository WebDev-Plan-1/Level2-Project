<?php
// php/login.php
header('Content-Type: application/json; charset=utf-8');
session_start();

function json_response($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$DATA_FILE = __DIR__ . '/../data/users.json';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(405, ['message' => 'Method not allowed']);

$identifier = trim($_POST['identifier'] ?? '');
$password = $_POST['password'] ?? '';

if ($identifier === '' || $password === '') json_response(422, ['message' => 'Credentials required.']);

if (!file_exists($DATA_FILE)) json_response(401, ['message' => 'No users found.']);

$users = json_decode(file_get_contents($DATA_FILE), true) ?: [];
$found = null;
foreach ($users as $u) {
    if (isset($u['username']) && strtolower($u['username']) === strtolower($identifier)) {
        $found = $u;
        break;
    }
    if (isset($u['email']) && strtolower($u['email']) === strtolower($identifier)) {
        $found = $u;
        break;
    }
}
if (!$found) json_response(401, ['message' => 'Invalid username/email or password.']);

// verify password
if (!isset($found['password']) || !password_verify($password, $found['password'])) {
    json_response(401, ['message' => 'Invalid username/email or password.']);
}

// set session
$_SESSION['user'] = [
    'id' => $found['id'],
    'username' => $found['username'],
    'fullname' => $found['fullname'],
    'email' => $found['email']
];

json_response(200, ['message' => 'Logged in', 'user' => $_SESSION['user']]);
