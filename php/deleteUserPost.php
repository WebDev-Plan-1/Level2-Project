<?php
// php/deleteUserPost.php
require_once __DIR__ . '/utils.php';
ensure_session_started();
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Allow only POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['message' => 'Method not allowed']);
}

// Check authentication
if (empty($_SESSION['user'])) {
    json_response(401, ['message' => 'Authentication required. Please login.']);
}

$user = $_SESSION['user'];
$userId = $user['id'] ?? null;

if (!$userId) {
    json_response(400, ['message' => 'Invalid session data.']);
}

// Validate post ID
$postId = $_POST['id'] ?? null;
if (!$postId || !is_numeric($postId)) {
    json_response(422, ['message' => 'Invalid or missing post ID.']);
}

// File path
$DATA_FILE = __DIR__ . '/../data/articles.json';

// Ensure file exists
if (!file_exists($DATA_FILE)) {
    json_response(404, ['message' => 'Data file not found.']);
}

// Open file safely
$fp = fopen($DATA_FILE, 'c+');
if (!$fp) {
    json_response(500, ['message' => 'Cannot open data file.']);
}

// Lock the file for exclusive access
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock data file. Try again.']);
}

// Read data safely
$raw = filesize($DATA_FILE) > 0 ? fread($fp, filesize($DATA_FILE)) : '';
$articles = json_decode($raw, true);

// Handle invalid or corrupted JSON
if (!is_array($articles)) {
    $articles = [];
}

// Find article by ID
$index = array_search($postId, array_column($articles, 'id'));

// Check if article exists
if ($index === false) {
    flock($fp, LOCK_UN);
    fclose($fp);
    json_response(404, ['message' => 'Article not found.']);
}

// Check ownership
$article = $articles[$index];
if (($article['authorId'] ?? null) != $userId) {
    flock($fp, LOCK_UN);
    fclose($fp);
    json_response(403, ['message' => 'Unauthorized: You can delete only your own posts.']);
}

// Delete article
unset($articles[$index]);
$articles = array_values($articles); // Reindex array

// Save updated data
ftruncate($fp, 0);
rewind($fp);
$writeResult = fwrite($fp, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

if ($writeResult === false) {
    json_response(500, ['message' => 'Failed to update data file after deletion.']);
}

// Return success
json_response(200, ['message' => 'Article deleted successfully.', 'deleted_id' => (int)$postId]);
