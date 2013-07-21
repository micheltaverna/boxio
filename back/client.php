<?php
/**
 * @author michel.taverna
 * Gestion du client pour le backoffice
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);

include("./conf.php");
include("./definitions.php");
include("./secure.php");

class boxio_client {
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
		if ($res == null || !isset($res)) {
			return;
		}
		$res->free();
		while($this->mysqli->more_results()){
			$this->mysqli->next_result();
			if($l_result = $this->mysqli->store_result()){
				$l_result->free();
			}
		}
	}

	/*
	 * FONCTION : DECODE ENTITY HTML
	*/
	private function html_entity_decode_numeric($string, $quote_style = ENT_COMPAT, $charset = "utf-8")
	{
		$string = html_entity_decode($string, $quote_style, $charset);
		$string = preg_replace_callback('~&#x([0-9a-fA-F]+);~i', function ($matches) {
			$num = hexdec($matches[1]);
			if ($num < 128) return chr($num);
			if ($num < 2048) return chr(($num >> 6) + 192) . chr(($num & 63) + 128);
			if ($num < 65536) return chr(($num >> 12) + 224) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
			if ($num < 2097152) return chr(($num >> 18) + 240) . chr((($num >> 12) & 63) + 128) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
			return '';
		}
			, $string);
	
			$string = preg_replace_callback('~&#([0-9]+);~', function($matches) {
				$num = $matches[1];
				if ($num < 128) return chr($num);
				if ($num < 2048) return chr(($num >> 6) + 192) . chr(($num & 63) + 128);
				if ($num < 65536) return chr(($num >> 12) + 224) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
				if ($num < 2097152) return chr(($num >> 18) + 240) . chr((($num >> 12) & 63) + 128) . chr((($num >> 6) & 63) + 128) . chr(($num & 63) + 128);
				return '';
			}, $string);
			return $string;
	}
	
	/*
	 // FONCTION : TRANSFORMATION DES PARAMS GET EN REQUETE MYSQLI POUR WHERE/ORDER/LIMIT
	  // PARAMS : $limit=boolean $order=boolean
	// RETURN : $query
	*/
	private function filter_to_mysqli($filters=null, $limit=true, $order=true) {
		//Gestion des filtres
		$query = "";
		if (isset($filters['filter'])) {
			$tab_type = array(
					"lt" => "<",
					"gt" => ">",
					"eq" => "="
					);
			$filter = json_decode($filters['filter']);
			for ($i=0,$query_array=array(); isset($filter[$i]); $i++) {
				if (!isset($filter[$i]->{'type'})) {
					if ($filter[$i]->{'property'} == 'filter') {
						preg_match('/^{type="(.*)"},{field="(.*)"},{value="{0,1}(.*?)"*}$/', utf8_decode($filter[$i]->{'value'}), $matches);
						$filter[$i]->{'type'} = $matches[1];
						$filter[$i]->{'field'} = $matches[2];
						if ($filter[$i]->{'type'} == 'list') {
							$filter[$i]->{'value'} = json_decode($matches[3]);
						} else {
							$filter[$i]->{'value'} = $matches[3];
						}
					} else {
						$query_array[] = sprintf("%s='%s'", $filter[$i]->{'property'}, utf8_decode($filter[$i]->{'value'}));
						continue;
					}
				}
				if ($filter[$i]->{'type'} == 'string') {
					$query_array[] = sprintf("%s LIKE '%%%s%%'", $filter[$i]->{'field'}, utf8_decode($filter[$i]->{'value'}));
				} else if ($filter[$i]->{'type'} == 'numeric') {
					$query_array[] = sprintf("%s%s%s", $filter[$i]->{'field'}, $tab_type[$filter[$i]->{'comparison'}], utf8_decode($filter[$i]->{'value'}));
				} else if ($filter[$i]->{'type'} == 'list') {
					for ($j=0, $type_array=array(); isset($filter[$i]->{'value'}[$j]); $j++) {
						$comp = "=";
						if (preg_match("/%/", $filter[$i]->{'value'}[$j])) {
							$comp = " LIKE ";
						}
						$type_array[] = sprintf("%s%s'%s'", $filter[$i]->{'field'}, $comp, utf8_decode($filter[$i]->{'value'}[$j]));
					}
					$query_array[] = '('.implode(' OR ', $type_array).')';
				} else if ($filter[$i]->{'type'} == 'boolean') {
					if ($filter[$i]->{'value'} == true) {
						$query_array[] = sprintf("%s is true", $filter[$i]->{'field'});
					} else {
						$query_array[] = sprintf("%s is false", $filter[$i]->{'field'});
					}
				} else if ($filter[$i]->{'type'} == 'date') {
					$date =  utf8_decode($filter[$i]->{'value'});
					$date = explode("/", $date);
					$date = sprintf("%s-%s-%s", $date[2], $date[0], $date[1]);
					$query_array[] = sprintf("DATE(%s)%s'%s'", $filter[$i]->{'field'}, $tab_type[$filter[$i]->{'comparison'}], $date);
				}
			}
			$query .= sprintf(" WHERE %s", implode(' AND ', $query_array));
		}
		//Gestion du triage
		if ($order) {
			if (isset($filters['sort']) || isset($filters['group'])) {
				$query .= ' ORDER BY ';
				if (isset($filters['group'])) {
					$group = json_decode(urldecode($filters['group']));
					if ($group[0]->{'property'} != $filters['sort']) {
						$query .= $group[0]->{'property'};
						if (isset($group[0]->{'direction'})) {
							$query .= ' '.$group[0]->{'direction'};
						}
						if (isset($filters['sort'])) {
							$query .= ', ';
						}
					}
				}
				if (isset($filters['sort'])) {
					$query .= $filters['sort'];
					if (isset($filters['dir'])) {
						$query .= ' '.$filters['dir'];
					}
				}
			}
		}
		//Gestion du nombre de resultats
		if ($limit) {
			if (isset($filters['start'])) {
				$start = $filters['start'];
			} else {
				$start = 0;
			}
			if (isset($filters['limit'])) {
				$limit = $filters['limit'];
			} else {
				$limit = 10;
			}
			$query .= sprintf(" LIMIT %s,%s", $start, $limit);
		} else {
			$query .= sprintf(" LIMIT %s,%s", 0, 10);
		}
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
		} else if ($function == "UNIT_DESCRIPTION_STATUS" && isset($this->def->OWN_STATUS_DEFINITION[$params[0]])) {
			for ($i = 0; $i < count($this->def->OWN_STATUS_DEFINITION[$params[0]]['DEFINITION']); $i++) {
				if (isset($params[$i])) {
					$decrypted_array[$this->def->OWN_STATUS_DEFINITION[$params[0]]['DEFINITION'][$i]] = $params[$i];
					$decrypted_string .= $coma.$this->def->OWN_STATUS_DEFINITION[$params[0]]['DEFINITION'][$i].'='.$params[$i];
					$coma = ';';
				}
			}
		//Le parametre est decrypte normalement
		} else {
			for ($i = 0; $i < count($this->def->OWN_PARAM_DEFINITION[$function]); $i++) {
				if (isset($params[$i])) {
					$decrypted_array[$this->def->OWN_PARAM_DEFINITION[$function][$i]] = $params[$i];
					if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "function_or_reference") {
						$params[$i] = intval($params[$i])/16;
					} else if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "reference"
							|| $this->def->OWN_PARAM_DEFINITION[$function][$i] == "version") {
						$params[$i] = dechex(intval($params[$i]));
					}
					else if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "address") {
						$params[$i] = $this->getId($params[$i]).'/'.$this->getUnit($params[$i]);
					}
					else if ($this->def->OWN_PARAM_DEFINITION[$function][$i] == "family_type") {
						if (isset($this->def->OWN_FAMILY_DEFINITION[$params[$i]])) {
							$params[$i] = $this->def->OWN_FAMILY_DEFINITION[$params[$i]];
						}
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
	private function send_trame($get_trame, $date=NULL, $delay=NULL) {
		$trame = $this->YZ_to_starsharp($get_trame);
		$res_trame = $this->test_trame($trame);
		if ($date !== NULL) {
			$date = "'".$date."'";
		} else {
			$date = 'NULL';
		}
		if ($delay === NULL) {
			$delay = 'NULL';
		}
		if ($res_trame == true) {
			$res = $this->mysqli->query("CALL send_trame('".$trame."', ".$date.", ".$delay.")") ;
		} else {
			$res = 'Trame non valide :'.$trame;
		}
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = "CALL send_trame('".$trame."', ".$date.", ".$delay.")";
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
	// PARAM : view_name=string where=string
	// RETOURNE : UN FICHIER XML
	*/
	public function view_to_xml($view_name, $filters=null) {
		//Requetage et preparation des resultats
		$query = "SELECT COUNT(*) AS total FROM ".$view_name.$this->filter_to_mysqli($filters, false, false);
		$res = $this->mysqli->query($query);
		$trame = $res->fetch_assoc();
		$total = $trame['total'];
		$query = "SELECT * FROM ".$view_name.$this->filter_to_mysqli($filters);
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
				$dimension = null;
				$dimension_value = null;
				foreach ($trame as $key => $value) {
					if ($key == 'dimension' && $value) {
						$dimension = $value;
					}
					if ($key == 'value' && $value) {
						$dimension_value = $value;
					}
					if ($key == 'param' && $value) {
						if ($dimension) {
							$value = $this->get_params($dimension, $value);
						} else if ($dimension_value) {
							$value = $this->get_params($dimension_value, $value);
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
	 // FONCTION : EXECUTE UNE ROUTINE MYSQL ET RETOURNE LE RESULTAT
	// PARAM : func_name=string,params=string
	// RETOURNE : UN FICHIER XML
	*/
	public function call_to_xml($func_name, $params) {
		$res = $this->mysqli->query("CALL ".$func_name."(".utf8_decode($params).");");
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
	// PARAM : $command=$type=string(trame|favoris|macros)|default(trame), string(trame|favoris|macros), $date=timestamp, $delay=int(secondes)
	// RETOURNE : UN FICHIER XML
	*/
	public function send_command($type, $command, $date=NULL, $delay=NULL) {
		if ($delay === NULL) {
			$delay = 'NULL';
		}
		if ($date === NULL) {
			$date = 'NULL';
		}
		if ($type == "trame") {
			$this->send_trame($command, $date);
			return;
		} else if ($type == "favoris") {
			if ($date != 'NULL') {
				$date = "'".$date."'";
			}
			$res = $this->mysqli->query("CALL send_favoris('".$command."', ".$date.", ".$delay.")") ;
			$function = "CALL send_favoris('".$command."', ".$date.", ".$delay.")";
		} else if ($type == "macros") {
			if ($date != 'NULL') {
				$date = "'".$date."'";
			}
			$res = $this->mysqli->query("CALL send_macro('".$command."', ".$date.", ".$delay.")") ;
			$function = "CALL send_macro('".$command."', ".$date.", ".$delay.")";
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
	// PARAM : $action=string, $path=NULL, $string
	// RETOURNE : UN FICHIER XML
	*/
	public function manage_version($action='check', $path=NULL) {
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
					if (strtotime($version->release) > strtotime($local_version['release']) && $version->valide == 'true') {
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
			
			$tag_item = $this->xml->createElement('current_version_name', $local_version['name']);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			$tag_item = $this->xml->createElement('current_version_release', $local_version['release']);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			$tag_item = $this->xml->createElement('current_version_update', $local_version['update']);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			
			$tag_item = $this->xml->createElement('next_version_name', $version->name);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			$tag_item = $this->xml->createElement('next_version_release', $version->release);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			$tag_item = $this->xml->createElement('next_version_path', $version->path);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
			
			$tag_item = $this->xml->createElement('status', $ret_status);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
				
			$this->xml_root->appendChild($tag_request);
		} else if ($action == 'update' && $path != NULL) {
			set_time_limit(200);
			$exec = 'sudo '.$this->conf->UPDATE_SCRIPT.' \''.$path.'\'';
			exec($exec, $res_status, $ret_status);
				
			//Creation du neud xml principal
			$tag_request = $this->xml->createElement('request');
			//Creation de l'elem function
			$attr_request = $this->xml->createAttribute('function');
			$attr_request->value = 'upgrade_version';
			$tag_request->appendChild($attr_request);
			//Creation de l'elem return
			$attr_return = $this->xml->createAttribute('status');
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
			$tag_request->appendChild($tag_elems);

			$tag_item = $this->xml->createElement('log', $log);
			$tag_module->appendChild($tag_item);
			$tag_elems->appendChild($tag_module);
			$tag_request->appendChild($tag_elems);
		}
	}
	
	/*
	 // FONCTION : GERE LES MISES A JOUR
	// PARAM : $action=string, $params=array
	// RETOURNE : UN FICHIER XML
	*/
	public function manage_user($action, $params) {
		//Ajout d'utilisateur
		if ($action == 'add') {
			//verification des conditions
			if (isset($params['login']) && isset($params['pHash512'])) {
				$this->secure->set_account($params['login'], $params['pHash512']);
			}
			//L'utilisateur n'est pas boxio erreur ou mauvais params
			else {
			}
		} else if ($action == 'upd') {
			//verification des conditions
			if (isset($params['login']) && isset($params['pHash512'])) {
				$this->secure->upd_account($params['login'], $params['pHash512']);
			}
			//Erreur parametres
			else {
			}
		} else if ($action == 'del') {
			if (isset($params['login'])) {
				$this->secure->del_account($params['login']);
			} 
			//Erreur parametres
			else {
			}
		}
		
		return;
		
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
		
		$tag_item = $this->xml->createElement('current_version_name', $local_version['name']);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		$tag_item = $this->xml->createElement('current_version_release', $local_version['release']);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		$tag_item = $this->xml->createElement('current_version_update', $local_version['update']);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('next_version_name', $version->name);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		$tag_item = $this->xml->createElement('next_version_release', $version->release);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		$tag_item = $this->xml->createElement('next_version_path', $version->path);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('status', $ret_status);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
			
		$this->xml_root->appendChild($tag_request);
	}
	
	/*
	 // FONCTION : VERIFIE LES SCENARIOS D'UN EQUIPEMENT SUR LA DB ET LE MODULE
	// PARAM : $id=string|int, $unit=NULL, $string
	// RETOURNE : UN FICHIER XML
	*/
	public function check_memory_db($id, $unit=NULL, $media=NULL) {
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
			$programmable_error = 'MEMORY';
			//On vérifie si la référence est programmable
			$res = $this->mysqli->query("SELECT references.possibility AS possibility, references.media AS media
					FROM equipements LEFT JOIN boxio.references ON equipements.ref_legrand = references.ref_legrand
					WHERE equipements.id_legrand='$id';
					");
			for ($i=0; $units = $res->fetch_assoc(); $i++) {
				$media = $units['media'];
				if (preg_match("/MEMORY/", $units['possibility'])) {
					$programmable_error = false;
					break;
				}
			}
				
			if ($programmable_error === false) {
				//On cherche tous les units qui gere la memoire
				$res = $this->mysqli->query("SELECT references.unit AS unit
						FROM equipements LEFT JOIN boxio.references ON equipements.ref_legrand = references.ref_legrand
						WHERE equipements.id_legrand='$id' AND references.possibility LIKE '%MEMORY%';
						");
				//On boucle sur les units et on recherche en recurssif
				for ($i=0; $units = $res->fetch_assoc(); $i++) {
					$tag_elems = $this->check_memory_db($id, $units["unit"], $media);
					$tag_request->appendChild($tag_elems);
				}
			}
			$tag_elems = $this->xml->createElement('return', $i);
			$attr_elems = $this->xml->createAttribute('status');
			$attr_elems->value = 'true';
			$tag_elems->appendChild($attr_elems);
			$tag_request->appendChild($tag_elems);
			if ($media != 'CPL') {
				$tag_info = $this->xml->createElement('Information', 'La référence "'.$id.'" n\'est pas programmable, produit de type '.$media.', vous devez enregistrer manuellement les programmations.');
				$tag_request->appendChild($tag_info);
			}
			if ($programmable_error != false) {
				if ($programmable_error == 'MEMORY') {
					$tag_erreur = $this->xml->createElement('Erreur', 'La référence "'.$id.'" n\'est pas programmable, aucun bloc mémoire (émetteur seulement).');
					$tag_request->appendChild($tag_erreur);
				}
			}
			$this->xml_root->appendChild($tag_request);
			$res->free();
			//On cherche les differences sur le unit en param
		} else {
			$memory = array();
			$depth = false;
			if ($media == 'CPL') {
				//On recupere les valeurs de retour
				//$start_date = date("Y-m-d H:i:s", time()-1);
				$res = $this->mysqli->query("SELECT Now() AS 'Date'");
				$start_date = $res->fetch_row();
				$res->free();
				$own_id = $this->idunit_to_ownid($id, $unit);
				$query = "SELECT * FROM trame_decrypted WHERE id_legrand='$id' AND unit='$unit' AND
				(dimension='EXTENDED_MEMORY_DATA' OR dimension='MEMORY_DEPTH_INDICATION') AND Date>='$start_date[0]'";
				for ($retry = 1; $retry <= $max_retry; $retry++) {
					//Requetage sur le CPL pour tester le module
					$res = $this->mysqli->query("CALL send_trame('*1000*66*$own_id##', NULL, NULL)");
					$this->free_mysqli($res);
					sleep($reponse_time);
					$res = $this->mysqli->query($query);
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
					$tag_elems = $this->xml->createElement('Erreur', 'Problème de Communication avec "'.$id.'".');
					return($tag_elems);
				}
			}
			//Requetage et preparation des resultats des scenarios en DB
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
						$memory['db_'.$i]['id_legrand'] = $id;
						$memory['db_'.$i]['unit'] = $unit;
						$memory['db_'.$i]['id_legrand_listen'] = $id_legrand_listen;
						$memory['db_'.$i]['unit_listen'] = $unit_listen;
						$memory['db_'.$i]['value_listen'] = $value_listen;
						$memory['db_'.$i]['media_listen'] = $media_listen;
						$memory['db_'.$i]['in_memory'] = 'false';
						$memory['db_'.$i]['in_db'] = 'true';
						$memory['db_'.$i]['nom'] = $nom;
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
		$erreur_db = false;
		if ($where == 'db' || $where == 'both') {
			$res = $this->mysqli->query("CALL add_scenario('".$id_legrand."','".$unit."','".$id_legrand_listen."','".$unit_listen."','".$value_listen."','".$media_listen."');");
			if ($res) {
				while ($elem = $res->fetch_assoc()) {
					foreach ($elem as $key => $value) {
						if ($key == 'Erreur') {
							$erreur_db = true;
						}
					}
				}
			}
			if ($erreur_db !== true) {
				$this->free_mysqli($res);
			} else {
				$res->data_seek(0);
			}
		}
		if ($erreur_db !== true) {
			if ($where == 'memory' || $where == 'both') {
				//On programme le module
				//@TODO: bug $media inconnu !
				$media = "";
				$own_id = $this->ioblId_to_ownId($id_legrand, $unit);
				$own_id_listen = $this->ioblId_to_ownId($id_legrand_listen, $unit_listen);
				$res = $this->mysqli->query("CALL send_trame('*#1000*".$own_id.$media."*#54*".$media_listen."*".$own_id_listen."*".$value_listen."##', NULL, NULL);");
			}
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
			$this->free_mysqli($res);
		}
		if ($where == 'memory' || $where == 'both') {
			//On programme le module
			//@TODO : $media inconnu !
			$media = "";
			$own_id = $this->ioblId_to_ownId($id_legrand, $unit);
			$own_id_listen = $this->ioblId_to_ownId($id_legrand_listen, $unit_listen);
			$res = $this->mysqli->query("CALL send_trame('*1000*63#".$media_listen."#".$own_id_listen."*".$own_id.$media."##', NULL, NULL);");
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
	// FONCTION : FUNCTION DE TEST DE LA CONNECTION
	*/
	public function check_connection() {
		$status = ($this->secure->connected) ? 'true' : 'false';
		$login = $this->secure->login;
		$error = $this->secure->error;
		$password = $this->secure->password;
		
		//Creation du neud xml principal
		$tag_request = $this->xml->createElement('request');
		//Creation de l'elem function
		$attr_request = $this->xml->createAttribute('function');
		$attr_request->value = 'check_connection';
		$tag_request->appendChild($attr_request);
		//Creation de l'elem return
		$attr_return = $this->xml->createAttribute('status');
		$tag_return = $this->xml->createElement('return', $status);
		$attr_return->value = $status;
		$tag_return->appendChild($attr_return);
		$tag_request->appendChild($tag_return);
		//Creation de l'elem content
		$tag_elems = $this->xml->createElement('content');
		$tag_module = $this->xml->createElement('module');
		$attr_module = $this->xml->createAttribute('num');
		$attr_module->value = '1';
		$tag_module->appendChild($attr_module);
		
		$tag_item = $this->xml->createElement('login_user',$login);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('password',$password);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('login_status',$status);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$tag_item = $this->xml->createElement('login_error',$error);
		$tag_module->appendChild($tag_item);
		$tag_elems->appendChild($tag_module);
		$tag_request->appendChild($tag_elems);
		
		$this->xml_root->appendChild($tag_request);
	}
	
	/*
	// FONCTION : FUNCTION PRINCIPALE DU CLIENT POUR TESTER LES PARAMETRES EN GET
	*/
	public function init() {
		$this->conf = new boxio_conf();
		$this->def = new boxio_def();
		$this->init_mysql();

		if (!isset($_GET['output'])) {
			$output = 'XML';
		} else if ($_GET['output'] == 'XML' || $_GET['output'] == 'JSON') {
			$output = $_GET['output'];
		}
		$this->init_output($output);
		
		//Test de securite
		$this->secure = new secure();
		$this->secure->init();
		//on affiche le résultat et on quitte
		if ($this->secure->connected == false 
			|| isset($_GET['check_login']) 
			|| isset($_GET['logout']) 
			|| isset($_GET['login'])) {
			$this->check_connection();
			$this->flush_output();
			return;
		}
		
		if (isset($_GET['user']) && isset($_GET['action'])) {
			$action = $_GET['action'];
			if ($action == 'add') {
				$params = [
					'login' => $_GET['new_login'],
					'pHash512' => $_GET['new_password']
				];
			} else if ($action == 'upd') {
				$params = [
					'login' => $_GET['old_login'],
					'pHash512' => $_GET['new_password']
				];
			} else if ($action == 'del') {
				$params = [
					'login' => $_GET['old_login']
				];
			}
			$this->manage_user($action, $params);
		}
		if (isset($_GET['version'])) {
			if (isset($_GET['action'])) {
				$action = $_GET['action'];
			}
			if (isset($_GET['release'])) {
				$path = $_GET['release'];
			}
			$this->manage_version($action, $path);
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
			if (!isset($_GET['delay'])) {
				$delay = NULL;
			} else {
				$delay = urldecode($_GET['delay']);
			}
			$this->send_command($type, $_GET['send_command'], $date, $delay);
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
			$filters = array();
			$filters['filter'] = isset($_GET['filter']) ? urldecode($_GET['filter']) : null;
			$filters['sort'] = isset($_GET['sort']) ? urldecode($_GET['sort']) : null;
			$filters['group'] = isset($_GET['group']) ? urldecode($_GET['group']) : null;
			$filters['dir'] = isset($_GET['dir']) ? urldecode($_GET['dir']) : null;
			$filters['limit'] = isset($_GET['limit']) ? urldecode($_GET['limit']) : null;
			$filters['start'] = isset($_GET['start']) ? urldecode($_GET['start']) : null;
			$this->view_to_xml($_GET['view'], $filters);
		}
		
		$this->flush_output();
	}
}

//CREATION DE LA CLASSE ET ANALYSE DES DEMANDES CLIENTS
$lgc = new boxio_client();
$lgc->init();

?>