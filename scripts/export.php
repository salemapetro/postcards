<?php
/* 
 * gets post data stream (base64)
 * http://stackoverflow.com/questions/16214300/upload-base64-image-facebook-graph-api
 * */

//print_r($_POST["img"]);

saveImage($_POST["img"]);


function saveImage($base64img){
	$deploymentpath = "/postcards/";
	$exportdir = dirname(__FILE__) . '/../output/';

    $base64img = str_replace('data:image/jpeg;base64,', '', $base64img);
    $data = base64_decode($base64img);
    $filename = date('Y-m-d_H:i:s') . '.jpg';
    $file = $exportdir . $filename;

    file_put_contents($file, $data);

    echo $deploymentpath . "output/" . $filename;
}

?>