<?php
/*
 // ClASS : GESTION DES TRIGGERS POUR LE SERVEUR IOBL
// La classe enregistre des triggers 
// puis retourne analise les eventuels actions à réaliser
*/

class triggers {
	//Contient l'horodatage de l'analyse de la crontab
	public $triggersAnalyse = NULL;
	
	//Contient toutes les triggers a analyser
	public $triggerstab = array(
		/*
		 '0' = array(
		 		'id' => '1',
		 		'nom' => 'exemple',
		 		'triggers' => '(ID('1234') AND UNIT('1')) OR (CHANGE_STATUS('1111','ON'))',
		 		'conditions' => 'DATE('*','*','*','*','*') AND ACTUAL_STATUS('1111','1','ON')',
		 		'actions' => 'SEND_COMMAND('trame','*#1##','NULL','NULL') AND SEND_URL('http://test/?1') AND SEND_MAIL('test@test.com','object','content')',
		 		'active' => '1'
		 )
		*/
	);
	
	private function init_mysql($mysqli) {
		$this->mysqli = $mysqli;
	}
	
	private function free_mysqli($res) {
		if (!isset($res) || !is_object($res)) {
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
	
	private function YZ_to_starsharp($trame) {
		$trame = str_replace('Y', '*', $trame);
		$trame = str_replace('Z', '#', $trame);
		return $trame;
	}
	
	private function test_trame($trame) {		
		foreach($this->def->OWN_TRAME as $key => $value) {
			if (preg_match($value, $trame)) {
				return true;
			}
		}
		return false;
	}
	
	private function send_command($type, $command, $date=NULL, $delay=NULL) {
		if ($date != NULL && $date != 'NULL') {
			$date = "'".$date."'";
		} else {
			$date = 'NULL';
		}
		if ($delay === NULL) {
			$delay = 'NULL';
		}
		if ($type == "trame") {
			if ($this->test_trame($command) == true) {
				$res = $this->mysqli->query("CALL send_trame('".$command."',".$date.",".$delay.")");
				if ($this->conf->DEBUG_LEVEL > 4) {
					print "SEND_COMMAND => CALL send_trame('".$command."',".$date.",".$delay.")\n";
				}
			} else {
				print "Error Trame => CALL send_trame('".$command."',".$date.",".$delay.")\n";
			}
		} else if ($type == "favoris") {
			$res = $this->mysqli->query("CALL send_favoris('".$command."',".$date.",".$delay.")");
			if ($this->conf->DEBUG_LEVEL > 4) {
				print "SEND_COMMAND => CALL send_favoris('".$command."',".$date.",".$delay.")\n";
			}
		} else if ($type == "macros") {
			$res = $this->mysqli->query("CALL send_macro('".$command."',".$date.",".$delay.")");
			if ($this->conf->DEBUG_LEVEL > 4) {
				print "SEND_COMMAND => CALL send_macro('".$command."',".$date.",".$delay.")\n";
			}
		}
		if (isset($res)) {
			$this->free_mysqli($res);
		}
	}
	
	public function checkAction($action) {
		//Transformation des OR et AND
		$andor_pattern = array('/[\s\t\r]+AND[\s\t\r]+/','/[\s\t\r]+OR[\s\t\r]+/i');
		$andor_replace = array(' && ',' || ');
		$action = preg_replace($andor_pattern, $andor_replace, $action);
		//check et replace des functions
		$func_tab = array(
				array('name' => 'stop_command', 'pattern' => '/STOP_COMMAND\(\'(?P<type>trame|favoris|macros*)+\'\s*,\s*\'(?P<command>[\d\*#]+)+\'\s*\)/i'),
				array('name' => 'send_command', 'pattern' => '/SEND_COMMAND\(\'(?P<type>trame|favoris|macros*)+\'\s*,\s*\'(?P<command>[\d\*#]+)+\'\s*,{0,1}\s*\'{0,1}(?P<delay>NULL|\d+){0,1}\'{0,1}\s*\)/i'),
				array('name' => 'send_mail', 'pattern' => '/SEND_MAIL\(\'(?P<mail>[\w\W]+)\'\s*,\s*\'(?P<subject>[\w\W]+)\'\s*,\s*\'(?P<message>[\w\W\s]+)\'\s*\)/i'),
				array('name' => 'send_url', 'pattern' => '/SEND_URL\(\'(?P<url>[\w_\-%?:\/\.&=]+)\'\s*,{0,1}\s*\'{0,1}(?P<delay>NULL|\d+){0,1}\'{0,1}\s*\)/i')
		);
		foreach ($func_tab as $func) {
			if (preg_match_all($func['pattern'], $action, $matches)) {
				//TODO: stop_command
				if ($func['name'] == 'send_command') {
					for($i = 0; isset($matches[0][$i]); $i++) {
						$delay = NULL;
						if ($matches['delay'][$i] != NULL && $matches['delay'][$i] != 'NULL' && $matches['delay'][$i] != 0) {
							$delay = $matches['delay'][$i];
						}
						$this->send_command($matches['type'][$i], $matches['command'][$i], NULL, $delay);
					}
				} else if ($func['name'] == 'send_mail') {
					$headers = 'From: BOXIO <boxio@boxio>' . "\r\n" .
					     'X-Mailer: PHP/' . phpversion();
					for($i = 0; isset($matches[0][$i]); $i++) {
						mail($matches['mail'][$i], $matches['subject'][$i], $matches['message'][$i], $headers);
					}
				} else if ($func['name'] == 'send_url') {
					for($i = 0; isset($matches[0][$i]); $i++) {
						$delay = 0;
						if (preg_match('/\?/',$matches['url'][$i])) {
							$url = $matches['url'][$i].'&_dc='.time();
						} else {
							$url = $matches['url'][$i].'?_dc='.time();
						}
						if ($matches['delay'][$i] != NULL && $matches['delay'][$i] != 'NULL' && $matches['delay'][$i] != 0) {
							$delay = $matches['delay'][$i];
						}
						exec('(sleep '.$delay.';wget \''.$url.'\' -O /dev/null -o /dev/null)> /dev/null 2>/dev/null &');
					}
				}
			}
		}
	}
	
	public function checkCondition($condition, $status) {
		//Si pas de condition c'est bon !
		if ($condition == '' || $condition == NULL) {
			return true;
		}
		//on creer la date courante
		$cur_date = getdate();
		//Transformation des OR et AND
		$andor_pattern = array('/[\s\t\r]+AND[\s\t\r]+/','/[\s\t\r]+OR[\s\t\r]+/i');
		$andor_replace = array(' && ',' || ');
		$condition = preg_replace($andor_pattern, $andor_replace, $condition);
		//Test des dates
		$date_pattern = '/(?P<invert>!{0,1})DATE\s*\(\s*\'(?P<minutes>[\*{0,1}]|[\d\-\,]+)\'\s*,\s*\'(?P<hours>[\*{0,1}]|[\d\-\,]+)\'\s*,\s*\'(?P<mday>[\*{0,1}]|[\d\-\,]+)\'\s*,\s*\'(?P<wday>[\*{0,1}]|[\d\-\,]+)\'\s*,\s*\'(?P<mon>[\*{0,1}]|[\d\-\,]+)\'\s*\)/i';
		if (preg_match_all($date_pattern, $condition, $search_all_date)) {
			for ($i=0; isset($search_all_date[0][$i]); $i++) {
				$find = true;
				preg_match($date_pattern, $search_all_date[0][$i], $search_date);
				//on recherche pour chaques partie de la date : heure, minute, jour, etc.
				foreach ($search_date as $part_name => $part_of_date) {
					//On continue si on ne connait pas ce type de date dans l'array
					if (is_numeric($part_name) || $part_name == 'invert') {
						continue;
					}
					//on test si la precendente partie de la date est valide sinon on quitte
					if ($find == false) {
						break;
					}
					//on reinitialise la recherche
					$find = false;
					//on decoupe apres les , pour tester les elements
					$part = explode(',', $part_of_date);
					foreach($part as $elem) {
						//si * c'est ok
						if ($elem == '*') {
							$find = true;
							break;
						}
						//si - on recherche l'interval
						if (preg_match('/(?P<start>\d+)-(?P<end>\d+)/', $elem, $search_elem)) {
							if (intval($cur_date[$part_name]) >= intval($search_elem['start'])
								 && intval($cur_date[$part_name]) <= intval ($search_elem['end'])) {
								$find = true;
								break;
							}
						//sinon on verifie la valeur
						} else if ($cur_date[$part_name] == $elem) {
							$find = true;
							break;
						}
					}
				}
				//on remplace
				if ($search_date['invert'] == '!') {
					$invert = '!=';
				} else {
					$invert = '==';
				}
				if ($find == true) {
					$replace = '1'.$invert.'1';
				} else {
					$replace = '1'.$invert.'0';
				}
				$condition = preg_replace($date_pattern, $replace, $condition, 1);
			}
		}
		//On test le Status
		$status_pattern = '/(?P<invert>!{0,1})STATUS\(\'(?P<id>[\*{0,1}]|[\d\-\,]+)\',\'(?P<unit>[\*{0,1}]|[\d\-\,]+)\',\'(?P<status>[\*{0,1}]|[\w\-\,]+)\'\)/i';
		if (preg_match_all($status_pattern, $condition, $search_all_status)) {
			for ($i=0; isset($search_all_status[0][$i]); $i++) {
				preg_match($status_pattern, $search_all_status[0][$i], $search_status);
				//on reinitialise la recherche
				$find = false;
				$search_id = preg_replace_callback('/(?P<start>\d+)-(?P<end>\d+)/', function($matches) {
					return implode(',',range($matches['start'], $matches['end']));
				}, $search_status['id']);
				$search_id = explode(',', $search_id);
				$search_unit = preg_replace_callback('/(?P<start>\d+)-(?P<end>\d+)/', function($matches) {
					return implode(',',range($matches['start'], $matches['end']));
				}, $search_status['unit']);
				$search_unit = explode(',', $search_unit);
				$search_state = preg_replace_callback('/(?P<start>\d+)-(?P<end>\d+)/', function($matches) {
					return implode(',',range($matches['start'], $matches['end']));
				}, $search_status['status']);
				$search_state = explode(',', $search_state);
				foreach($status as $elem) {
					if ((in_array($elem['id'], $search_id) || $search_id=='*')
						&& (in_array($elem['unit'], $search_unit) || $search_unit=='*')
						&& (in_array($elem['status'], $search_state) || $search_state=='*')) {
						$find=true;
						break;
					}
				}
				//on remplace
				if ($search_status['invert'] == '!') {
					$invert = '!=';
				} else {
					$invert = '==';
				}
				if ($find == true) {
					$replace = '1'.$invert.'1';
				} else {
					$replace = '1'.$invert.'0';
				}
				$condition = preg_replace($status_pattern, $replace, $condition, 1);
			}
		}
		
		//On test si le trigger est valide
		if (!preg_match('/[^\(\)\|\&\s\t\r=01]+/', $condition)) {
			$condition_status = eval("
			try {
				if ($condition) {
					return true;
				} 
				return false;
			} catch (Exception \$e) {
				return false;
			}
			");
		} else {
			$condition_status = false;
		}
		//DEBUG
		if ($this->conf->DEBUG_LEVEL > 4) {
			if ($condition_status == true) {
				print "\nCondition Valide ! (".$condition.")\n";
			} else {
				print "\nCondition NON Valide ! (".$condition.")\n";
			}
		}
		return $condition_status;
	}

	private function checkTrigger($trigger, $trame) {
		//Supression des CHANGE_STATUS
		$change_status_pattern = '/CHANGE_STATUS\(\'.*?\'\)/i';
		$trigger = preg_replace($change_status_pattern, '1==0', $trigger);
		
		//Transformation des OR et AND
		$andor_pattern = array('/[\s\t\r]+AND[\s\t\r]+/','/[\s\t\r]+OR[\s\t\r]+/i');
		$andor_replace = array(' && ',' || ');
		$trigger = preg_replace($andor_pattern, $andor_replace, $trigger);
		//check et replace des functions
		$func_tab = array(
				array('name' => 'id', 'pattern' => '/TRAME_ID\(\'(?P<id>[\*{0,1}]|[\d\-\,]+)\'\)/i'),
				array('name' => 'unit', 'pattern' => '/TRAME_UNIT\(\'(?P<unit>[\*{0,1}]|[\d\-\,]+)\'\)/i'),
				array('name' => 'value', 'pattern' => '/TRAME_VALUE\(\'(?P<value>[\*{0,1}]|[\w\-\,]+)\'\)/i'),
				array('name' => 'dimension', 'pattern' => '/TRAME_DIMENSION\(\'(?P<dimension>[\*{0,1}]|[\w\-\,]+)\'\)/i'),
		);
		foreach ($func_tab as $func) {
			if (preg_match_all($func['pattern'], $trigger, $matches)) {
				$find = true;
				for ($i=0; isset($matches[$func['name']][$i]); $i++) {
					//on test si la precendente partie de la date est valide sinon on quitte
					if ($find == false) {
						break;
					}
					//on reinitialise la recherche
					$find = false;
					//on decoupe apres les , pour tester les elements
					$part = explode(',', $matches[$func['name']][$i]);
					foreach($part as $elem) {
						//si * c'est ok
						if ($elem == '*') {
							$find = true;
							break;
						}
						//si - on recherche l'interval
						if (preg_match('/(?P<start>\d+)-(?P<end>\d+)/', $elem, $search_elem)) {
							if (intval($trame[$func['name']]) >= intval($search_elem['start'])
									&& intval($trame[$func['name']]) <= intval ($search_elem['end'])) {
								$find = true;
								break;
							}
							//sinon on verifie la valeur
						} else if ($trame[$func['name']] == $elem) {
							$find = true;
							break;
						}
					}
					//On remplace
					if ($find == true) {
						$replace = '1==1';
					} else {
						$replace = '1==0';
					}
					$trigger = preg_replace($func['pattern'], $replace, $trigger, 1);
				}
			}
		}
		
		//On test si le trigger est valide
		if (!preg_match('/[^\(\)\|\&\s\t\r=01]+/', $trigger)) {
			$trigger_status = eval("
				try {
					if ($trigger) {
						return true;
					}
					return false;
				} catch (Exception \$e) {
					return false;
				}
			");
		} else {
			$trigger_status = false;
		}
		//DEBUG
		if ($this->conf->DEBUG_LEVEL > 4) {
			if ($trigger_status == true) {
				print "\nTrigger Valide ! (".$trigger.")\n";
			}
		}
		return $trigger_status;
	}
	
	/*
	// FONCTION : AJOUTE UN TRIGGER
	// PARAMS : $id=string => référence du trigger
	//			$minutes=string,
	//			$heures=string,
	//			$jour=string,
	//			$jourSemaine=string
	// RETURN : $res=boolean true|false
	*/
	public function addTrigger($id, $nom, $triggers, $conditions, $actions) {
		$this->triggerstab[(string)$id] = array(
				'nom' => $nom,
				'triggers' => $triggers,
				'conditions' => $conditions,
				'actions' => $actions
		);
		return TRUE;
	}

	/*
	// FONCTION : EFFACE UN TRIGGER
	// PARAMS : $id=string => référence du trigger
	// RETURN : $res=boolean true|false
	*/
	public function delTrigger($id) {
		if (!isset($this->triggerstab[(string)$id])) {
			return FALSE;
		}
		unset($this->triggerstab[(string)$id]);
		return TRUE;
	}

	/*
	// FONCTION : EFFACE TOUS LES TRIGGERS
	// PARAMS : $id=string => référence du trigger
	// RETURN : $res=boolean true|false
	*/
	public function resetTriggers() {
		foreach ($this->triggerstab as $trigger) {
			unset($trigger);
		}
		unset($this->triggerstab);
		$this->triggerstab = array();
		return TRUE;
	}
	
	/*
	// FONCTION : ANALYSE DU TRIGGER
	// PARAMS : $trame = array(
			"trame" => string,
			"format" => 'string',
			"type" => 'string',
			"value" => string,
			"dimension" => string,
			"param" => string,
			"id" => string,
			"unit" => string,
			"date" => date);
			status = array(
				"$id" => "$status"
			)
	// RETURN : $test_trigger(string)
	*/
	public function check($trame, $all_status) {
		//On parse tous les triggers
		foreach($this->triggerstab as $triggertab) {
			$trigger = $triggertab['triggers'];
			$condition = $triggertab['conditions'];
			$action = $triggertab['actions'];
			//On test la trame
			if ($trame != 'NULL') {
				if ($this->checkTrigger($trigger, $trame) === false) {
					continue;
				}
				if ($this->conf->DEBUG_LEVEL > 4) {
					print("Tested Trigger=>".$trigger."\n");
				}
				
				if ($this->checkCondition($condition, $all_status) === false) {
					continue;
				}
				if ($this->conf->DEBUG_LEVEL > 4) {
					print("Tested Condition=>".$condition."\n");
				}
				
				$this->checkAction($action);
				if ($this->conf->DEBUG_LEVEL > 2) {
					print("Tested Action=>".$action."\n");
				}
			}
		}
		return;
	}
	
	public function init($mysqli) {
		$this->conf = new boxio_conf();
		$this->def = new boxio_def();
		$this->init_mysql($mysqli);
	}
}
?>