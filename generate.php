<?php
// LOCALHOST HELPER: This file automatically generates photos.json when running on XAMPP.
// It will not be used on GitHub Pages, where GitHub Actions takes over.

$dir = "UPLOAD/";
if (!is_dir($dir)) {
    die("UPLOAD directory not found.");
}

$files = array_diff(scandir($dir), array('.', '..', '.gitkeep'));
$json = [];

foreach ($files as $file) {
    $filePath = $dir . $file;
    if (is_file($filePath)) {
        $json[] = [
            "url" => $filePath,
            "timestamp" => filemtime($filePath)
        ];
    }
}

// Sort by timestamp descending (newest first)
usort($json, function($a, $b) {
    return $b['timestamp'] <=> $a['timestamp'];
});

file_put_contents("photos.json", json_encode($json, JSON_PRETTY_PRINT));
echo "Successfully generated photos.json";
?>
