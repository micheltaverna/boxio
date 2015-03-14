<?php
/*
 // ClASS : GESTION DE LA CRONTAB POUR LE SERVEUR IOBL
// La classe enregistre des elements cron (identique à une crontab unix)
// puis retourne le unix timestamp de la prochaine occurence d'un element cron
*/

class crond {
	//Contient l'horodatage de l'analyse de la crontab
	public $cronAnalyse = NULL;
	
	//Contient toutes les crons a analyser
	public $crontab = array(
			/*
			 '0' = array(
			 		'minutes' => '*',
			 		'heures' => '*',
			 		'jour' => '*',
			 		'jourSemaine' => '*',
			 		'mois' => '*',
			 		'next' => '12345678'
			 )
	*/
	);

	//Contient la prochaine occurence
	private $nextCron = array(
			'year' => "", //annee en cours
			'month' => "", //mois en cours
			'day' => "", //jour en cours
			'hour' => "", //heur en cours
			'min' => "" //minute en cours
	);

	/*
	 // FONCTION : FUNCTION PRINCIPALE DE LANCEMENT DU SERVEUR
	*/
	public function init() {
		return;

		//Boucle infinie
		while (1 == 1)  {
			/* on récupère l'heure (timestamp) de la prochaine éxécution */
			foreach ($crontab as $script) {
				if ($script['prochain'] < $next || !(isset($next))) {
					$next = $script['prochain'];
				}
			}
			/* on récupère le numéro du prochain script à éxécuter */
			foreach ($crontab as $index => $script) {
				if ($script['prochain'] < $min || !(isset($min))) {
					$min = $script['prochain'];
					$id = $index;
				}
			}
			//le temps en seconde qu'il faut pour arriver à $next
			$dodo = $next - time();
			sleep($dodo);/* on dort jusqu'à ce qu'il soit temps d'éxécuter le script */
			fopen($crontab[$id]['URLScript'], 'r'); /* on lance le script. */
			/* fopen peut être remplacé par une autre méthode, (shell_exec...) */
			$crontab[$id]['prochain'] = findNextCron($id); /* prochaine éxécution */
		}
	}



	/*
	 // FONCTION : AJOUTE UN ELEMENT CRON
	// PARAMS : $id=string => référence du cron
	//			$minutes=string => Default='*',
	//			$heures=string => Default='*',
	//			$jour=string => Default='*',
	//			$jourSemaine=string => Default='*',
	//			$mois=string => Default='*'
	// RETURN : $res=boolean true|false
	*/
	public function addCron($id, $minutes = '*', $heures = '*', $jour = '*', $jourSemaine = '*', $mois = '*') {
		//TODO : vérifier les entrés dans la crontab, si erreur return FALSE
		$this->crontab[(string)$id] = array(
				'minutes' => (string)$minutes,
				'heures' => (string)$heures,
				'jour' => (string)$jour,
				'jourSemaine' => (string)$jourSemaine,
				'mois' => (string)$mois
		);
		$this->crontab[(string)$id]['prochain'] = $this->findNextCron($id);
		return TRUE;
	}

	/*
	 // FONCTION : EFFACE UN ELEMENT CRON
	// PARAMS : $id=string => référence du cron
	// RETURN : $res=boolean true|false
	*/
	public function delCron($id) {
		//TODO : vérifier si id dans la crontab, si erreur return FALSE
		if (!isset($this->crontab[(string)$id])) {
			return FALSE;
		}
		unset($this->crontab[(string)$id]);
		return TRUE;
	}


	/*
	// FONCTION : EFFACE TOUS LES CRONS
	// PARAMS : $id=string => référence du cron
	// RETURN : $res=boolean true|false
	*/
	public function resetCron() {
		unset($this->crontab);
		$this->crontab = array();
		return TRUE;
	}

	/*
	 // FONCTION : MET A JOUR EN CHERCHANT LA PROCHAINE OCCURENCE D'UN ELEMENT CRON
	// PARAMS : $id=string => référence du cron
	// RETURN : $res=boolean true|false
	*/
	public function updateCron($id) {
		/*if (!isset($this->crontab[(string)$id])) {
			return FALSE;
		}*/
		$this->crontab[(string)$id]['prochain'] = $this->findNextCron($id);
		return TRUE;
	}

	/*
	 // FONCTION : RETOURNE LA PROCHAINE OCCURENCE D'UN ELEMENT CRON
	// RETURN : $id=string
	*/
	public function findNextCronTab() {
		$nextCron = NULL;
		foreach ($this->crontab as $id => $elem) {
			if ($this->crontab[(string)$id]['prochain'] < $nextCron || $nextCron == NULL) {
				$nextCron = $this->crontab[(string)$id]['prochain'];
				$nextId = $id;
			}
		}
		if (isset($nextId)) {
 			return ($nextId);
 		} else {
 			return NULL;
 		}
	}

	/*
	 // FONCTION : RETOURNE LA PROCHAINE OCCURENCE D'UN ELEMENT CRON
	// PARAMS : $id=array()
	// RETURN : $timestamp=int | FALSE
	*/
	public function findNextCron($id) {
		if (!isset($this->crontab[(string)$id])) {
			return FALSE;
		}
		$yearNow = date("Y");
		$monthNow = date("m");
		$dayNow = date("d");
		$hourNow = date("H");
		$minNow = date("i")+1;

		$this->nextCron['year'] = $yearNow;
		$this->nextCron['month'] = $monthNow - 1;

		//on parcourt tous les mois de l'intervalle demandé
		while ($this->findNextMonth($id) != -1) {
			//jusqu'à trouver une réponse convanable
			//si ce n'est pas ce mois ci
			if ($this->nextCron['month'] != $monthNow || $this->nextCron['year'] != $yearNow) {
				$this->nextCron['day'] = 0;
				if ($this->findNextDay($id) == -1) {	/* le premier jour trouvé sera le bon. */
					/*  -1 si l'intersection entre jour de semaine */
					/* et jour du mois est nulle */
					continue;			/* ...auquel cas on passe au mois suivant */
				} else {					/* s'il y a un jour */
					$this->nextCron['hour'] = -1;
					$this->findNextHour($id);	/* la première heure et la première minute conviendront*/
					$this->nextCron['min'] = -1;
					$this->findNextMinute($id);
					return mktime($this->nextCron['hour'], $this->nextCron['min'], 0, $this->nextCron['month'], $this->nextCron['day'], $this->nextCron['year']);
				}
			} else {						/* c'est ce mois ci */
				$this->nextCron['day'] = $dayNow-1;
				/* on cherche un jour à partir d'aujourd'hui compris */
				while ($this->findNextDay($id) != -1) {
					/* si ce n'est pas aujourd'hui */
					if ($this->nextCron['day'] > $dayNow) {
						/* on prend les premiers résultats */
						$this->nextCron['hour'] = -1;
						$this->findNextHour($id);
						$this->nextCron['min'] = -1;
						$this->findNextMinute($id);
						return mktime($this->nextCron['hour'], $this->nextCron['min'], 0, $this->nextCron['month'], $this->nextCron['day'], $this->nextCron['year']);
					}
					/* même algo pour les heures et les minutes */
					if ($this->nextCron['day'] == $dayNow) {
						$this->nextCron['hour'] = $hourNow - 1;
						while ($this->findNextHour($id) != -1) {
							if ($this->nextCron['hour'] > $hourNow) {
								$this->nextCron['min'] = -1;
								$this->findNextMinute($id);
								return mktime($this->nextCron['hour'], $this->nextCron['min'], 0, $this->nextCron['month'], $this->nextCron['day'], $this->nextCron['year']);
							}
							if ($this->nextCron['hour'] == $hourNow) {
								$this->nextCron['min'] = $minNow - 1;
								while ($this->findNextMinute($id) != -1) {
									if ($this->nextCron['min'] >= $minNow) {
										return mktime($this->nextCron['hour'], $this->nextCron['min'], 0, $this->nextCron['month'], $this->nextCron['day'], $this->nextCron['year']);
									}
								}
							}
						}
					}
				}
			}
		}
	}

	/*
	 // FONCTION : RETOURNE TOUS LES ELEMENTS COMPOSANT UN INTERVAL
	// PARAMS : $min=int, $max=int, $interval=string
	// RETURN : $ret=array()
	*/
	private function parseFormat($min, $max, $intervalle) {
		$ret = Array();

		if ($intervalle == '*') {
			for ($i=$min; $i<=$max; $i++) {
				$ret[$i] = TRUE;
			}
			return $ret;
		} else {
			for ($i=$min; $i<=$max; $i++) {
				$ret[$i] = FALSE;
			}
		}

		$intervalle = explode(',', $intervalle);
		foreach ($intervalle as $val) {
			$val = explode('-', $val);
			if (isset($val[0]) && isset($val[1])) {
				if ($val[0] <= $val[1]) {
					for ($i=$val[0]; $i<=$val[1]; $i++) {
						$ret[$i] = TRUE;	/* ex : 9-12 = 9, 10, 11, 12 */
					}
				} else {
					for ($i=$val[0]; $i<=$max; $i++) {
						$ret[$i] = TRUE;	/* ex : 10-4 = 10, 11, 12... */
					}
					for ($i=$min; $i<=$val[1]; $i++) {
						$ret[$i] = TRUE;	/* ...et 1, 2, 3, 4 */
					}
				}
			} else {
				$ret[$val[0]] = TRUE;
			}
		}
		return $ret;
	}

	/*
	 // FONCTION : MET A JOUR LES PROCHAIN MOIS D'UN ELEMENT CRON
	// PARAMS : $id=string
	*/
	private function findNextMonth($id) {
		$valeurs = $this->parseFormat(1, 12, $this->crontab[$id]['mois']);
		do {
			$this->nextCron['month']++;
			if ($this->nextCron['month'] == 13) {
				$this->nextCron['month'] = 1;
				$this->nextCron['year']++;		/*si on a fait le tour, on réessaye l'année suivante */
			}
		} while($valeurs[$this->nextCron['month']] != TRUE);
	}

	/*
	 // FONCTION : MET A JOUR LES PROCHAIN JOURS D'UN ELEMENT CRON
	// PARAMS : $id=string
	*/
	private function findNextDay($id) {
		$valeurs = $this->parseFormat(1, 31, $this->crontab[$id]['jour']);
		$valeurSemaine = $this->parseFormat(1, 7, $this->crontab[$id]['jourSemaine']);
		
		//transformation du Dimanche 7 en 0
		array_unshift($valeurSemaine, $valeurSemaine[7]);
		unset($valeurSemaine[7]);

		do {
			$this->nextCron['day']++;
			/* si $day est égal au nombre de jours du mois + 1 */
			if ($this->nextCron['day'] == date('t', mktime(0, 0, 0, $this->nextCron['month'], 1, $this->nextCron['year']))+1) {
				return -1;
			}
			$days = date('w', mktime(0, 0, 0, $this->nextCron['month'], $this->nextCron['day'], $this->nextCron['year']));
		} while($valeurs[$this->nextCron['day']] != TRUE || $valeurSemaine[$days] != TRUE);
	}

	/*
	 // FONCTION : MET A JOUR LES PROCHAINES HEURES D'UN ELEMENT CRON
	// PARAMS : $id=string
	// RETURN : $ret=array()
	*/
	private function findNextHour($id) {
		$valeurs = $this->parseFormat(0, 23, $this->crontab[$id]['heures']);

		do {
			$this->nextCron['hour']++;
			if ($this->nextCron['hour'] == 24) {
				return -1;
			}
		} while($valeurs[$this->nextCron['hour']] != TRUE);
	}

	/*
	 // FONCTION : MET A JOUR LES PROCHAINES MINUTES D'UN ELEMENT CRON
	// PARAMS : $id=string
	// RETURN : $ret=array()
	*/
	private function findNextMinute($id) {
		$valeurs = $this->parseFormat(0, 59, $this->crontab[$id]['minutes']);

		do {
			$this->nextCron['min']++;
			if ($this->nextCron['min'] == 60) {
				return -1;
			}
		} while($valeurs[$this->nextCron['min']] != TRUE);
	}
}
/*
 set_time_limit(1000);
//ignore_user_abort(1);
$crond = new crond();
$crond->addCron('2', '0, 15, 30, 45', '8', '*', '1-6', '*');
$crond->addCron('1', '30', '8', '*', '1-5', '1-6,9-12');
$crond->addCron('3', '*', '*', '*', '*', '*');
//$crond->delCron('1');
//$crond->init();
$id = $crond->findNextCronTab();
print "id : ".$id;
print "<br>prochain : ";
print_r($crond->crontab[$id]['prochain']);
print "<br>time : ".time();
sleep(60);
$crond->updateCron($id);
$id = $crond->findNextCronTab();
print "<br>id : ".$id;
print "<br>prochain : ";
print_r($crond->crontab[$id]['prochain']);
print "<br>time : ".time();
*/
?>