<?php

$myFile = "button.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = '{ "button": false }';
fwrite($fh, $stringData);
fclose($fh)

?>
