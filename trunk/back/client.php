<?php

include("./conf.php");
include("./definitions.php");

class legrand_client {

	/*
	 // FONCTION : INITIALISATION DE LA DB MYSQL
	*/
	private function init_mysql() {
		$this->mysqli = new mysqli($this->conf->MYSQL_HOST, $this->conf->MYSQL_LOGIN, $this->conf->MYSQL_PASS, $this->conf->MYSQL_DB);
	}

	/*
	 // FONCTION : INITIALISATION DU MODE DE SORTIE
	*/
	private function init_output($type='XML') {
		$this->output_type = $type;
		if ($this->output_type == 'XML') {
			header('Content-type: text/xml; charset=utf-8');
		} else if ($this->output_type == 'JSON') {
			header('Content-type: application/json; charset=utf-8');
		}
		$this->xml = new DOMDocument('1.0', 'utf-8');
		$this->xml_root = $this->xml->createElement('root');
	}
	
	/*
	 // FONCTION : AFFICHAGE DE LA SORTIE
	*/
	private function flush_output() {
		//on finalise le xml
		$this->xml->appendChild($this->xml_root);
		$xml = utf8_encode($this->xml->saveXML());
		
		//Affichage en XML
		if ($this->output_type == 'XML') {
			print $xml;
		//Transformation et affichage en JSON
		} else if ($this->output_type == 'JSON') {
			$xml = str_replace(array("\n", "\r", "\t"), '', $xml);
			$xml = trim(str_replace('"', "'", $xml));
			print json_encode(simplexml_load_string($xml));
		}
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
	 // FONCTION : TRANSFORMATION DES PARAMS GET EN REQUETE MYSQLI POUR WHERE/ORDER/LIMIT
	// RETURN : $query
	*/
	private function get_to_mysqli() {
		//Gestion des filtres
		$query = "";
		if (isset($_GET['filter'])) {
			$tab_type = array(
					"lt" => "<",
					"gt" => ">",
					"eq" => "="
					);
			$filter = json_decode(urldecode($_GET['filter']));
			for ($i=0,$query_array=array(); $filter[$i]; $i++) {
				if (!isset($filter[$i]->{'type'})) {
					$query_array[] = sprintf("%s='%s'", $filter[$i]->{'property'}, utf8_decode($filter[$i]->{'value'}));
				}
				else if ($filter[$i]->{'type'} == 'string') {
					$query_array[] = sprintf("%s LIKE '%%%s%%'", $filter[$i]->{'field'}, utf8_decode($filter[$i]->{'value'}));
				} else if ($filter[$i]->{'type'} == 'numeric') {
					$query_array[] = sprintf("%s%s%s", $filter[$i]->{'field'}, $tab_type[$filter[$i]->{'comparison'}], utf8_decode($filter[$i]->{'value'}));
				} else if ($filter[$i]->{'type'} == 'list') {
					for ($j=0, $type_array=array(); $filter[$i]->{'value'}[$j]; $j++) {
						$type_array[] = sprintf("%s='%s'", $filter[$i]->{'field'}, utf8_decode($filter[$i]->{'value'}[$j]));
					}
					$query_array[] = '('.implode(' OR ', $type_array).')';
				} else if ($filter[$i]->{'type'} == 'boolean') {
					if ($filter[$i]->{'value'} == true) {
						$query_array[] = sprintf("%s is true", $filter[$i]->{'field'});
					} else {
						$query_array[] = sprintf("%s is false", $filter[$i]->{'field'});
					}
				} 
			}
			$query .= sprintf(" WHERE %s", implode(' AND ', $query_array));
		}
		//Gestion du triage
		if (isset($_GET['sort']) || isset($_GET['group'])) {
			$query .= ' ORDER BY ';
			if (isset($_GET['group'])) {
				$group = json_decode(urldecode($_GET['group']));
				if ($group[0]->{'property'} != $_GET['sort']) {
					$query .= $group[0]->{'property'};
					if (isset($group[0]->{'direction'})) {
						$query .= ' '.$group[0]->{'direction'};
					}
					if (isset($_GET['sort'])) {
						$query .= ', ';
					}
				}
			}
			if (isset($_GET['sort'])) {
				$query .= $_GET['sort'];
				if (isset($_GET['dir'])) {
					$query .= ' '.$_GET['dir'];
				}
			}
		}
		//Gestion du nombre de resultats
		if (isset($_GET['start'])) {
			$start = $_GET['start'];
		} else {
			$start = 0;
		}
		if (isset($_GET['limit'])) {
			$limit = $_GET['limit'];
		} else {
			$limit = 10;
		}
		$query .= sprintf(" LIMIT %s,%s", $start, $limit);
		return $query;
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
	 // FONCTION : DECRYPTAGE DES PARAMETRES
	// PARAMS : $function=string => fonction a analyser
	$param=string => liste params separes par des * ou #
	$ret_type=string => type du format retourne 'string' ou 'array'
	// RETURN : $decrypted_array=array|$decrypted_string=string
	*/
	private function get_params($function, $param, $ret_type='string') {
		$params = preg_split('/[\*|#]/', $param);
		$coma = '';
		$decrypted_string = '';
		$decrypted_array = array();
		//Le parametre est inconnu
		if (!isset($this->def->OWN_PARAM_DEFINITION[$function])) {
			$decrypted_string = 'unknown='.$param;
			$decrypted_array['unknown'] = $param;
			//Le parametre est de type UNIT_DESCRIPTION_STATUS on decrypt de quoi il s'agit
		} else if ($function == "UNIT_DESCRIPTION_STATUS" && isset($this->def->OWN_UNIT_DEFINITION[$params[0]])) {
			for ($i = 0; $i < count($this->def->OWN_UNIT_DEFINITION[$params[0]]); $i++) {
				if (isset($params[$i])) {
					$decrypted_array[$this->def->OWN_UNIT_DEFINITION[$params[0]][$i]] = $params[$i];
					$decrypted_string .= $coma.$this->def->OWN_UNIT_DEFINITION[$params[0]][$i].'='.$params[$i];
					$coma = ';';
				}
			}
			//Le parametre est decrypte normalement
		} else {
			for ($i = 0; $i < count($this->def->OWN_PARAM_DEFINITION[$function]); $i++) {
				if (isset($params[$i])) {
					$decrypted_array[$this->def->OWN_PARAM_DEFINITION[$function][$i]] = $params[$i];
					if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "reference"
							|| $this->def->OWN_PARAM_DEFINITION[$function][$i] == "version") {
						$params[$i] = dechex(intval($params[$i]));
					}
					else if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "address") {
						$params[$i] = $this->getId($params[$i]).'/'.$this->getUnit($params[$i]);
					}
					else if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "family_type") {
						$params[$i] = $this->def->OWN_FAMILY_DEFINITION[$params[$i]];
					}
					$decrypted_string .= $coma.$this->def->OWN_PARAM_DEFINITION[$function][$i].'='.$params[$i];
					$coma = ';';
				}
			}
			if ($i < count($params)) {
				$decrypted_array['other_params'] = '';
				$decrypted_string .= ';other=';
				$coma = '';
				while ($i < count($params)) {
					$decrypted_array['other_params'] .= '*'.$params[$i];
					$decrypted_string .= $coma.$params[$i++];
					$coma = '*';
				}
			}
		}
		if ($ret_type == 'string') {
			return ($decrypted_string);
		} else if ($ret_type == 'array') {
			return ($decrypted_array);
		}
	}

	/*
	 // FONCTION : TRANSFORMATION D'UN ID ET UNIT LEGRAND EN OWN ID
	// PARAM : UN ID LEGRAND, UN UNIT LEGRAND
	// RETOURNE : UN OWN ID
	*/
	private function idunit_to_ownid($id, $unit) {
		$ownid = ($id*16)+$unit;
		return $ownid;
	}

	/*
	 // FONCTION : TRANSFORMATION D'UNE TRAME GET EN CPL
	// PARAM : UNE TRAME COMPOSEE DES CARACTERES [0-9YZ]
	// RETOURNE : UNE TRAME DTMF COMPOSEE DES CARACTERES [0-9#]
	*/
	private function YZ_to_starsharp($trame) {
		$trame = str_replace('Y', '*', $trame);
		$trame = str_replace('Z', '#', $trame);
		return $trame;
	}

	/*
	 // FONCTION : TEST DE VALIDITE D'UNE TRAME IOBL
	// PARAM : UNE TRAME IOBL
	// RETOURNE : true OU false si la trame est valide ou non
	*/
	private function test_trame($trame) {
		foreach($this->def->OWN_TRAME as $key => $value) {
			if (preg_match($value, $trame)) {
				return true;
			}
		}
		return false;
	}

	/*
	 // FONCTION : ENVOIE D'UNE TRAME IOBL SUR LE CPL
	// PARAM : UNE TRAME COMPOSEE DES CARACTERES [0-9YZ]
	// RETOURNE : UN FICHIER XML
	*/
	private function send_trame($get_trame, $date=NULL) {
		if ($date == NULL) {
			$date = 'NOW()';
		} else {
			$date = "'".$date."'";
		}
		$trame = $this->YZ_to_starsharp($get_trame);
		$res_trame = $this->test_trame($trame);
		if ($res_trame == true) {
			$res = $this->mysqli->query("CALL send_trame('".$trame."', ".$date.")") ;
		} else {
			$res = 'Trame non valide :'.$trame;
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = "CALL send_trame('".$trame."', ".$date.")";
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if ($res_trame == false) {
			$tag_return = $this->xml->createElement('return', $res);
			$attr_return->value = 'false';
		} else if (!$res) {
			$tag_return = $this->xml->createElement('return', $this->mysqli->error);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', $this->mysqli->affected_rows);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		$tag_module = $this->xml->createElement('module');
		$attr_module = $this->xml->createAttribute('num');
		$attr_module->value = '1';
		$tag_module->appendChild($attr_module);
		$tag_item = $this->xml->createElement('trame',$trame);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}


	////////////////////////////////////////////////////
	// PUBLIC FUNCTIONS
	////////////////////////////////////////////////////


	/*
	 // FONCTION : AFFICHE UNE VUE MYSQL ET RETOURNE LE RESULTAT
	// PARAM : view_name=string,where=string
	// RETOURNE : UN FICHIER XML
	*/
	public function view_to_xml($view_name, $where) {
		//Requetage et preparation des resultats
		//cas particuler du comptage des trames
		if ($view_name == 'view_all_trame') {
			$query = "SELECT COUNT(*) AS total FROM trame_decrypted";
		} else {
			$query = "SELECT COUNT(*) AS total FROM ".$view_name;
		}
		if (preg_match('/WHERE/i', $where)) {
			$query .= $where;
		}
		$res = $this->mysqli->query($query);
		$trame = $res->fetch_assoc();
		$total = $trame['total'];
		$query = "SELECT * FROM ".$view_name.$where;
		$res = $this->mysqli->query($query);
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = $view_name;
		$tag_request->appendChild($attr_request);
		//Creation de l'elem total
		$tag_total = $this->xml->createElement('total', $total);
		$tag_request->appendChild($tag_total);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if (!$res) {
			$tag_return = $this->xml->createElement('return', 'Error='.$this->mysqli->error.'; Request='.$query);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', 'Request='.$query);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		if ($res) {
			for ($i=1; $trame = $res->fetch_assoc(); $i++) {
				$tag_module = $this->xml->createElement('module');
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $i;
				$tag_module->appendChild($attr_module);
				foreach ($trame as $key => $value) {
					$tag_item = $this->xml->createElement($key,$value);
					$tag_module->appendChild($tag_item);
				}
				$tag_elems->appendChild($tag_module);
			}
		}
		//Nettoyage memoire du bug des STORE PROC MYSQL !
		$this->free_mysqli($res);
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : EXECUTE UNE ROUTINE MYSQL ET RETOURNE LE RESULTAT
	// PARAM : func_name=string,params=string
	// RETOURNE : UN FICHIER XML
	*/
	public function call_to_xml($func_name, $params) {
		$res = $this->mysqli->query("CALL ".$func_name."(".$params.");");
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = $func_name;
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if (!$res) {
			$tag_return = $this->xml->createElement('return', $this->mysqli->error);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', $this->mysqli->affected_rows);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		if ($res) {
			for ($i=1; $trame = $res->fetch_assoc(); $i++) {
				$tag_module = $this->xml->createElement('module');
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $i;
				$tag_module->appendChild($attr_module);
				foreach ($trame as $key => $value) {
					$tag_item = $this->xml->createElement($key,$value);
					$tag_module->appendChild($tag_item);
				}
				$tag_elems->appendChild($tag_module);
			}
		}
		//Nettoyage memoire du bug des STORE PROC MYSQL !
		$this->free_mysqli($res);
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : RETOURNE L'ETAT DU SERVEUR (UNIX+BOXIO SEULEMENT)
	// PARAM : status=string
	// RETOURNE : UN FICHIER XML
	*/
	public function server_service($action) {
		if (preg_match("/win/i", PHP_OS)) {
			$res_status = 'false';
			$status = "OS Windows, impossible d'identifier le service";
		} else {
			if ($action == 'start') {
				exec('bash -c "exec nohup setsid sudo /usr/sbin/service boxio start > /dev/null 2>&1 &"'); 
				sleep(10);
				$status = exec('sudo /usr/sbin/service boxio status');
			} else if ($action == 'stop' || $action == 'status') {
				$status = exec('sudo /usr/sbin/service boxio '.$action);
			} else {
				$status = exec('sudo /usr/sbin/service boxio status');
			}
			if (preg_match("/running/i", $status)) {
				$res_status = 'TRUE';
				$short_status = 'running';
			} else {
				$res_status = 'FALSE';
				$short_status = 'stopping';
			}
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = 'server_status';
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		$tag_return = $this->xml->createElement('return', $status);
		$attr_return->value = $res_status;
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		$tag_module = $this->xml->createElement('module');
		$attr_module = $this->xml->createAttribute('num');
		$attr_module->value = '1';
		$tag_module->appendChild($attr_module);
		
		$tag_item = $this->xml->createElement('status_long',$status);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('status_short',$short_status);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);

		$tag_item = $this->xml->createElement('status',$res_status);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);

		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : ENVOIE D'UNE ACTION DIVERSE (TRAME OU FAVORIS OU MACROS) IOBL SUR LE CPL
	// PARAM : $command=string(trame|favoris|macros), $type=string(trame|favoris|macros)|default(trame)
	// RETOURNE : UN FICHIER XML
	*/
	public function send_command($command, $type, $date=NULL) {
		if ($date == NULL) {
			$date = 'NOW()';
		}
		if ($type == "trame") {
			$this->send_trame($command, $date);
			return;
		} else if ($type == "favoris") {
			$res = $this->mysqli->query("CALL send_favoris('".$command."')") ;
			$function = "CALL send_favoris('".$command."')";
		} else if ($type == "macros") {
			$res = $this->mysqli->query("CALL send_macros('".$command."')") ;
			$function = "CALL send_macros('".$command."')";
		} else {
			$res = "Type d'action inconnu :".$type;
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = $function;
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if (!$res) {
			$tag_return = $this->xml->createElement('return', $this->mysqli->error);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', $this->mysqli->affected_rows);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		if ($res) {
			for ($i=1; $trame = $res->fetch_assoc(); $i++) {
				$tag_module = $this->xml->createElement('module');
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $i;
				$tag_module->appendChild($attr_module);
				foreach ($trame as $key => $value) {
					if ($key == 'param' && $value) {
						if ($trame['value']) {
							$value = $this->get_params($trame['value'], $value);
						} else {
							$value = $this->get_params($trame['dimension'], $value);
						}
					}
					$tag_item = $this->xml->createElement($key,$value);
					$tag_module->appendChild($tag_item);
				}
				$tag_elems->appendChild($tag_module);
			}
		}
		//Nettoyage memoire du bug des STORE PROC MYSQL !
		$this->free_mysqli($res);
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : GERE LES MISES A JOUR
	// PARAM : $action=string, $release=NULL, $string
	// RETOURNE : UN FICHIER XML
	*/
	public function manage_version($action, $release=NULL) {
		if ($action == 'status') {
			$this->view_to_xml('view_version', ' ORDER BY `update` DESC LIMIT 0,1');
			return;
		}
		if ($action == 'check') {
			//On recupere la derniere version locale
			$ret_status = true;
			$res_status = '';
			$query = "SELECT * FROM version ORDER BY `update` DESC LIMIT 0,1";
			$res = $this->mysqli->query($query);
			if (!$res) {
				$ret_status = false;
				$res_status = $this->mysqli->error;
			}
			$trame = $res->fetch_assoc();
			$local_version = $trame;
			//On recupere la version superieur à la local ou la meme
			$distant_version = simplexml_load_file($this->conf->UPDATE_CHECK_PATH);
			if (!$distant_version) {
				$ret_status = false;
				$res_status = 'Impossible de recuperer le fichier '.$this->conf->UPDATE_CHECK_PATH;
			}
			if ($ret_status) {
				$res_status = 'Boxio est a jour, version : '.$local_version['name'];
				$new_release = false;
				foreach ($distant_version as $version) {
					if (strtotime($version->release) > strtotime($local_version['release'])) {
						$new_release = true;
						$res_status = 'Nouvelle mise a jour disponible, version : '.$version->name;
						$ret_status = false;
						break;
					}
				}
			}
			//Creation du neud xml principal
			$tag_request = $this->xml->createElement('request');
			//Creation de l'elem function
			$attr_request = $this->xml->createAttribute('function');
			$attr_request->value = 'check_version';
			$tag_request->appendChild($attr_request);
			//Creation de l'elem return
			$attr_return = $this->xml->createAttribute('status');
			$ret_status=($ret_status)?"TRUE":"FALSE";
			$tag_return = $this->xml->createElement('return', $ret_status);
			$attr_return->value = $res_status;
			$tag_return->appendChild($attr_return);
			$tag_request->appendChild($tag_return);
			//Creation de l'elem content
			$tag_elems = $this->xml->createElement('content');
			$tag_module = $this->xml->createElement('module');
			$attr_module = $this->xml->createAttribute('num');
			$attr_module->value = '1';
			$tag_module->appendChild($attr_module);
			
			$tag_item = $this->xml->createElement('current_version', $local_version['name']);
			$tag_module->appendChild($tag_item);
			$attr_module = $this->xml->createAttribute('release');
			$attr_module->value = $local_version['release'];
			$tag_item->appendChild($attr_module);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);

			$tag_item = $this->xml->createElement('next_version', $version->name);
			$tag_module->appendChild($tag_item);
			$attr_module = $this->xml->createAttribute('release');
			$attr_module->value = $version->release;
			$tag_item->appendChild($attr_module);
			$attr_module = $this->xml->createAttribute('path');
			$attr_module->value = $version->path;
			$tag_item->appendChild($attr_module);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);

			$this->xml_root->appendChild($tag_request);
		} else if ($action == 'update' && $path != NULL) {
			exec('update_boxio '.$path);
		}
	}
	
	/*
	 // FONCTION : VERIFIE LES SCENARIOS D'UN EQUIPEMENT SUR LA DB ET LE MODULE
	// PARAM : $id=string|int, $unit=NULL, $string
	// RETOURNE : UN FICHIER XML
	*/
	public function check_memory_db($id, $unit=NULL) {
		$max_retry = 3;//Nombre de tentative si non reception du message
		$reponse_time = 10;//Attente pour la reponse du module
		//On cherche les units qui gere la memory  et on relance en recursif
		if ($unit === NULL) {
			set_time_limit($reponse_time*$max_retry*4);
			//Creation du neud xml principal
			$tag_request = $this->xml->createElement('request');
			//Creation de l'elem function	
			$attr_request = $this->xml->createAttribute('function');
			$attr_request->value = 'check_memory_db';
			$tag_request->appendChild($attr_request);
			//On cherche tous les units qui gere la memoire
			$res = $this->mysqli->query("SELECT references.unit AS unit
					FROM equipements LEFT JOIN boxio.references ON equipements.ref_legrand = references.ref_legrand
					WHERE equipements.id_legrand='$id' AND references.possibility LIKE '%MEMORY%' AND references.media='CPL';
					");
			//On boucle sur les units et on recherche en recurssif
			for ($i=0; $units = $res->fetch_assoc(); $i++) {
				$tag_elems = $this->check_memory_db($id, $units["unit"]);
				$tag_request->appendChild($tag_elems);
			}
			$tag_elems = $this->xml->createElement('return', $i);
			$attr_elems = $this->xml->createAttribute('status');
			$attr_elems->value = 'true';
			$tag_elems->appendChild($attr_elems);
			$tag_request->appendChild($tag_elems);
			$this->xml_root->appendChild($tag_request);
			$res->free();
			//On cherche les differences sur le unit en param
		} else {
			//On recupere les valeurs de retour
			//$start_date = date("Y-m-d H:i:s", time()-1);
			$res = $this->mysqli->query("SELECT Now() AS 'Date'");
			$start_date = $res->fetch_row();
			$res->free();
			$own_id = $this->idunit_to_ownid($id, $unit);
			$query = "SELECT * FROM trame_decrypted WHERE id_legrand='$id' AND unit='$unit' AND
			(dimension='EXTENDED_MEMORY_DATA' OR dimension='MEMORY_DEPTH_INDICATION') AND Date>='$start_date[0]'";
			$memory = array();
			for ($retry = 1; $retry <= $max_retry; $retry++) {
				//Requetage sur le CPL pour tester le module
				$res = $this->mysqli->query("CALL send_trame('*1000*66*$own_id##', NOW())");
				//Nettoyage memoire du bug des STORE PROC MYSQL !
				$this->free_mysqli($res);
				sleep($reponse_time);
				$res = $this->mysqli->query($query);
				//On attend que le unit reponde
				if (!isset($depth)) {
					$depth = false;
				}
				while ($trames = $res->fetch_assoc()) {
					$param = $this->get_params($trames['dimension'], $trames['param'], 'array');
					if ($trames['dimension'] == 'MEMORY_DEPTH_INDICATION') {
						$depth = $param['depth'];
					} else {
						if (!isset($memory[$param['frame_number']])) {
							$memory[$param['frame_number']] = array();
						}
						$id_listen = $this->getId($param['address']);
						$unit_listen = $this->getUnit($param['address']);
						$memory[$param['frame_number']]['id_legrand'] = $id;
						$memory[$param['frame_number']]['unit'] = $unit;
						$memory[$param['frame_number']]['id_legrand_listen'] = $id_listen;
						$memory[$param['frame_number']]['unit_listen'] = $unit_listen;
						$memory[$param['frame_number']]['value_listen'] = $param['preset_value'];
						$memory[$param['frame_number']]['media_listen'] = $param['family_type'];
						$memory[$param['frame_number']]['in_memory'] = 'true';
						$memory[$param['frame_number']]['in_db'] = 'false';
					}
				}
				$res->free();
				if ($depth !== false && ($depth == (count($memory)))) {
					break;
				}
			}
			if ($retry >= $max_retry) {
				$tag_elems = $this->xml->createElement('content');
				$attr_elems = $this->xml->createAttribute('error');
				$attr_elems->value = 'communication_error';
				$tag_elems->appendChild($attr_elems);
				return($tag_elems);
			}
			//Requetage et preparation des resultats des scenarios en DB
			//@TODO: Faire une requete sur l'id_legrand pour recup nom, zone et family
			$query = "SELECT equipements.nom As nom, zones.nom AS zone, family AS family FROM equipements
						LEFT JOIN zones ON equipements.id_legrand = zones.id_legrand
						LEFT JOIN boxio.references ON equipements.ref_legrand = boxio.references.ref_legrand
						WHERE equipements.id_legrand = '$id' GROUP BY nom;";
			$res = $this->mysqli->query($query);
			if ($res) {
				$trame = $res->fetch_assoc();
				$nom = $trame['nom'];
				$zone = $trame['zone'];
				$family = $trame['family'];
			} else {
				$nom = 'UNKNOWN';
				$zone = 'UNKNOWN';
				$family = 'UNKNOWN';
			}
			$query = "SELECT id_legrand_listen,unit_listen,value_listen,media_listen FROM boxio.scenarios WHERE id_legrand='$id' AND unit='$unit';";
			$res = $this->mysqli->query($query);
			if ($res) {
				for ($i=1, $db_depth=0; $trame = $res->fetch_assoc(); $i, $db_depth++) {
					$id_legrand_listen = $trame['id_legrand_listen'];
					$unit_listen = $trame['unit_listen'];
					$value_listen = $trame['value_listen'];
					$media_listen = $trame['media_listen'];
					$find = false;
					foreach ($memory as $key => $value) {
						if ($memory[$key]['id_legrand_listen'] == $id_legrand_listen
								&& $memory[$key]['unit_listen'] == $unit_listen
								&& $memory[$key]['value_listen'] == $value_listen
								&& $memory[$key]['media_listen'] == $media_listen) {
							$memory[$key]['in_db'] = 'true';
							$find = true;
							$memory[$key]['nom'] = $nom;
							$memory[$key]['zone'] = $zone;
							$memory[$key]['family'] = $family;
							break;
						}
					}
					if ($find == false) {
						$memory['db_'.$i] = array();
						$memory['db_'.$i]['id_legrand_listen'] = $id_legrand_listen;
						$memory['db_'.$i]['unit_listen'] = $unit_listen;
						$memory['db_'.$i]['value_listen'] = $value_listen;
						$memory['db_'.$i]['media_listen'] = $media_listen;
						$memory['db_'.$i]['in_memory'] = 'false';
						$memory['db_'.$i]['in_db'] = 'true';
						$memory['db_'.$i]['nom'] = $nom²;
						$memory['db_'.$i]['zone'] = $zone;
						$memory['db_'.$i]['family'] = $family;
						$i++;
					}
				}
			}
			//Affichage du contenu de la memoire et de la DB
			$tag_elems = $this->xml->createElement('content');
			$attr_elems = $this->xml->createAttribute('memory_depth');
			$attr_elems->value = $depth;
			$tag_elems->appendChild($attr_elems);
			$attr_elems = $this->xml->createAttribute('db_depth');
			$attr_elems->value = $db_depth;
			$tag_elems->appendChild($attr_elems);
			$attr_elems = $this->xml->createAttribute('unit');
			$attr_elems->value = $unit;
			$tag_elems->appendChild($attr_elems);
			$attr_elems = $this->xml->createAttribute('id');
			$attr_elems->value = $id;
			$tag_elems->appendChild($attr_elems);
			foreach ($memory as $num => $trame) {
				$tag_module = $this->xml->createElement('module');
				if ($memory[$num]['in_memory'] == 'false' && $memory[$num]['in_db'] == 'true') {
					$attr_module = $this->xml->createAttribute('error');
					$attr_module->value = 'only_in_db';
					$tag_module->appendChild($attr_module);
				}
				if ($memory[$num]['in_memory'] == 'true' && $memory[$num]['in_db'] == 'false') {
					$attr_module = $this->xml->createAttribute('error');
					$attr_module->value = 'only_in_memory';
					$tag_module->appendChild($attr_module);
				}
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $num;
				$tag_module->appendChild($attr_module);
				$tag_item = $this->xml->createElement('in_memory',$memory[$num]['in_memory']);
				$tag_module->appendChild($tag_item);
				$tag_item = $this->xml->createElement('in_db',$memory[$num]['in_db']);
				$tag_module->appendChild($tag_item);
				foreach ($memory[$num] as $key => $value) {
					if ($key != 'in_memory' && $key != 'in_db') {
						$tag_item = $this->xml->createElement($key,$value);
						$tag_module->appendChild($tag_item);
					}
				}
				$tag_elems->appendChild($tag_module);
			}
			return $tag_elems;
		}
	}

	/*
	 // FONCTION : AJOUTE/MET A JOUR UN SCENARIO
	// PARAM : id_legrand=int,unit=int,id_legrand_listen=int,unit_listen=int,value_listen=int,media_listen=int,where=string(db|memory|both)
	// RETOURNE : UN FICHIER XML
	*/
	public function add_scenario($id_legrand, $unit, $id_legrand_listen, $unit_listen, $value_listen, $media_listen, $where = 'both') {
		if ($where == 'db' || $where == 'both') {
			$res = $this->mysqli->query("CALL add_scenario('".$id_legrand."','".$unit."','".$id_legrand_listen."','".$unit_listen."','".$value_listen."','".$media_listen."');");
		}
		if ($where == 'memory' || $where == 'both') {
			//On programme le module
			$media = "";
			if ($trame['media'] == 'RF') {
				$media = "#1";
			} else if ($trame['media'] == 'IR') {
				$media = "#2";
			}
			$own_id = $this->ioblId_to_ownId($id_legrand, $unit);
			$own_id_listen = $this->ioblId_to_ownId($id_legrand_listen, $unit_listen);
			$res = $this->mysqli->query("CALL send_trame('*#1000*".$own_id.$media."*#54*".$media_listen."*".$own_id_listen."*".$value_listen."##', NOW());");
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = 'add_scenario';
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if (!$res) {
			$tag_return = $this->xml->createElement('return', $this->mysqli->error);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', $this->mysqli->affected_rows);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		if ($res) {
			for ($i=1; $trame = $res->fetch_assoc(); $i++) {
				$tag_module = $this->xml->createElement('module');
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $i;
				$tag_module->appendChild($attr_module);
				foreach ($trame as $key => $value) {
					$tag_item = $this->xml->createElement($key,$value);
					$tag_module->appendChild($tag_item);
				}
				$tag_elems->appendChild($tag_module);
			}
		}
		$this->free_mysqli($res);
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : SUPPRIME UN SCENARIO
	// PARAM : id_legrand=int,unit=int,id_legrand_listen=int,unit_listen=int
	// RETOURNE : UN FICHIER XML
	*/
	public function del_scenario($id_legrand, $unit, $id_legrand_listen, $unit_listen, $media_listen, $where='both') {
		if ($where == 'db' || $where == 'both') {
			$res = $this->mysqli->query("CALL del_scenario('".$id_legrand."','".$unit."','".$id_legrand_listen."','".$unit_listen."');");
		}
		if ($where == 'memory' || $where == 'both') {
			//On programme le module
			$media = "";
			if ($trame['media'] == 'RF') {
				$media = "#1";
			} else if ($trame['media'] == 'IR') {
				$media = "#2";
			}
			$own_id = $this->ioblId_to_ownId($id_legrand, $unit);
			$own_id_listen = $this->ioblId_to_ownId($id_legrand_listen, $unit_listen);
			$res = $this->mysqli->query("CALL send_trame('*1000*63#".$media_listen."#".$own_id_listen."*".$own_id.$media."##', NOW());");
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = 'del_scenario';
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		if (!$res) {
			$tag_return = $this->xml->createElement('return', $this->mysqli->error);
			$attr_return->value = 'false';
		} else {
			$tag_return = $this->xml->createElement('return', $this->mysqli->affected_rows);
			$attr_return->value = 'true';
		}
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		if ($res) {
			for ($i=1; $trame = $res->fetch_assoc(); $i++) {
				$tag_module = $this->xml->createElement('module');
				$attr_module = $this->xml->createAttribute('num');
				$attr_module->value = $i;
				$tag_module->appendChild($attr_module);
				foreach ($trame as $key => $value) {
					$tag_item = $this->xml->createElement($key,$value);
					$tag_module->appendChild($tag_item);
				}
				$tag_elems->appendChild($tag_module);
			}
		}
		$tag_request->appendChild($tag_elems);
		$this->xml_root->appendChild($tag_request);
	}

	/*
	 // FONCTION : FUNCTION PRINCIPALE DU CLIENT POUR TESTER LES PARAMETRES EN GET
	*/
	public function init() {
		$this->conf = new legrand_conf();
		$this->def = new legrand_def();
		$this->init_mysql();

		if (!isset($_GET['output'])) {
			$output = 'XML';
		} else if ($_GET['output'] == 'XML' || $_GET['output'] == 'JSON') {
			$output = $_GET['output'];
		}
		$this->init_output($output);

		if (isset($_GET['version'])) {
			if (!isset($_GET['action'])) {
				$action = 'status';
			} else {
				$action = $_GET['action'];
			}
			if (!isset($_GET['release'])) {
				$release = NULL;
			} else {
				$release = $_GET['release'];
			}
			$this->manage_version($action, $release);
		}
		if (isset($_GET['add_scenario'])) {
			$id_legrand = $_GET['id_legrand'];
			$unit = $_GET['unit'];
			$id_legrand_listen = $_GET['id_legrand_listen'];
			$unit_listen = $_GET['unit_listen'];
			$value_listen = $_GET['value_listen'];
			$media_listen = $_GET['media_listen'];
			$where = $_GET['where'];
			$this->add_scenario($id_legrand, $unit, $id_legrand_listen, $unit_listen, $value_listen, $media_listen, $where);
		}
		if (isset($_GET['del_scenario'])) {
			$id_legrand = $_GET['id_legrand'];
			$unit = $_GET['unit'];
			$id_legrand_listen = $_GET['id_legrand_listen'];
			$unit_listen = $_GET['unit_listen'];
			$media_listen = $_GET['media_listen'];
			$where = $_GET['where'];
			$this->del_scenario($id_legrand, $unit, $id_legrand_listen, $unit_listen, $media_listen, $where);
		}

		if (isset($_GET['send_command'])) {
			if (!isset($_GET['type'])) {
				$type = 'trame';
			} else {
				$type = $_GET['type'];
			}
			if (!isset($_GET['date'])) {
				$date = NULL;
			} else {
				$date = urldecode($_GET['date']);
			}
			$this->send_command($_GET['send_command'], $type, $date);
		}
		if (isset($_GET['check_memory_db'])) {
			$this->check_memory_db($_GET['check_memory_db']);
		}
		if (isset($_GET['server_service']) && isset($_GET['action'])) {
			$this->server_service($_GET['action']);
		}

		if (isset($_GET['call'])) {
			$this->call_to_xml($_GET['call'], urldecode($_GET['params']));
		}
		if (isset($_GET['view'])) {
			$this->view_to_xml($_GET['view'], $this->get_to_mysqli());
		}
		
		$this->flush_output();
	}
}

//CREATION DE LA CLASSE ET ANALYSE DES DEMANDES CLIENTS
$lgc = new legrand_client();
$lgc->init();

?>