<?php

class legrand_conf {

	//DEFINITION DU PROXY SERVER
	public $SERVER_HOST = '127.0.0.1';
	//public $SERVER_DEFAULT_PORTS = 	array('5331', '5332', '5333', '5334');//LISTE DES PORTS A TESTER
	public $SERVER_PORT = '2000'; //PERMET DE FORCER L'OUVERTURE D'UN PORT
	public $SOCKET_TIMEOUT = 100000;

	//DEFINITION DU SERVEUR MYSQL
	public $MYSQL_HOST = 'localhost';
	public $MYSQL_LOGIN = 'boxio';
	public $MYSQL_PASS = 'legrand';
	public $MYSQL_DB = 'boxio';

	//DEFINITION DU SERVER PHP
	//public $PHP_HOST = '192.168.1.30'; //DETECTION AUTOMATIQUE SINON INSCRIRE L'IP DISTANTE EVITER 127.0.0.1 ou localhost
	public $PHP_PORT = '80';
	public $PHP_PATH = '/back/';

}

?>