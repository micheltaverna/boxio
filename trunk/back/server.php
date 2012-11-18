<?php

//RECUPERATION DES PARAMETRES ET CONF BAS NIVEAU
if (stristr('cli', php_sapi_name()) == TRUE) {
	$args = getopt('l:b:');
	//PATH VERS LOGS
	if (isset($args['l'])) {
		$arg_logfile = $args['l'];
	}
	if (isset($args['b'])) {
		$arg_errorfile = $args['b'];
	}
	fclose(STDOUT);
	fclose(STDERR);
	$STDOUT = fopen($arg_logfile, 'wb');
	$STDERR = fopen($arg_errorfile, 'wb');
	ini_set('error_log', $arg_errorfile);
}
chdir( dirname ( __FILE__ ) );//Force a se positionner dans le bon repertoire pour le mode CLI
include("./conf.php");//POUR LES PARAMETRES DU SERVEUR PROXY + MYSQL
include("./definitions.php");//LISTE DES DEFINITIONS DU PROTOCOLE IOBL
include("./crond.php");//GESTION DU CRON

/*
 // ClASS : GESTION DU SERVEUR IOBL
// La classe tourne en boucle inifinie, elle analyse les trames recus sur le CPL puis les transformes et les stocks en DB
// Elle lit et vide une table temporaire pour envoyer les requetes sur le CPL
*/
class legrand_server {
	/*
	 // FONCTION : INITIALISATION DE LA SOCKET
	*/
	private function init_socket($port) {
		set_time_limit(0);
		//Fermeture de la socket si déjà ouverte
		if (isset($this->fd_socket)) {
			@fclose($this->fd_socket);
			sleep(3);
		}
		$this->fd_socket = @fsockopen($this->conf->SERVER_HOST, intval($port), $errno, $errstr);
		if ($this->fd_socket === FALSE) {
			return FALSE;
		}
		stream_set_blocking($this->fd_socket, 1);
		stream_set_timeout($this->fd_socket, 0, $this->conf->SOCKET_TIMEOUT);
		return TRUE;
	}

	/*
	 // FONCTION : INITIALISATION DE LA DB MYSQL
	*/
	private function init_mysql() {
		$this->mysqli = new mysqli($this->conf->MYSQL_HOST, $this->conf->MYSQL_LOGIN, $this->conf->MYSQL_PASS, $this->conf->MYSQL_DB);
		if ($this->mysqli === FALSE) {
			return FALSE;
		}
		return TRUE;
	}

	/*
	 // FONCTION : NETTOYAGE MYSQLI
	// PARAMS : $res=object mysqli::result
	*/
	private function free_mysqli($res) {
		$res->free();
		while($this->mysqli->more_results()){
			$this->mysqli->next_result();
			if($l_result = $this->mysqli->store_result()){
				$l_result->free();
			}
		}
	}

	/*
	 // FONCTION : SAUVEGARDE D'UNE TRAME
	// PARAMS : $decrypt_trame=array, $direction=string(GET | SET)
	*/
	private function save_trame($decrypt_trame, $direction) {
		foreach ($decrypt_trame as $key => $value) {
			if (is_null($value)) {
				$decrypt_trame[$key] = "NULL";
			} else {
				$decrypt_trame[$key] = "'$value'";
			}
		}
		$query = "INSERT INTO `trame` (trame, direction, date) VALUES (".$decrypt_trame["trame"].", '".$direction."', ".$decrypt_trame["date"].")";
		$res = $this->mysqli->query($query);
		if (!$res) {
			print $this->mysqli->error.", QUERY=".$query."\n";
		}
		$id_trame = $this->mysqli->insert_id;
		$query = "INSERT INTO `trame_decrypted` (id_trame, direction, mode, media, format, type, value, dimension, param, id_legrand, unit, date) VALUES ('".$id_trame."', '".$direction."', ".$decrypt_trame["mode"].", ".$decrypt_trame["media"].", ".$decrypt_trame["format"].", ".$decrypt_trame["type"].", ".$decrypt_trame["value"].", ".$decrypt_trame["dimension"].", ".$decrypt_trame["param"].", ".$decrypt_trame["id"].", ".$decrypt_trame["unit"].", ".$decrypt_trame["date"].")";
		$res = $this->mysqli->query($query);
		if (!$res) {
			print $this->mysqli->error.", QUERY=".$query."\n";
		}
	}

	/*
	 // FONCTION : TRANSFORME UN ID ET UN UNIT IOBL EN UN ID OPENWEBNET
	// PARAMS : $id=string|int,$unit=string|int
	// RETURN : $ownId=int
	*/
	private function ioblId_to_ownId($id, $unit) {
		$ownId = ($id*16)+$unit;
		return ($ownId);
	}

	/*
	 // FONCTION : RECUPERATION DE L'ID LEGRAND DANS UN ID OPENWEBNET
	// PARAMS : $own_id=string|int
	// RETURN : $Id=int
	*/
	private function getId($own_id) {
		$UnitSize = 1;
		$IdUnit = dechex($own_id);
		if (strlen($IdUnit) == 7) {
			$UnitSize = 2;
		}
		$Unit = substr($IdUnit, -$UnitSize);
		$Id = hexdec(substr($IdUnit, 0, -$UnitSize).'0')/16;
		return ($Id);
	}

	/*
	 // FONCTION : RECUPERATION DU UNIT DE L'ID LEGRAND DANS UN ID OPENWEBNET
	// PARAMS : $own_id=string|int
	// RETURN : $Unit=int
	*/
	private function getUnit($own_id) {
		$UnitSize = 1;
		$IdUnit = dechex($own_id);
		if (strlen($IdUnit) == 7) {
			$UnitSize = 2;
		}
		$Unit = hexdec(substr($IdUnit, -$UnitSize));
		return ($Unit);
	}

	/*
	 // FONCTION : DECRYPTAGE D'UNE TRAME AU FORMAT LISIBLE
	// PARAMS : $trame=string
	// RETURN : array(
			"trame" => string,
			"media" => 'string',
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,
			"date" => timestamp
			*/
	private function decrypt_trame($trame) {
		$ret_trame = array(
				"trame" => $trame,
				"format" => 'UNKNOWN',
				"mode" => 'UNKNOWN',
				"media" => 'UNKNOWN',
				"type" => 'UNKNOWN',
				"value" => NULL,
				"dimension" => NULL,
				"param" => NULL,
				"id" => NULL,
				"unit" => NULL,
				"date" => date("Y-m-d H:i:s", time())
		);
		$find_trame = false;
		//on teste le format de la trame
		foreach ($this->def->OWN_TRAME as $command => $command_reg) {
			//si on trouve un format valide de trame
			if (preg_match($command_reg, $ret_trame["trame"], $decode_trame)) {
				//on teste le type de la trame
				if ($command == 'BUS_COMMAND' && $decode_trame[1] != '1000') {
					$who = $decode_trame[1];
					$what = $decode_trame[2];
					$where = $decode_trame[3];
					$dimension = NULL;
					$val = NULL;
					$find_trame = true;
				} else if ($command == 'STATUS_REQUEST') {
					$who = $decode_trame[1];
					$what = NULL;
					$where = $decode_trame[2];
					$dimension = NULL;
					$val = NULL;
					$find_trame = true;
				} else if ($command == 'DIMENSION_REQUEST') {
					$who = $decode_trame[1];
					$what = $decode_trame[2];
					$where = $decode_trame[2];
					$dimension = $decode_trame[3];
					$val = $decode_trame[4];
					$find_trame = true;
				} else if ($command == 'DIMENSION_SET') {
					$who = $decode_trame[1];
					$what = $decode_trame[2];
					$where = $decode_trame[4];
					$dimension = $decode_trame[2];
					$val = $decode_trame[3];
					$find_trame = true;
				} else if ($command == 'ACK' || $command == 'NACK') {
					$who = NULL;
					$what = NULL;
					$where = NULL;
					$dimension = NULL;
					$val = NULL;
					$find_trame = true;
				}
				//Impossible de trouver la command dans ce format de la trame
				if ($find_trame == false) {
					continue;
				}
				//On sauvegarde le format
				$ret_trame["format"] = $command;
				//On test le type de la trame
				foreach ($this->def->OWN_TRAME_DEFINITION as $key => $value) {
					if ($key == $who) {
						$ret_trame["type"] = $this->def->OWN_TRAME_DEFINITION[$key]['TYPE'];
						//On recherche s'il existe les value/dimension/param dans la trame
						if (!is_null($what)
								&& (isset($this->def->OWN_TRAME_DEFINITION[$key][$what]) || isset($this->def->OWN_TRAME_DEFINITION[$key][$what.'_']))) {
							// on a un parametre on favorise avec le param
							if ($val && isset($this->def->OWN_TRAME_DEFINITION[$key][$what.'_'])) {
								$ret_trame["value"] = $this->def->OWN_TRAME_DEFINITION[$key][$what.'_'];
								// on test sans param
							} else if (isset($this->def->OWN_TRAME_DEFINITION[$key][$what])) {
								$ret_trame["value"] = $this->def->OWN_TRAME_DEFINITION[$key][$what];
								// on test avec param en dernier recours
							} else if (isset($this->def->OWN_TRAME_DEFINITION[$key][$what.'_'])) {
								$ret_trame["value"] = $this->def->OWN_TRAME_DEFINITION[$key][$what.'_'];
							}
						}
						if (!is_null($dimension)
								&& (isset($this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension]) || isset($this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension.'_']))) {
							// on a un parametre on favorise avec le param
							if ($val && isset($this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension.'_'])) {
								$ret_trame["dimension"] = $this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension.'_'];
								// on test sans param
							} else if (isset($this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension])) {
								$ret_trame["dimension"] = $this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension];
								// on test avec param en dernier recours
							} else if (isset($this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension.'_'])) {
								$ret_trame["dimension"] = $this->def->OWN_TRAME_DEFINITION[$key]['DIMENSION'][$dimension.'_'];
							}
						}
						if ($val) {
							$ret_trame["param"] = $val;
						}
					}
				}
				//ON RECUPE L'ID ET LE UNIT
				preg_match($this->def->OWN_WHERE_DEFINITION, $where, $matches_where);
				if (strlen($matches_where[1]) > 1) {
					$ret_trame["mode"] = $this->def->OWN_COMMUNICATION_DEFINITION[""];
					$matches_id = $matches_where[1];
					$ret_trame["media"] = $this->def->OWN_MEDIA_DEFINITION[$matches_where[2]];
				} else if (strlen($matches_where[2]) > 1) {
					$ret_trame["mode"] = $this->def->OWN_COMMUNICATION_DEFINITION[$matches_where[1]];
					$matches_id = $matches_where[2];
					$ret_trame["media"] = $this->def->OWN_MEDIA_DEFINITION[$matches_where[3]];
				}
				if (isset($matches_id)) {
					$ret_trame["id"] = $this->getId($matches_id);
					$ret_trame["unit"] = $this->getUnit($matches_id);
				} else {
					$ret_trame["id"] = NULL;
					$ret_trame["unit"] = NULL;
				}
				break;
			}
		}
		return $ret_trame;
	}

	/*
	 // FONCTION : CALCUL UNE VALEUR IOBL DE LUMIERE EN POURCENTAGE
	// PARAMS : $iobl_value => string
	// RETOURNE : LA VALEUR EN POURCENTAGE
	*/
	private function calc_iobl_to_light($iobl_value) {
		// Augmentation
		if ($iobl_value < 128) {
			$percent = $iobl_value;
			// Diminution
		} else {
			$percent = $iobl_value - 256;
		}
		return $percent;
	}

	/*
	 // FONCTION : CALCUL UNE VALEUR IOBL DECOMPOSE DE TEMPERATTURE EN UNE VALEUR ENTIERE
	// PARAMS : $iobl_value1 => string, $iobl_value2 => string
	// RETOURNE : LA VALEUR EN POURCENTAGE
	*/
	private function calc_iobl_to_temp($iobl_value1, $iobl_value2) {
		//TODO : VERIFIER LE FONCTIONNEMENT DES TEMPERATURE NEGATIVE (SI POSSIBLE) ????
		$value = ($iobl_value1*256)+$iobl_value2;
		return $value;
	}

	/*
	 // FONCTION : MISE A JOUR DU STATUS DES SCENARIO
	// PARAMS : $decrypted_trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,
			"date" => date)
	*/
	private function updateStatusScenario($decrypted_trame) {
		//TODO NE METTRE A JOUR LE STATUS AVEC LA COMMANDE EXEMPLE "ACTION" SUR VARIATEUR UNIT "4" NE PAS CHANGER LE STATUS
		//Il ne s'agit plus de mettre � jour...
		if ($decrypted_trame['value'] == 'STOP_ACTION') {
			return;
		}
		//Creation des variables utiles
		$id = $decrypted_trame["id"];
		$unit = $decrypted_trame["unit"];
		$value = $decrypted_trame["value"];
		$date = $decrypted_trame["date"];
		//Mise a jour de la commande du scenario
		$query = "UPDATE `equipements_status` SET status='$value' WHERE id_legrand='$id' AND unit='$unit'";
		$this->mysqli->query($query);
		//On recherche les elements affectés et comment il réagisse
		$query = "SELECT DISTINCT scenarios.id_legrand, scenarios.unit, scenarios.value_listen,
		references.family, scenarios.id_legrand_listen, scenarios.unit_listen
		FROM scenarios LEFT JOIN (equipements LEFT JOIN boxio.references
		ON equipements.ref_legrand = references.ref_legrand) ON scenarios.id_legrand = equipements.id_legrand
		WHERE scenarios.id_legrand_listen='$id' AND scenarios.unit_listen='$unit';";
		$res = $this->mysqli->query($query);
		$scenarios_decrypted_trame = array(
				'format' => 'DIMENSION_REQUEST',
				'date' => $date
		);
		while ($row = $res->fetch_assoc()) {
			$scenarios_decrypted_trame['id'] = $row['id_legrand'];
			$scenarios_decrypted_trame['unit'] = $row['unit'];
			//CAS DES LUMIERES
			if ($row['family'] == 'LIGHTING') {
				$scenarios_decrypted_trame['type'] = 'LIGHTING';
				//on teste le format de la trame
				foreach ($this->def->OWN_SCENARIO_DEFINITION['LIGHTING'] as $command => $command_reg) {
					//si on trouve un format valide de trame
					if (preg_match($command_reg, $row['value_listen'])) {
						if ($command == 'LEVEL') {
							$scenarios_decrypted_trame['value'] = '';
							$scenarios_decrypted_trame['dimension'] = 'GO_TO_LEVEL_TIME';
							$scenarios_decrypted_trame['param'] = $row['value_listen'].'*0';
						} else {
							$scenarios_decrypted_trame['value'] = $command;
							$scenarios_decrypted_trame['dimension'] = '';
							$scenarios_decrypted_trame['param'] = '';
						}
						//ON SIMULE EN INTERNE UNE TRAME DE MISE A JOUR
						$this->updateStatusLight($scenarios_decrypted_trame, false);
					}
				}
			}
			else if ($row['family'] == 'SHUTTER') {
				$scenarios_decrypted_trame['type'] = 'SHUTTER';
				//on teste le format de la trame
				foreach ($this->def->OWN_SCENARIO_DEFINITION['SHUTTER'] as $command => $command_reg) {
					//si on trouve un format valide de trame
					if (preg_match($command_reg, $row['value_listen'])) {
						$scenarios_decrypted_trame['value'] = $command;
						$scenarios_decrypted_trame['dimension'] = '';
						$scenarios_decrypted_trame['param'] = '';
						//ON SIMULE EN INTERNE UNE TRAME DE MISE A JOUR
						$this->updateStatusShutter($scenarios_decrypted_trame, false);
					}
				}
			}
		}
	}

	/*
	 // FONCTION : MISE A JOUR DU STATUS DES LIGHTS
	// PARAMS : $decrypted_trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,)
	$scenarios => boolean (true si l'on doit recherche des scenarios associés)
	*/
	private function updateStatusLight($decrypted_trame, $scenarios) {
		//Creation des variables utiles
		$id = $decrypted_trame["id"];
		$unit = $decrypted_trame["unit"];
		//recuperation du derniere etat connu si necessaire ET du unit principale de sauvegarde des status
		$query = "SELECT unit_status FROM view_equipements_status WHERE id_legrand='$id' AND unit='$unit';";
		$res = $this->mysqli->query($query)->fetch_assoc();
		$unit_status = $res["unit_status"];
		if ($decrypted_trame["value"] == 'ON') {
			$status = 100;
			$value = $decrypted_trame["value"];
		} else if ($decrypted_trame["value"] == 'OFF') {
			$status = 0;
			$value = $decrypted_trame["value"];
		} else if ($decrypted_trame["dimension"] == 'DIM_STEP') {
			$query = "SELECT status FROM view_equipements_status WHERE id_legrand='$id' AND unit='$unit_status';";
			$res = $this->mysqli->query($query)->fetch_assoc();
			$old_status = $res["status"];
			if (!is_numeric($old_status)) {
				$old_status = 0;
			}
			$value = $decrypted_trame["dimension"];
			preg_match('/(\d+)/', $decrypted_trame["param"], $param);
			//on test si le status est trouve
			if (isset($param[1])) {
				$change_status = $this->calc_iobl_to_light($param[1]);
				$status = $old_status + $change_status;
				if ($status > 100) {
					$status = 100;
				} else if ($status < 0) {
					$status = 0;
				}
			} else {
				$status = $old_status;
			}
		} else if ($decrypted_trame["dimension"] == 'GO_TO_LEVEL_TIME') {
			$value = $decrypted_trame["dimension"];
			preg_match('/(\d+)/', $decrypted_trame["param"], $param);
			//on test si le status est trouve
			if (isset($param[1])) {
				$status = $param[1];
				if ($status > 100) {
					$status = 100;
				} else if ($status < 0) {
					$status = 0;
				}
			} else {
				$status = NULL;
			}
			//Il ne s'agit pas d'une mise à jour
		} else {
			return;
		}
		//on n'a pas trouve le nouveau status, erreur dans la trame ?
		if ($status === NULL) {
			return;
		}
		//Mise à jour de la touche de l'equipement (s'il ne s'agit pas du unit_status)
		if ($unit != $unit_status) {
			$query = "UPDATE `equipements_status` SET status='$value' WHERE id_legrand='$id' AND unit='$unit'";
			$this->mysqli->query($query);
		}
		//Mise à jour interne du status de l'equipement
		$query = "UPDATE `equipements_status` SET status='$status' WHERE id_legrand='$id' AND unit='$unit_status'";
		$this->mysqli->query($query);
		//Mise à jour des scenarios si necessaire
		if ($scenarios === true && $decrypted_trame["dimension"] != 'GO_TO_LEVEL_TIME') {
			$scenarios_decrypted_trame = $decrypted_trame;
			$query = "SELECT id_legrand,unit FROM scenarios WHERE id_legrand_listen='$id' AND unit_listen='$unit' AND id_legrand<>'$id';";
			$res = $this->mysqli->query($query);
			while ($row = $res->fetch_assoc()) {
				$scenarios_decrypted_trame['id'] = $row['id_legrand'];
				$scenarios_decrypted_trame['unit'] = $row['unit'];
				$this->updateStatusLight($scenarios_decrypted_trame, false);
			}
		}
	}

	/*
	 // FONCTION : MISE A JOUR DU STATUS DES VOLETS
	// PARAMS : $decrypted_trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,)
	$scenarios => boolean (true si l'on doit recherche des scenarios associés)
	*/
	private function updateStatusShutter($decrypted_trame, $scenarios) {
		//Creation des variables utiles
		$id = $decrypted_trame["id"];
		$unit = $decrypted_trame["unit"];
		//On recupere la date de l'action et on ajoute le temps du relais interne
		$date = strtotime($decrypted_trame["date"]) + $this->def->SHUTTER_RELAY_TIME;
		//recuperation du derniere etat connu ET des possibilites
		$query = "SELECT unit_status, possibility, server_opt, status AS 'last_status' FROM view_equipements_status WHERE id_legrand='$id' AND unit='$unit';";
		$res = $this->mysqli->query($query)->fetch_assoc();
		$unit_status = $res["unit_status"];
		$possibility = $res["possibility"];
		$last_status = $res["last_status"];
		//on test s'il faut faire un update des status
		if ($decrypted_trame["value"] == 'MOVE_UP'
				|| $decrypted_trame["value"] == 'MOVE_DOWN'
				|| $decrypted_trame["value"] == 'MOVE_STOP') {
			$value = $decrypted_trame["value"];
			//Il ne s'agit pas d'une mise à jour
		} else {
			return;
		}
		//Recuperation des options
		if ($res["server_opt"] != "") {
			preg_match_all('/(?P<param>.+?)=(?P<value>[^;]+);*/', $res["server_opt"], $server_opt);
			$params = array();
			foreach ($server_opt['param'] as $opt => $opt_value) {
				$params[$opt_value] = $server_opt['value'][$opt];
			}
		}
		//gestion des temps ouverture/fermeture en fonction de la date
		if (strpos($possibility, 'MEMORY') !== FALSE) {
			if (isset($params['move_time'])) {
				$move_time = $params['move_time'];
			} else {
				$move_time = $this->def->DEFAULT_SHUTTER_MOVE_TIME;
			}
			//mise a jour en fonction du moveent demande
			if ($value == 'MOVE_UP') {
				//Si le volet est en train de monter
				if ($last_status == 'UP') {
					$status = 'UP';
					//Si le volet est deja en haut
				} else if ($last_status == 100) {
					$status = '100';
					//Si le volet change de sens
				} else if ($last_status == 'DOWN') {
					$status = 'UP';
					$new_pos = ($move_time - ($this->waitingStatus[$id.$unit]['date'] - $date))/$move_time*100;
					$move_time = round($new_pos/100*$move_time);
					$this->waitingStatus[$id.$unit]['date'] = $date+$move_time;
					$this->waitingStatus[$id.$unit]['status'] = '100';
					//Si le volet est en position intermediaire
				} else if (is_numeric($last_status)) {
					$status = 'UP';
					$this->waitingStatus[$id.$unit] = array();
					$move_time = $move_time - ($last_status/100*$move_time);
					$this->waitingStatus[$id.$unit]['date'] = $date+$move_time;
					$this->waitingStatus[$id.$unit]['status'] = '100';
				}
			} else if ($value == 'MOVE_DOWN') {
				//Si le volet est en train de descendre
				if ($last_status == 'DOWN') {
					$status = 'DOWN';
					//Si le volet est deja en bas
				} else if ($last_status == 0) {
					$status = '0';
					//Si le volet change de sens
				} else if ($last_status == 'UP') {
					$status = 'DOWN';
					$new_pos = 100 - (($move_time - ($this->waitingStatus[$id.$unit]['date'] - $date))/$move_time*100);
					$move_time = round($new_pos/100*$move_time);
					$this->waitingStatus[$id.$unit]['date'] = $date+$move_time;
					$this->waitingStatus[$id.$unit]['status'] = '0';
					//Si le volet est arrete en position intermediaire
				} else if (is_numeric($last_status)) {
					$status = 'DOWN';
					$this->waitingStatus[$id.$unit] = array();
					$move_time = ($last_status/100*$move_time);
					$this->waitingStatus[$id.$unit]['date'] = $date+$move_time;
					$this->waitingStatus[$id.$unit]['status'] = '0';
				}
			} else if ($value == 'MOVE_STOP') {
				//Par defaut on dit que le volet est arrete et donc à son ancienne position
				$status = $last_status;
				//Si le volet est deja en mouvement
				if (!is_numeric($last_status) && isset($this->waitingStatus[$id.$unit])) {
					$new_pos = ($move_time - ($this->waitingStatus[$id.$unit]['date'] - $date))/$move_time*100;
					unset($this->waitingStatus[$id.$unit]);
					if ($last_status == 'UP') {
						$status = round($new_pos);
					} else if ($last_status == 'DOWN') {
						$status = round(100 - $new_pos);
					}
				}
			}
			//mise a jour simple du bouton
		} else {
			$status = $value;
		}
		//Mise à jour de la touche de l'equipement (s'il ne s'agit pas du unit_status OU de la memoire cas particulier du SOMFY RF)
		if ($unit != $unit_status || strpos($possibility, 'MEMORY') === FALSE) {
			$query = "UPDATE `equipements_status` SET status='$value' WHERE id_legrand='$id' AND unit='$unit'";
			$this->mysqli->query($query);
		}
		//Mise à jour interne du status de l'equipement
		if (strpos($possibility, 'MEMORY') !== FALSE) {
			$query = "UPDATE `equipements_status` SET status='$status' WHERE id_legrand='$id' AND unit='$unit_status'";
			$this->mysqli->query($query);
		}
		//Mise à jour des groupe de volet en parametre (INTERFACE SOMFY)
		if (isset($params['grp_opt'])) {
			$grp_shutter = explode(',', $params['grp_opt']);
			$grp_decrypted_trame = $decrypted_trame;
			foreach ($grp_shutter as $grp => $new_unit) {
				$grp_decrypted_trame['unit'] = $new_unit;
				$this->updateStatusShutter($grp_decrypted_trame, false);
			}
		}
		//Mise à jour des scenarios si necessaire
		if ($scenarios === true) {
			$scenarios_decrypted_trame = $decrypted_trame;
			$query = "SELECT id_legrand,unit FROM scenarios WHERE id_legrand_listen='$id' AND unit_listen='$unit';";
			$res = $this->mysqli->query($query);
			while ($row = $res->fetch_assoc()) {
				$scenarios_decrypted_trame['id'] = $row['id_legrand'];
				$scenarios_decrypted_trame['unit'] = $row['unit'];
				$this->updateStatusShutter($scenarios_decrypted_trame, false);
			}
		}
	}

	/*
	 // FONCTION : MISE A JOUR DU STATUS DES UNITS EN ATTENTE
	*/
	private function updateWaitingStatus() {
		//Variable qui stocke les eventuelle futur mise à jour
		if (!isset($this->waitingStatus)) {
			$this->waitingStatus = array();
		}
		foreach($this->waitingStatus as $idunit => $value) {
			if (time() >= $this->waitingStatus[$idunit]['date']) {
				$id = substr($idunit, 0, -1);
				$unit = substr($idunit, -1);
				$query = "UPDATE equipements_status SET status='".$this->waitingStatus[$idunit]['status']."' WHERE id_legrand='$id' AND unit='$unit';";
				$res = $this->mysqli->query($query);
				if (!$res) {
					print $this->mysqli->error.", QUERY=".$query."\n";
				}
				unset($this->waitingStatus[$idunit]);
			}
		}
	}

	/*
	 // FONCTION : MISE A JOUR DU STATUS DES UNITS
	// PARAMS : $decrypted_trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,
			*/
	private function updateStatus($decrypted_trame) {
		//CAS DES VOLETS
		if ($decrypted_trame['type'] == 'SHUTTER') {
			$this->updateStatusShutter($decrypted_trame, true);
			//CAS DES LUMIERES
		} else if ($decrypted_trame['type'] == 'LIGHTING') {
			$this->updateStatusLight($decrypted_trame, true);
			//CAS DES SCENARIOS
		} else if ($decrypted_trame['type'] == 'SCENE') {
			$this->updateStatusScenario($decrypted_trame);
			//ON NE S'EST PAS DE QUOI IL S'AGIT, ON QUITTE
		} else {
			return;
		}
	}

	/*
	 // FONCTION : LECTURE DES REQUEST DU STATUS DES UNITS
	// PARAMS : $decrypted_trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,
			"date" => date
			*/
	private function updateRequestStatus($decrypted_trame) {
		//ON VERIFIE SI IL S'AGIT D'UNE REQUEST
		if ($decrypted_trame['type'] == 'CONFIGURATION' && $decrypted_trame['dimension'] == "UNIT_DESCRIPTION_STATUS") {
			$params = preg_split('/[\*|#]/', $decrypted_trame['param']);
			$type = $this->def->OWN_UNIT_DEFINITION[$params[0]][0];
			$id = $decrypted_trame['id'];
			$unit = $decrypted_trame['unit'];
			//MISE A JOUR DES LIGHTS
			if ($type == 'variator' || $type == 'inter') {
				$status = $params[1];
				//cas des inter non variateur 0=OFF et 128=ON=100
				if ($status == '128') {
					$status = '100';
				}
				$query = "UPDATE equipements_status SET status='$status' WHERE id_legrand='$id' AND unit='$unit';";
				$this->mysqli->query($query);
			}
			//MISE A JOUR DES THERMOSTATS
			else if ($type == 'confort' || $type == 'inter_confort') {
				if ($type == 'confort') {
					foreach ($this->def->OWN_STATUS_DEFINITION['CONFORT'] as $command => $reg) {
						if (preg_match($reg, $params[1])) {
							$mode = $command;
						}
					}
					$internal_temp = $this->calc_iobl_to_temp($params[2], $params[3]);
					$wanted_temp = $this->calc_iobl_to_temp($params[4], $params[5]);
					$status = "mode=$mode;internal_temp=$internal_temp;wanted_temp=$wanted_temp";
				} else if ($type == 'inter_confort') {
					if ($params[2] == '100') {
						$status = 'ON';
					} else {
						$status = 'OFF';
					}
				}
				$query = "UPDATE equipements_status SET status='$status' WHERE id_legrand='$id' AND unit='$unit';";
				$this->mysqli->query($query);
			}
			//MISE A JOUR DES VOLETS
			else if ($type == 'shutter') {
				;
			}
			//ON NE S'EST PAS DE QUOI IL S'AGIT, ON QUITTE
		} else {
			return;
		}
	}

	/*
	 // FONCTION : GESTION DE LA CRONTAB UTILISATEUR
	*/
	private function cronTabUser() {
		//Premiere appel on regarde en base la CRONTAB et on construit la classe crond
		if (!isset($this->crond)) {
			$this->crond = new crond();
			$res = $this->mysqli->query("SELECT * FROM view_cron WHERE active=1");
			while ($cron_array = $res->fetch_assoc()) {
				$this->crond->addCron($cron_array['id'],
						$cron_array['minutes'],
						$cron_array['heures'],
						$cron_array['jour'],
						$cron_array['jourSemaine'],
						$cron_array['mois']);
			}
			//On regarde s'il y a une execuction à réaliser
		} else {
			$id = $this->crond->findNextCronTab();
			//Si la prochaine execution est dépassée on execute la CRON
			if (time() >= $this->crond->crontab[$id]['prochain']) {
				$res = $this->mysqli->query("SELECT * FROM view_cron WHERE id='".$id."'");
				$cron_array = $res->fetch_assoc();
				if ($cron_array['trame'] != NULL) {
					$res = $this->mysqli->query("CALL send_trame('".$cron_array['trame']."', NOW())");
					$this->free_mysqli($res);
				} else if ($cron_array['id_favoris'] != NULL) {
					$res = $this->mysqli->query("CALL send_favoris('".$cron_array['id_favoris']."')");
					$this->free_mysqli($res);
				} else if ($cron_array['id_macro'] != NULL) {
					$res = $this->mysqli->query("CALL send_macro('".$cron_array['id_macro']."')");
					$this->free_mysqli($res);
				}
				//Mise à jour du Cron
				$this->crond->updateCron($id);
			}
		}
	}

	/*
	 // FONCTION : CREATION DE REQUETE POUR LA MISE A JOUR DES STATUS
	*/
	private function cronRequestStatus() {
		//Premiere appel on regarde en base qui est concerné et on construit le tableau des mises à jours
		if (!isset($this->cronRequest)) {
			$this->cronRequest = array();
			$res = $this->mysqli->query("SELECT id_legrand, unit, server_opt FROM boxio.equipements_status WHERE server_opt LIKE '%upd_time%'");
			//permet de décaler les requetes dans le temps pour eviter une saturation
			$decal_time = 2;
			$time = time();
			while ($trame = $res->fetch_assoc()) {
				$id_legrand = $trame['id_legrand'];
				$unit = $trame['unit'];
				preg_match("/upd_time=(\d+)/", $trame['server_opt'], $matches);
				$upd_time = $matches[1];
				$next_request = $time+$decal_time;
				$decal_time += $decal_time;
				$this->cronRequest[$id_legrand.$unit] = array();
				$this->cronRequest[$id_legrand.$unit]['id'] = $id_legrand;
				$this->cronRequest[$id_legrand.$unit]['unit'] = $unit;
				$this->cronRequest[$id_legrand.$unit]['upd_time'] = $upd_time;
				$this->cronRequest[$id_legrand.$unit]['next_request'] = $next_request;
			}
			//On regarde les mises à jour necessaire et on prevoit les prochaines
		} else {
			foreach($this->cronRequest as $idunit => $request) {
				if (time() >= $this->cronRequest[$idunit]['next_request']) {
					$ownid = $this->ioblId_to_ownId($this->cronRequest[$idunit]['id'], $this->cronRequest[$idunit]['unit']);
					$res = $this->mysqli->query("CALL send_trame('*#1000*$ownid*55##', NOW())");
					$this->free_mysqli($res);
					$this->cronRequest[$idunit]['next_request'] = time()+$this->cronRequest[$idunit]['upd_time'];
				}
			}
		}
	}

	/*
	 // FONCTION : LECTURE / ECRITURE DE LA SOCKET EN BOUCLE INFINIE
	*/
	private function read_socket() {
		//On vide toutes les actions pour prevenir d'une surcharge de commandes stockées hors fonctionnement
		$this->mysqli->query("TRUNCATE trame_standby");
		$trame = '';
		echo "Connexion a l'interface et a la socket\n";
		while (!feof($this->fd_socket)) {
			//Boucle infinie sur la socket ouverte
			//Lecture de la socket
			$trame .= fgets($this->fd_socket);
			//Analise et sauvegarde de la trame recu
			while (preg_match("/(.*?##)(.*)$/", $trame, $matches)) {
				//On ne sauvegarde pas les trames ACK et NACK qui ne servent à rien ! car pas d'identifiant sur qui l'a envoyé !!??
				if (!preg_match($this->def->OWN_TRAME['ACK'], $matches[1]) && !preg_match($this->def->OWN_TRAME['NACK'], $matches[1])) {
					$decrypt_trame = $this->decrypt_trame($matches[1]);
					$this->updateStatus($decrypt_trame);
					$this->updateRequestStatus($decrypt_trame);
					$this->save_trame($decrypt_trame, 'GET');
				}
				$trame = $matches[2];
			}
			//Analise des mises update en attente
			$this->updateWaitingStatus();
			//Analise des crons interne pour les mises à jours
			$this->cronRequestStatus();
			//Analise des crons utilisateurs
			$this->cronTabUser();
			//Analise et envoi des trames en attentes dans l'ordre des dates d'insertion
			$res = $this->mysqli->query("SELECT id, trame FROM trame_standby WHERE date <= NOW() ORDER BY date ASC");
			$new_trames = array();
			$del_trames = "";
			$coma = "";
			while ($trame_array = $res->fetch_assoc()) {
				$new_trames[] = $trame_array['trame'];
				$del_trames .= $coma." id='".$trame_array['id']."'";
				$coma = " OR ";
			}
			if ($del_trames != "") {
				$this->mysqli->query("DELETE FROM trame_standby WHERE ".$del_trames);
			}
			foreach($new_trames as $set_trame) {
				fputs($this->fd_socket, $set_trame);
				$decrypt_trame = $this->decrypt_trame($set_trame);
				$this->updateStatus($decrypt_trame);
				$this->save_trame($decrypt_trame, 'SET');
			}
		}
		echo "Interface innaccessible ou socket fermee !\n";
		return FALSE;
	}

	/*
	 // FONCTION : FUNCTION PRINCIPALE DE LANCEMENT DU SERVEUR
	*/
	public function init() {
		$this->conf = new legrand_conf();
		$this->def = new legrand_def();
		//Detection de l'OS
		echo "Serveur de type : ".PHP_OS."\n";
		if (preg_match("/win/i", PHP_OS)) {
			$find_IP = exec('ipconfig /all | find "IPv4"');
		} else {
			$find_IP = exec("ifconfig | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}'");
		}
		if (preg_match("/(\d+\.\d+\.\d+\.\d+)/", $find_IP, $matches)) {
			$IP = $matches[0];
		} else {
			$IP = "Inconnue !";
		}
		//Affecation de l'IP
		if (isset($this->conf->PHP_HOST)) {
			$IP = $this->conf->PHP_HOST;
		} else {
			$this->conf->PHP_HOST = $IP;
		}
		echo "Votre IP d'acces au Serveur est : ".$IP."\n";
		if (stristr('cli', php_sapi_name()) === FALSE) {
			echo "Serveur initialiser en ".php_sapi_name()." mode : Erreur, Vous de devez lancer le serveur en ligne de commande !";
			exit;
		} else {
			echo "Serveur initialiser en ".php_sapi_name()." mode le ".date("Y-m-d H:i:s")." : OK\n";
		}
		//Initialisation du MySQl
		if ($this->init_mysql() === FALSE) {
			echo "Serveur Mysql sur ".$this->conf->MYSQL_LOGIN.":*******@".$this->conf->MYSQL_HOST." Database:".$this->conf->MYSQL_DB." : Erreur, Impossible d'ouvrir une socket valide !";
			exit;
		} else {
			echo "Serveur Mysql sur ".$this->conf->MYSQL_LOGIN.":*******@".$this->conf->MYSQL_HOST." Database:".$this->conf->MYSQL_DB." : OK\n";
		}
		//Initialisation du PROXY
		if (isset($this->conf->SERVER_PORT)) {
			$proxy_result = $this->init_socket($this->conf->SERVER_PORT);
			$proxy_result = $this->read_socket();
		} else {
			foreach ($this->conf->SERVER_DEFAULT_PORTS as $ports) {
				$proxy_result = $this->init_socket($ports);
				if ($proxy_result === FALSE) {
					echo "Serveur Proxy initialise sur ".$this->conf->SERVER_HOST.":".$ports." : ERREUR\n";
				} else {
					echo "Serveur Proxy initialise sur ".$this->conf->SERVER_HOST.":".$ports." : OK\n";
					$proxy_result = $this->read_socket();
				}
			}
		}
		if ($proxy_result === FALSE) {
			echo "Serveur Proxy sur ".$this->conf->SERVER_HOST." : Erreur, Impossible d'ouvrir une socket valide !\n";
			exit;
		}
	}
}

//CREATION DE LA CLASSE ET LANCEMENT DU SERVEUR
$lg = new legrand_server();
$lg->init();

?>