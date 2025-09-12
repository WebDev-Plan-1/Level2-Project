<?php
// php/delete_post.php
header('Content-Type: application/json; charset=utf-8');
session_start();
function json_response($c, $d)
{
    http_response_code($c);
    echo json_encode($d);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(405, ['message' => 'Method not allowed']);
if (empty($_SESSION['user'])) json_response(401, ['message' => 'Authentication required']);

$id = intval($_POST['id'] ?? 0);
if (!$id) json_response(422, ['message' => 'Missing id']);

$DATA_FILE = __DIR__ . '/../data/articles.json';
if (!file_exists($DATA_FILE)) json_response(404, ['message' => 'Data file not found']);

$fp = fopen($DATA_FILE, 'c+');
if (!$fp) json_response(500, ['message' => 'Cannot open data file']);
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock data file']);
}

$raw = stream_get_contents($fp);
$items = $raw ? json_decode($raw, true) : [];
if (!is_array($items)) $items = [];

$foundIndex = null;
foreach ($items as $i => $it) {
    if (isset($it['id']) && intval($it['id']) === $id) {
        $ownerId = $it['authorId'] ?? null;
        $sessionUserId = $_SESSION['user']['id'] ?? null;
        if ($ownerId === null || intval($ownerId) !== intval($sessionUserId)) {
            flock($fp, LOCK_UN);
            fclose($fp);
            json_response(403, ['message' => 'Not authorized to delete this post.']);
        }
        $foundIndex = $i;
        break;
    }
}
if ($foundIndex === null) {
    flock($fp, LOCK_UN);
    fclose($fp);
    json_response(404, ['message' => 'Post not found.']);
}

// optionally delete local image
$img = $items[$foundIndex]['image'] ?? '';
if ($img && strpos($img, 'assets/images/') === 0) {
    $p = __DIR__ . '/../' . $img;
    if (file_exists($p)) @unlink($p);
}

array_splice($items, $foundIndex, 1);

// write back
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

json_response(200, ['message' => 'Deleted']);
