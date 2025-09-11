<?php
// php/signup.php
header('Content-Type: application/json; charset=utf-8');
session_start();

function json_response($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// config
$DATA_FILE = __DIR__ . '/../data/users.json';

// method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['message' => 'Method not allowed']);
}

// fetch input
$fullname = trim($_POST['fullname'] ?? '');
$username = trim($_POST['username'] ?? '');
$email = trim(strtolower($_POST['email'] ?? ''));
$password = $_POST['password'] ?? '';

// Basic validations
if ($fullname === '') json_response(422, ['message' => 'Full name required.']);
$parts = preg_split('/\s+/', $fullname);
if (count($parts) !== 2) json_response(422, ['message' => 'Enter First and Last name only.']);
foreach ($parts as $p) {
    if (mb_strlen($p, 'UTF-8') > 20) json_response(422, ['message' => 'Each name part must be ≤ 20 chars.']);
    if (!preg_match("/^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/", $p)) json_response(422, ['message' => 'Name contains invalid characters.']);
}

if ($username === '') json_response(422, ['message' => 'Username required.']);
if (!preg_match('/^[a-z0-9_]{3,30}$/', $username)) json_response(422, ['message' => 'Username allowed: lowercase letters, digits, underscore (3-30).']);

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) json_response(422, ['message' => 'Valid email required.']);

if ($password === '' || strlen($password) < 8) json_response(422, ['message' => 'Password must be at least 8 characters.']);
if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/\d/', $password)) {
    json_response(422, ['message' => 'Password must include uppercase, lowercase and a number.']);
}

// read existing users (create file if missing)
if (!file_exists($DATA_FILE)) {
    file_put_contents($DATA_FILE, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$fp = fopen($DATA_FILE, 'c+');
if (!$fp) json_response(500, ['message' => 'Could not open users file.']);
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock users file.']);
}
$raw = stream_get_contents($fp);
$users = [];
if ($raw !== false && trim($raw) !== '') {
    $users = json_decode($raw, true);
    if (!is_array($users)) $users = [];
}

// duplicates check
foreach ($users as $u) {
    if (isset($u['username']) && strtolower($u['username']) === strtolower($username)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        json_response(422, ['message' => 'Username already exists.']);
    }
    if (isset($u['email']) && strtolower($u['email']) === strtolower($email)) {
        flock($fp, LOCK_UN);
        fclose($fp);
        json_response(422, ['message' => 'Email already registered.']);
    }
}

// create unique ID
$maxId = 0;
foreach ($users as $u) {
    if (isset($u['id']) && is_numeric($u['id'])) $maxId = max($maxId, intval($u['id']));
}
$newId = $maxId + 1;

// hash password
$pwHash = password_hash($password, PASSWORD_DEFAULT);

// append new user
$newUser = [
    'id' => $newId,
    'fullname' => $fullname,
    'username' => $username,
    'email' => $email,
    'password' => $pwHash,
    'created_at' => date('Y-m-d H:i:s')
];

$users[] = $newUser;

// write back
ftruncate($fp, 0);
rewind($fp);
if (fwrite($fp, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
    flock($fp, LOCK_UN);
    fclose($fp);
    json_response(500, ['message' => 'Could not save user.']);
}
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

// set session
$_SESSION['user'] = [
    'id' => $newUser['id'],
    'username' => $newUser['username'],
    'fullname' => $newUser['fullname'],
    'email' => $newUser['email']
];

json_response(201, ['message' => 'User created', 'user' => $_SESSION['user']]);
