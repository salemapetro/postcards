<?php
/**
 * get file post data
 * return url of uploaded image in "input" directory
 */

$deploymentpath = "/postcards/";
$uploaddir = dirname(__FILE__) . '/../input/';


$new_filename = generateRandomString() .".". pathinfo($_FILES['userimage']['name'], PATHINFO_EXTENSION);
$uploadfile = $uploaddir . $new_filename;

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}	

if (move_uploaded_file($_FILES['userimage']['tmp_name'], $uploadfile)) {
    echo $deploymentpath . "input/" . $new_filename;
} else {
    echo "Möglicherweise eine Dateiupload-Attacke!\n";
}

?>