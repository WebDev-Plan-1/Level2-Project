<?php

require_once __DIR__ . '/utils.php';
ensure_session_started();
// php/submitPost.php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

// Allow POST only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['message' => 'Method not allowed']);
}

// Ensure user is logged in
if (empty($_SESSION['user'])) {
    json_response(401, ['message' => 'Authentication required. Please login.']);
}

// ================== CONFIG ==================
$DATA_FILE = __DIR__ . '/../data/articles.json';
$UPLOAD_DIR = __DIR__ . '/../assets/images/';
$UPLOAD_WEB = 'assets/images/';
$ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$MAX_SIZE = 3 * 1024 * 1024; // 3MB
$DEFAULT_IMAGE = $UPLOAD_WEB . 'fallback.jpg';

// ================== INPUT ==================
$title = trim($_POST['title'] ?? '');
$category = trim($_POST['category'] ?? '');
$newCategory = trim($_POST['newCategory'] ?? '');
$content = trim($_POST['content'] ?? '');
$date = trim($_POST['date'] ?? date('Y-m-d'));

// ================== VALIDATION ==================
// ================== Title: required, max 7 words, each word ≤ 20 chars
if ($title === '') json_response(422, ["message" => "Title is required."]);
$words = preg_split('/\s+/', $title);
if (count($words) > 7) json_response(422, ["message" => "Title must be at most 7 words."]);
foreach ($words as $word) {
    if (mb_strlen($word, 'UTF-8') > 20) {
        json_response(422, ["message" => "Each word in title must be ≤ 20 characters. Problem: $word"]);
    }
}

// ================== Category: required, if "Add New Category" then newCategory required, 
//max 2 words, each word ≤ 20 chars, unique in file (if file exists) and case-insensitive
if ($category === '') json_response(422, ["message" => "Category is required."]);

// Handle "Add New Category" option
if ($category === "Add New Category") {
    if ($newCategory === '') json_response(422, ["message" => "Please enter the new category."]);
    $catWords = preg_split('/\s+/', $newCategory);
    if (count($catWords) > 2) json_response(422, ["message" => "New category must be at most 2 words."]);
    foreach ($catWords as $word) {
        if (mb_strlen($word, 'UTF-8') > 20) {
            json_response(422, ["message" => "Each word in category must be ≤ 20 characters. Problem: $word"]);
        }
    }

    if (file_exists($DATA_FILE)) {
        $existing = json_decode(file_get_contents($DATA_FILE), true);
        if (is_array($existing)) {
            $existingCats = array_map(fn($a) => strtolower($a['category'] ?? ''), $existing);
            if (in_array(strtolower($newCategory), $existingCats)) {
                json_response(422, ["message" => "Category already exists."]);
            }
        }
    }
    $category = $newCategory;
}

// ================== Content: required, no inappropriate words (case-insensitive)
if ($content === '') json_response(422, ["message" => "Content is required."]);

foreach (["badword1", "badword2", "offensive"] as $bad) {
    if (stripos($content, $bad) !== false) {
        json_response(422, ["message" => "Content contains inappropriate words."]);
    }
}

// ================== Date Validation ==================
if (!$date) {
    $date = date("Y-m-d");
}

// ================== IMAGE UPLOAD ==================
$imagePath = $DEFAULT_IMAGE;
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
    if (!in_array($ext, $ALLOWED_EXT)) json_response(422, ["message" => "Invalid image type."]);
    if ($_FILES["image"]["size"] > $MAX_SIZE) json_response(422, ["message" => "Image exceeds max allowed size (3MB)."]);

    $imgName = uniqid("img_", true) . "." . $ext;
    $imgPath = $UPLOAD_DIR . $imgName;
    if (!move_uploaded_file($_FILES["image"]["tmp_name"], $imgPath)) {
        json_response(500, ["message" => "Failed to save image."]);
    }
    $imagePath = $UPLOAD_WEB . $imgName;
}

// ================== SAVE TO JSON ==================
if (!file_exists($DATA_FILE)) {
    file_put_contents($DATA_FILE, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$fp = fopen($DATA_FILE, 'c+');
if (!$fp) json_response(500, ['message' => 'Cannot open data file.']);
if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    json_response(500, ['message' => 'Could not lock data file. Try again.']);
}

// Read data safely
$raw = filesize($DATA_FILE) > 0 ? fread($fp, filesize($DATA_FILE)) : '';
$articles = json_decode($raw, true);
if (!is_array($articles)) $articles = [];

// Generate next ID
$newId = $articles ? max(array_column($articles, 'id')) + 1 : 1;

// Create new article
$user = $_SESSION['user'];
$newArticle = [
    "id" => $newId,
    "title" => $title,
    "category" => $category,
    "content" => $content,
    "image" => $imagePath,
    "date" => $date,
    "views" => rand(0, 500), // more logical
    "authorId" => $user['id'] ?? null,
    "authorUsername" => $user['username'] ?? '',
    "authorFullname" => $user['fullname'] ?? ''
];

// Write updated data
$articles[] = $newArticle;
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($articles, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

json_response(200, ["message" => "Article created successfully.", "article" => $newArticle]);
