<?php
require_once __DIR__ . '/utils.php';
ensure_session_started();

$DATA_FILE = __DIR__ . '/../data/users.json';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(405, ['message' => 'Method not allowed']);

$identifier = trim($_POST['identifier'] ?? '');
$password = $_POST['password'] ?? '';

if ($identifier === '' || $password === '') json_response(422, ['message' => 'Credentials required.']);
if (!file_exists($DATA_FILE)) json_response(401, ['message' => 'No users found.']);

// Read file with shared lock (LOCK_SH)
$fp = fopen($DATA_FILE, 'r');
if (!$fp) json_response(500, ['message' => 'Cannot open users file.']);
if (!flock($fp, LOCK_SH)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock users file.']);
}
$json = stream_get_contents($fp);
fclose($fp);

$users = json_decode($json, true) ?: [];

// Find matching user by username or email
$found = null;
foreach ($users as $u) {
    if ((isset($u['username']) && strtolower($u['username']) === strtolower($identifier)) ||
        (isset($u['email']) && strtolower($u['email']) === strtolower($identifier))
    ) {
        $found = $u;
        break;
    }
}
if (!$found) json_response(401, ['message' => 'Invalid username/email or password.']);

// Verify password
if (!isset($found['password']) || !password_verify($password, $found['password'])) {
    json_response(401, ['message' => 'Invalid username/email or password.']);
}

// Regenerate session ID for security
session_regenerate_id(true);

// Set session user data
$_SESSION['user'] = [
    'id' => $found['id'],
    'username' => $found['username'],
    'fullname' => $found['fullname'],
    'email' => $found['email']
];

json_response(200, ['message' => 'Logged in', 'user' => $_SESSION['user']]);
