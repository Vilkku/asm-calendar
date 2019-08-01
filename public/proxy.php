<?php

header('Content-type: text/calendar; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header('Content-Disposition: inline; filename=calendar.vcs');

$data = file_get_contents('http://m.assembly.org/assembly-summer-2017.vcs');

echo $data;
die();
