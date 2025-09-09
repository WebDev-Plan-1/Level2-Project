<?php
header("Content-Type: application/json");

// Helpers
function json_response($code, $data)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

$DATA_FILE = __DIR__ . "/../data/articles.json";
$UPLOAD_DIR = __DIR__ . "/../assets/images/";

$title = trim($_POST["title"] ?? "");
$category = trim($_POST["category"] ?? "");
$content = trim($_POST["content"] ?? "");
$date = trim($_POST["date"] ?? "");
$newCategory = trim($_POST["newCategory"] ?? "");

// === VALIDATION ===
// Title
$words = preg_split('/\s+/', $title);
if (!$title) json_response(422, ["message" => "Title is required."]);
if (count($words) > 5) json_response(422, ["message" => "Title must be at most 5 words."]);
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

// Generate ID
$ids = array_column($articles, "id");
$newId = $ids ? max($ids) + 1 : 1;

// Add article
$newArticle = [
    "id" => $newId,
    "title" => $title,
    "category" => $category,
    "content" => $content,
    "image" => "assets/images/" . $imgName,
    "date" => $date,
    "views" => rand(10, 1000)
];
$articles[] = $newArticle;

// Save
if (file_put_contents($DATA_FILE, json_encode($articles, JSON_PRETTY_PRINT)) === false) {
    json_response(500, ["message" => "Failed to save article."]);
}

json_response(200, ["message" => "Article submitted successfully.", "article" => $newArticle]);