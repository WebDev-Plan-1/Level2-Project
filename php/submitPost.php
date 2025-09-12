<?php
// php/submitPost.php
header('Content-Type: application/json; charset=utf-8');
session_start();

function json_response($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_response(405, ['message' => 'Method not allowed']);

// Must be logged in (server authoritative)
if (empty($_SESSION['user'])) json_response(401, ['message' => 'Authentication required. Please login.']);

// Config
$DATA_FILE = __DIR__ . '/../data/articles.json';
$UPLOAD_DIR = __DIR__ . '/../assets/images/';
$ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$MAX_SIZE = 3 * 1024 * 1024; // 3MB

// Collect input
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$category = isset($_POST['category']) ? trim($_POST['category']) : '';
$newCategory = trim($_POST["newCategory"] ?? "");
$content = isset($_POST['content']) ? trim($_POST['content']) : '';
$date = isset($_POST['date']) ? trim($_POST['date']) : date('Y-m-d');

// === VALIDATION ===
// Title
$words = preg_split('/\s+/', $title);
if (!$title) json_response(422, ["message" => "Title is required."]);
if (count($words) > 7) json_response(422, ["message" => "Title must be at most 7 words."]);
foreach ($words as $word) {
    if (mb_strlen($word, 'UTF-8') > 20) {
        json_response(422, ["message" => "Each word in title must be at most 20 characters. Problem with: $word"]);
    }
}

// Category / New Category
if (!$category) {
    json_response(422, ["message" => "Category is required."]);
}
if ($category === "Add New Category") {
    if (!$newCategory) {
        json_response(422, ["message" => "Please enter the new category."]);
    }
    $catWords = preg_split('/\s+/', $newCategory);
    if (count($catWords) > 2) json_response(422, ["message" => "New category must be at most 2 words."]);
    foreach ($catWords as $word) {
        if (mb_strlen($word, 'UTF-8') > 20) {
            json_response(422, ["message" => "Each word in category must be at most 20 characters. Problem with: $word"]);
        }
    }
    // Check duplicates
    if (file_exists($DATA_FILE)) {
        $existing = json_decode(file_get_contents($DATA_FILE), true);
        if (is_array($existing)) {
            $existingCats = array_map(fn($c) => strtolower($c['category']), $existing);
            if (in_array(strtolower($newCategory), $existingCats)) {
                json_response(422, ["message" => "Category already exists. Please choose another."]);
            }
        }
    }
    $category = $newCategory;
}

// Content
if (!$content) json_response(422, ["message" => "Content is required."]);
$badWords = ["badword1", "badword2", "offensive"];
foreach ($badWords as $bad) {
    if (stripos($content, $bad) !== false) {
        json_response(422, ["message" => "Content contains inappropriate words."]);
    }
}

// Date
if (!$date) {
    $date = date("Y-m-d");
}

// Image Upload
if (!isset($_FILES["image"]) || $_FILES["image"]["error"] !== UPLOAD_ERR_OK) {
    json_response(422, ["message" => "Image upload failed."]);
}
$ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
$allowed = ["jpg", "jpeg", "png", "webp", "gif"];
if (!in_array($ext, $allowed)) {
    json_response(422, ["message" => "Invalid image type."]);
}
$imgName = uniqid("img_", true) . "." . $ext;
$imgPath = $UPLOAD_DIR . $imgName;
if (!move_uploaded_file($_FILES["image"]["tmp_name"], $imgPath)) {
    json_response(500, ["message" => "Failed to save image."]);
}

// === SAVE TO JSON ===
$articles = [];
if (file_exists($DATA_FILE)) {
    $json = file_get_contents($DATA_FILE);
    $articles = json_decode($json, true) ?: [];
}

// Ensure articles JSON exists
if (!file_exists($DATA_FILE)) {
    file_put_contents($DATA_FILE, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Lock and read
$fp = fopen($DATA_FILE, 'c+');
if (!$fp) json_response(500, ['message' => 'Cannot open data file.']);
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock data file. Try again.']);
}
$raw = stream_get_contents($fp);
$items = [];
if ($raw !== false && trim($raw) !== '') {
    $items = json_decode($raw, true);
    if (!is_array($items)) $items = [];
}

// Generate ID
$ids = array_column($articles, "id");
$newId = $ids ? max($ids) + 1 : 1;

// Author fields from session (server authoritative)
$author = $_SESSION['user'];
$authorId = isset($author['id']) ? $author['id'] : null;
$authorUsername = isset($author['username']) ? $author['username'] : null;
$authorFullname = isset($author['fullname']) ? $author['fullname'] : null;

// Create item
$newArticle = [
    "id" => $newId,
    "title" => $title,
    "category" => $category,
    "content" => $content,
    "image" => "assets/images/" . $imgName,
    "date" => $date,
    "views" => rand(10, 999999999),
    'authorId' => $authorId,
    'authorUsername' => $authorUsername,
    'authorFullname' => $authorFullname
];

$articles[] = $newArticle;

// write back
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

// Save
if (file_put_contents($DATA_FILE, json_encode($articles, JSON_PRETTY_PRINT)) === false) {
    json_response(500, ["message" => "Failed to save article."]);
}

// respond with created article
json_response(200, ["message" => "Article created successfully.", "article" => $newArticle]);
