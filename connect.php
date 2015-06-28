<?php
$sql["serveur"]='sql.free.fr';
$sql["login"]='lwh'; 
$sql["pass"]='gw9jx7et'; 
$sql["base"]='lwh'; /

$sql["connect"]=mysql_connect($sql["serveur"],$sql["login"],$sql["pass"])or die ("impossible de se connecter, réessayé plus tard");
$sql["select_base"]=mysql_select_db($sql["base"],$sql["connect"])or die ("erreur de connexion base");

?>