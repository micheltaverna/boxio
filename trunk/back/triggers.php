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
			"date" => date
	// RETURN : $test_trigger(string)
	*/
	public function check($trame) {
		//On parse tous les triggers
		foreach($this->triggerstab as $triggertab) {
			$trigger = $triggertab['triggers'];
			//On test la trame
			if ($trame != 'NULL') {
				//Supression des CHANGE_STATUS
				$change_status_pattern = '/CHANGE_STATUS\(\'.*?\'\)/';
				$trigger = preg_replace($change_status_pattern, '1==0', $trigger);
				
				//Transformation des OR et AND
				$andor_pattern = array('/AND/','/OR/');
				$andor_replace = array('&&','||');
				$trigger = preg_replace($andor_pattern, $andor_replace, $trigger);
				//check et replace des functions
				$func_tab = array(
					array('name' => 'id', 'pattern' => '/TRAME_ID\(\'(?P<id>\d+)\'\)/'),
					array('name' => 'unit', 'pattern' => '/TRAME_UNIT\(\'(?P<unit>\d+)\'\)/'),
					array('name' => 'value', 'pattern' => '/TRAME_VALUE\(\'(?P<value>\w+)\'\)/'),
					array('name' => 'dimension', 'pattern' => '/TRAME_DIMENSION\(\'(?P<dimension>\w+)\'\)/'),
				);
				foreach ($func_tab as $func) {
					if (preg_match($func['pattern'], $trigger, $matches)) {
						if ($trame[$func['name']] == $matches[$func['name']]) {
							$replace = '1==1';
						} else {
							$replace = '1==0';
						}
						$trigger = preg_replace($func['pattern'], $replace, $trigger);
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
				if ($trigger_status === false) {
					continue;
				}
				
				//On test les conditions
				$condition = $triggertab['conditions'];
				//Test des dates
				$date_pattern = '/DATE\(\'(?P<minutes>[\*{0,1}]|[\d\-\,]+)\',\'(?P<heures>[\*{0,1}]|[\d\-\,]+)\',\'(?P<jour>[\*{0,1}]|[\d\-\,]+)\',\'(?P<jourSemaine>[\*{0,1}]|[\d\-\,]+)\',\'(?P<mois>[\*{0,1}]|[\d\-\,]+)\'\)/';
				if (preg_match($date_pattern, $condition, $matches)) {
					$condition_status = true;
				}

				if ($condition_status === false) {
					continue;
				}
				
				//On test les actions
				
				//DEBUG
				print_r($trame);
				print_r($trigger);
				print_r('->'.$trigger_status."\n");
			}
		}
		return;
	}
}
?>