<?php
// php/migrate_add_author.php
$DATA_FILE = __DIR__ . '/../data/articles.json';
if (!file_exists($DATA_FILE)) {
    echo "No articles file.\n";
    exit;
}
$raw = file_get_contents($DATA_FILE);
$items = json_decode($raw, true);
if (!is_array($items)) $items = [];

$changed = false;
foreach ($items as &$it) {
    if (!isset($it['authorId'])) {
        $it['authorId'] = 0;
        $it['authorUsername'] = 'system';
        $it['authorFullname'] = 'System';
        $changed = true;
    }
}
if ($changed) {
    file_put_contents($DATA_FILE, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "Migrated.\n";
} else {
    echo "No changes needed.\n";
}
