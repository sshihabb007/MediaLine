<?php
// LOCALHOST HELPER: This file automatically generates photos.json and thumbs when running on XAMPP.

$dir = "UPLOAD/";
$thumbDir = $dir . "thumbs/";

if (!is_dir($dir)) {
    die("UPLOAD directory not found.");
}
if (!is_dir($thumbDir)) {
    mkdir($thumbDir, 0777, true);
}

$files = array_diff(scandir($dir), array('.', '..', '.gitkeep', 'thumbs'));
$json = [];

foreach ($files as $file) {
    if (is_file($dir . $file)) {
        $sourcePath = $dir . $file;
        $thumbPath = $thumbDir . $file;
        
        // Generate thumbnail if missing
        if (!file_exists($thumbPath)) {
            $ext = strtolower(pathinfo($sourcePath, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                list($width, $height) = @getimagesize($sourcePath);
                if ($width && $height) {
                    $newWidth = 500;
                    $newHeight = floor($height * ($newWidth / $width));
                    
                    $thumb = imagecreatetruecolor($newWidth, $newHeight);
                    if ($ext === 'png') {
                        imagealphablending($thumb, false);
                        imagesavealpha($thumb, true);
                        $source = @imagecreatefrompng($sourcePath);
                        if ($source) imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                        if ($source) imagepng($thumb, $thumbPath, 5);
                    } else if ($ext === 'webp') {
                        $source = @imagecreatefromwebp($sourcePath);
                        if ($source) imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                        if ($source) imagewebp($thumb, $thumbPath, 80);
                    } else {
                        $source = @imagecreatefromjpeg($sourcePath);
                        if ($source) imagecopyresampled($thumb, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                        if ($source) imagejpeg($thumb, $thumbPath, 70);
                    }
                    if (isset($thumb)) imagedestroy($thumb);
                    if (isset($source) && $source !== false) imagedestroy($source);
                }
            }
        }
        
        $json[] = [
            "url" => $sourcePath,
            "thumb_url" => file_exists($thumbPath) ? $thumbPath : $sourcePath,
            "timestamp" => filemtime($sourcePath)
        ];
    }
}

// Sort by timestamp descending (newest first)
usort($json, function($a, $b) {
    return $b['timestamp'] <=> $a['timestamp'];
});

file_put_contents("photos.json", json_encode($json, JSON_PRETTY_PRINT));
echo "Successfully generated photos.json and thumbnails";
?>
