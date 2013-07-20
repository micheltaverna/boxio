<?php

class boxio_conf {

	//DEBUG
	public $DEBUG_LEVEL = 0; // Active le debugage dans les logs avec 0 => Aucun debug et 5 => le plus haut niveau d'inforamtion
	
	//DEFINITION DU PROXY SERVER
	public $SERVER_HOST = '127.0.0.1';
	//public $SERVER_DEFAULT_PORTS = 	array('5331', '5332', '5333', '5334');//LISTE DES PORTS A TESTER
	public $SERVER_PORT = '2000'; //PERMET DE FORCER L'OUVERTURE D'UN PORT
	public $SOCKET_TIMEOUT = 200000;

	//DEFINITION DU SERVEUR MYSQL
	public $MYSQL_HOST = 'localhost';
	public $MYSQL_LOGIN = 'boxio';
	public $MYSQL_PASS = 'legrand';
	public $MYSQL_DB = 'boxio';

	//DEFINITION DU SERVER PHP
	//public $PHP_HOST = '192.168.1.30'; //DETECTION AUTOMATIQUE SINON INSCRIRE L'IP DISTANTE EVITER 127.0.0.1 ou localhost
	public $PHP_PORT = '80';
	public $PHP_PATH = '/back/';
	public $UPDATE_CHECK_PATH = 'http://boxio.googlecode.com/svn/trunk/dev/update.xml';
	public $UPDATE_SCRIPT = '/var/www/scripts/upgrade.sh';
	
}

?>