<?php

$myFile = "button.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = '{ "button": true }';
fwrite($fh, $stringData);
fclose($fh)

?>
