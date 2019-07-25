<?php
header("Content-type:text/html;charset=utf-8");
if($_POST){
$d = $_POST['data'];
echo $d['doing'];
//print_r($d);
exit;
}
?>
