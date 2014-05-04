<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

/*
// CLASS : GESTION DE LA SECURITE
// La classe permet de valider les connexion au client/serveur
*/

include_once("../back/conf.php");

class secure {
	public $connected = false;
	public $login = null;
	public $password = null;
	
	/*
	 // FONCTION : INITIALISATION DE LA DB MYSQL
	*/
	private function init_mysql() {
		$this->mysqli = new mysqli($this->conf->MYSQL_HOST, $this->conf->MYSQL_LOGIN, $this->conf->MYSQL_PASS, $this->conf->MYSQL_DB);
	}
	
	/*
	// FONCTION : CREATION DES SESSION
	*/
	private function sec_session_start() {
		$session_name = 'sec_session_id';
		$secure = false;
		$httponly = false;
	
		ini_set('session.use_only_cookies', 0);
		$cookieParams = session_get_cookie_params();
		session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly);
		session_name($session_name);
		session_start();
		session_regenerate_id(false);
	}

	/*
	// FONCTION : FONCTION DE LOGIN PRINCIPALE
	*/
	private function login($login, $password, $direct_login=false) {
		if ($stmt = $this->mysqli->prepare("SELECT id, login, password, salt FROM users WHERE login = ? LIMIT 1")) {
			$stmt->bind_param('s', $login);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($user_id, $username, $db_password, $salt);
			$stmt->fetch();
			$passwordHash512 = $password;
			if ($direct_login === false) {
				$password = hash('sha512', $password.$salt);
			}
	
			if($stmt->num_rows == 1) { // Le user existe
				// Test si trop de connexion fausses
				if($this->checkbrute($user_id) == true) {
					//@TODO : Prévenir que le compte est bloqué
					$this->error = 'bloqued';
					return false;
				// Test du Password
				} else {
					if($db_password == $password) {
						$user_browser = $_SERVER['HTTP_USER_AGENT'];
						$user_id = preg_replace("/[^0-9]+/", "", $user_id); 
						$_SESSION['user_id'] = $user_id;
						$username = preg_replace("/[^a-zA-Z0-9_\-]+/", "", $username);
						$_SESSION['username'] = $username;
						$_SESSION['login_string'] = hash('sha512', $password.$user_browser);
						$this->login = $login;
						$this->password = $passwordHash512;
						$this->error = false;
						$this->timeout = null;
						$this->connected = true;
						return true;
					} else {
						$this->error = 'password';
						$now = time();
						$this->mysqli->query("INSERT INTO login_attempts (user_id, time) VALUES ('$user_id', '$now')");
						return false;
					}
				}
			} else {
				// User inconnu.
				$this->error = 'login';
				return false;
			}
		}
	}

	/*
	// FONCTION : FONCTION DE TEST DU BRUTE FORCE
	*/
	private function checkbrute($user_id) {
		//@TODO: Mettre dans le fichier de conf le maxReTry connect et BlockedTime connect
		$now = time();
		$valid_attempts = $now - (2 * 60 * 60);
	
		if ($stmt = $this->mysqli->prepare("SELECT time FROM login_attempts WHERE user_id = ? AND time > '$valid_attempts'")) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();
			if($stmt->num_rows > 5) {
				return true;
			} else {
				return false;
			}
		}
	}

	/*
	// FONCTION : TEST DE LA CONNEXION
	*/
	public function login_check() {		
		$this->login = null;
		$this->connected = false;
		$this->error = null;
		$this->timeout = null;
		// Check if all session variables are set
		if(isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['login_string'])) {
			$user_id = $_SESSION['user_id'];
			$login_string = $_SESSION['login_string'];
			$username = $_SESSION['username'];
	
			$user_browser = $_SERVER['HTTP_USER_AGENT']; // Get the user-agent string of the user.
	
			if ($stmt = $this->mysqli->prepare("SELECT password FROM users WHERE id = ? LIMIT 1")) {
				$stmt->bind_param('i', $user_id); // Bind "$user_id" to parameter.
				$stmt->execute(); // Execute the prepared query.
				$stmt->store_result();
	
				if($stmt->num_rows == 1) { // If the user exists
					$stmt->bind_result($password); // get variables from result.
					$stmt->fetch();
					$login_check = hash('sha512', $password.$user_browser);
					if($login_check == $login_string) {
						$this->login = $username;
						$this->password = $password;
						$this->connected = true;
						$this->error = false;
						$this->timeout = time();
						return true;
					} else {
						$this->password = null;
						$this->error = 'password';
						return false;
					}
				} else {
					$this->password = null;
					$this->error = 'login';
					return false;
				}
			} else {
				$this->password = null;
				$this->error = 'db';
				return false;
			}
		} else {
			$this->password = null;
			$this->error = 'session';
			return false;
		}
	}
	
	/*
	// FONCTION : FUNCTION D'AJOUT D'UTILISATEUR
	*/
	public function set_account($login, $password) {
		//il faut être connecté pour modifier !
		if ($this->connected !== true) {
			return false;
		}
		$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
		$password = hash('sha512', $password.$random_salt);
		
		//Ajout en base
		if ($insert_stmt = $this->mysqli->prepare("REPLACE INTO users (login, password, salt) VALUES (?, ?, ?)")) {
			$insert_stmt->bind_param('sss', $login, $password, $random_salt);
			$insert_stmt->execute();
		}
	}

	/*
	// FONCTION : FUNCTION DE SUPPRESSION D'UTILISATEUR
	*/
	public function del_account($login) {
		//il faut être connecté pour modifier !
		if ($this->connected !== true) {
			return false;
		}
	
		//Suppression en base
		if ($insert_stmt = $this->mysqli->prepare("DELETE FROM users WHERE login=?")) {
			$insert_stmt->bind_param('s', $login);
			$insert_stmt->execute();
		}
	}
	
	/*
	 // FONCTION : FUNCTION DE MISE A JOUR D'UTILISATEUR
	*/
	public function upd_account($login, $password) {
		//il faut être connecté pour modifier !
		if ($this->connected !== true) {
			return false;
		}
		$random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
		$password = hash('sha512', $password.$random_salt);
		
		//Modification en base
		if ($insert_stmt = $this->mysqli->prepare("REPLACE INTO users (login, password, salt) VALUES (?, ?, ?)")) {
			$insert_stmt->bind_param('sss', $login, $password, $random_salt);
			$insert_stmt->execute();
		}
	}
	
	/*
	// FONCTION : FUNCTION DE DECONNEXION
	*/
	public function logout() {
		$_SESSION = array();
		$params = session_get_cookie_params();
		setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
		session_destroy();
		$this->connected = false;
		$this->login = null;
		$this->password = null;
		$this->error = null;
		$this->timeout = null;
	}
	
	/*
	// FONCTION : FUNCTION PRINCIPALE TEST SI LOGGER SINON FORCE LE LOG
	*/
	public function init() {
		$this->conf = new boxio_conf();
		$this->init_mysql();
		
		//Test si appel en local pour supprimmer l'authentification
		if ($_SERVER["REMOTE_ADDR"] == '127.0.0.1' 
				|| $_SERVER["REMOTE_ADDR"] == 'localhost' 
				|| $_SERVER["REMOTE_ADDR"] == $_SERVER["SERVER_ADDR"]) {
			$this->connected = true;
			$this->login = null;
			$this->password = null;
			$this->error = null;
			$this->timeout = null;
			return;
		}

		//Test si IP valide pour supprimmer l'authentification
		if (preg_match("/192\.168\.[\d]{1,3}\.[\d]{1,3}/", $_SERVER["REMOTE_ADDR"])) {
			$this->connected = true;
			$this->login = null;
			$this->password = null;
			$this->error = null;
			$this->timeout = null;
			return;
		}
		
		//Test si db vide pour supprimmer l'authentification
		if ($stmt = $this->mysqli->prepare("SELECT login FROM users")) {
			$stmt->execute(); // Execute the prepared query.
			$stmt->store_result();
			if ($stmt->num_rows == 0) {
				$this->connected = true;
				$this->login = null;
				$this->password = null;
				$this->error = null;
				$this->timeout = null;
				return;
			}
		}
				
		//Init des sessions
		$this->sec_session_start();

		//test pour Login
		if (isset($_GET['login'], $_GET['pHash512']) || isset($_GET['direct_login'], $_GET['pHash512'])) {
			$login = (!isset($_GET['login'])) ? $_GET['direct_login'] : $_GET['login'];
			$password = $_GET['pHash512'];//password en Hash512
			$direct_login = (isset($_GET['direct_login'])) ? true : false;
			$this->login($login, $password, $direct_login);
			return;
		}
		
		//test pour Logout
		if(isset($_GET['logout'])) {
			$this->logout();
			return;
		}
		
		//test du login en cours
		$this->login_check();
	}
}

