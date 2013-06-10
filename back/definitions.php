<?php
class boxio_def {
	//temps par default en secondes pour la recherche des mise à jour de la table cron
	public $DEFAULT_UPDATE_TIME_CRONTAB = 30;

	//temps par default en secondes pour la recherche des mise à jour de la table cron
	public $DEFAULT_UPDATE_TIME_TRIGGERTAB = 30;
	
	//temps par default en secondes pour l'ouverture complete d'un volet (si pas de variable move_time defini en DB)
	public $DEFAULT_SHUTTER_MOVE_TIME = 40;

	//temps pour que le relais interne change d'état
	public $SHUTTER_RELAY_TIME = 1;

	//Definition des differentes trames IOBL possibles
	public $OWN_TRAME = array(
			'SPECIAL_REQUEST' => "/^\*#\d{2,4}\*\*\d{1,2}##$/",
			'ACK' => "/^\*#\*1##$/",//  *#*1##
			'NACK' => "/^\*#\*0##$/",//  *#*0##
			'BUS_COMMAND' => "/^\*(\d+)\*(\d+)\*(\d*#*\d+#*\d*)##$/",//  *WHO*WHAT*WHERE##  *1*1*0#13236017##
			'STATUS_REQUEST' => "/^\*#(\d+)\*(\d*#*\d+#*\d*)##$/",//  *#WHO*WHERE
			'DIMENSION_REQUEST' => "/^\*#(\d+)\*(\d*#*\d+#*\d*)\*([\d#]+)\**([\d\*]*)##$/",//  *#WHO*WHERE*DIMENSION(*VAL1*VALn)##
			'DIMENSION_SET' => "/^\*(\d+)\*(\d*)#*([\d#]*)\*(\d*#*\d+#*\d*)##$/"//  *#WHO*WHERE*#DIMENSION*VAL1*VALn##
	);

	//Definition de la partie WHERE d'une trame
	public $OWN_WHERE_DEFINITION = "/(\d+)?#*(\d+)?#*(\d*)$/";

	//Definition des differentes famille de media
	public $OWN_FAMILY_DEFINITION = array(
			"CPL" => "96",
			"RF" => "64",
			"IR" => "128",
			"96" => "CPL",
			"64" => "RF",
			"128" => "IR"
	);

	//Definition des differents media
	public $OWN_MEDIA_DEFINITION = array(
			"" => "CPL",
			"0" => "CPL",
			"1" => "RF",
			"2" => "IR"
	);

	//Definition des differents media
	public $OWN_COMMUNICATION_DEFINITION = array(
			"" => "UNICAST",
			"0" => "BROADCAST",
			"1" => "MULTICAST",
			"2" => "UNICAST_DIRECT",
			"3" => "UNICAST"
	);

	//Definition des differentes scenarios type
	//@TODO: Modifier le type par le unit_code
	public $OWN_SCENARIO_DEFINITION = array(
			"LIGHTING" => array(
					"ON" => "/^101$/",
					"OFF" => "/^102$/",
					"ON_FORCED" => "/^103$/",
					"OFF_FORCED" => "/^104$/",
					"AUTO" => "/^105$/",
					"AUTO_ON" => "/^101$/",
					"AUTO_OFF" => "/^102$/",
					"LEVEL" => "/^(\d{1,2})$/"
			),
			"SHUTTER" => array(
					"MOVE_UP" => "/^102$/",
					"MOVE_DOWN" => "/^103$/",
					"STOP" => "/^101$/"
			),
			"CONFORT" => array(
					"PRESENCE" => "/^6$/",
					"ECO" => "/^7$/",
					"HORS_GEL" => "/^8$/",
					"AUTOMATIQUE" => "/^5$/",
					"SONDE" => "/^0$/"
			)
	);

	//Definition des differentes scenarios type
	public $OWN_STATUS_DEFINITION = array(
			"1" => array(
					"DEFINITION" => array("inter_confort","unknown","status_confort","unknown","unknown","unknown"),
					"TYPE" => array ("CONFORT"),
					"VALUE" => array (
							"status_confort" => array(
								"ON" => "/^100$/",
								"OFF" => "/^0$/"
							)
					)
			),
			"129" => array(
					"DEFINITION" => array("inter","level"),
					"TYPE" => array ("LIGHTING"),
					"VALUE" => array (
							"level" => array(
								"ON" => "/^128$/",
								"OFF" => "/^0$/",
								"ON_DEROGATION" => "/^129$/",
								"OFF_DEROGATION" => "/^1$/",
								"ON_DETECTION" => "/^130$/"
							)
					)
			),
			"141" => array(
					"DEFINITION" => array("fan","fan_speed","unknown","unknown","unknown","unknown"),
					"TYPE" => array ("CONFORT"),
					"VALUE" => array (
							"fan_speed" => array(
								"LOW_FAN_SPEED" => "/^101$/",
								"HIGH_FAN_SPEED" => "/^102$/"
							)
					)
			),
			"143" => array(
					"DEFINITION" => array("variator","wanted_level","level","action_for_time","unknown","unknown"),
					"TYPE" => array ("LIGHTING"),
					"VALUE" => array (
							"action_for_time" => array(
								"ACTION_IN_PROGRESS" => "/^1$/",
								"NO_ACTION" => "/^0$/"
							),
							"level" => array(
								"OFF" => "/^0$/",
								"1"=>"/^1$/", "2"=>"/^2$/", "3"=>"/^3$/", "4"=>"/^4$/", "5"=>"/^5$/", "6"=>"/^6$/", "7"=>"/^7$/", "8"=>"/^8$/", "9"=>"/^9$/",
								"10"=>"/^10$/", "11"=>"/^11$/", "12"=>"/^12$/", "13"=>"/^13$/", "14"=>"/^14$/", "15"=>"/^15$/", "16"=>"/^16$/", "17"=>"/^17$/", "18"=>"/^18$/", "19"=>"/^19$/",
								"20"=>"/^20$/", "21"=>"/^21$/", "22"=>"/^22$/", "23"=>"/^23$/", "24"=>"/^24$/", "25"=>"/^25$/", "26"=>"/^26$/", "27"=>"/^27$/", "28"=>"/^28$/", "29"=>"/^29$/",
								"30"=>"/^30$/", "31"=>"/^31$/", "32"=>"/^32$/", "33"=>"/^33$/", "34"=>"/^34$/", "35"=>"/^35$/", "36"=>"/^36$/", "37"=>"/^37$/", "38"=>"/^38$/", "39"=>"/^39$/",
								"40"=>"/^40$/", "41"=>"/^41$/", "42"=>"/^42$/", "43"=>"/^43$/", "44"=>"/^44$/", "45"=>"/^45$/", "46"=>"/^46$/", "47"=>"/^47$/", "48"=>"/^48$/", "49"=>"/^49$/",
								"50"=>"/^50$/", "51"=>"/^51$/", "52"=>"/^52$/", "53"=>"/^53$/", "54"=>"/^54$/", "55"=>"/^55$/", "56"=>"/^56$/", "57"=>"/^57$/", "58"=>"/^58$/", "59"=>"/^59$/",
								"60"=>"/^60$/", "61"=>"/^61$/", "62"=>"/^62$/", "63"=>"/^63$/", "64"=>"/^64$/", "65"=>"/^65$/", "66"=>"/^66$/", "67"=>"/^67$/", "68"=>"/^68$/", "69"=>"/^69$/",
								"70"=>"/^70$/", "71"=>"/^71$/", "72"=>"/^72$/", "73"=>"/^73$/", "74"=>"/^74$/", "75"=>"/^75$/", "76"=>"/^76$/", "77"=>"/^77$/", "78"=>"/^78$/", "79"=>"/^79$/",
								"80"=>"/^80$/", "81"=>"/^81$/", "82"=>"/^82$/", "83"=>"/^83$/", "84"=>"/^84$/", "85"=>"/^85$/", "86"=>"/^86$/", "87"=>"/^87$/", "88"=>"/^88$/", "89"=>"/^89$/",
								"90"=>"/^90$/", "91"=>"/^91$/", "92"=>"/^92$/", "93"=>"/^93$/", "94"=>"/^94$/", "95"=>"/^95$/", "96"=>"/^96$/", "97"=>"/^97$/", "98"=>"/^98$/", "99"=>"/^99$/",
								"ON" => "/^100$/"
							)
					)
			),
			"149" => array(
					"DEFINITION" => array("confort","mode","internal_temp_multiplicator","internal_temp","wanted_temp_multiplicator","wanted_temp"),
					"TYPE" => array ("CONFORT"),
					"VALUE" => array (
							"mode" => array(
								"CONFORT" => "/^0$/",
								"HORS_GEL" => "/^4$/",
								"REDUIT" => "/^3$/",
								"MANUEL" => "/^38$/"
							)
					)
			),
			"SHUTTER" => array(
					"UP" => "/^100$/",
					"MOVE_UP" => "/^102$/",
					"MOVE_DOWN" => "/^103$/",
					"DOWN" => "/^0$/",
					"STOP" => "/^101$/"
			)
	);

	//Definition des function code
	public $OWN_FUNCTION_CODE = array(
			"48" => "INTERFACE",
			"49" => "VARIATOR",
			"50" => "SHUTTER",
			"51" => "CONFORT",
			"53" => "SCENE",
			"55" => "LIGHTING"
	);
	
	//Definition des differents parametres
	public $OWN_PARAM_DEFINITION = array(
			"GO_TO_LEVEL_TIME" => array("level", "time"),
			"DIM_STEP" => array("step", "time"),
			"CONSIGNE" => array("consigne", "0x00"),
			"DEROGATION_CONSIGNE" => array("duration_consigne", "0x00"),
			"GO_TO_TEMPERATURE" => array("temp"),
			"CONFORT_JOUR_ROUGE" => array("consigne"),
			"COMMANDE_ECS" => array("ECS"),
			"SET_TEMP_CONFORT" => array("temp"),
			"INDICATION_TEMP_CONFORT" => array("temp"),
			"INFORMATION_TARIF" => array("tarif"),
			"INDEX_BASE" => array("1_index_base", "index_HP"),
			"INDEX_HC" => array("2_index_HC","index_HP", "index_HC"),
			"INDEX_BLEU" => array("3_index_bleu", "index_HP", "index_HC"),
			"INDEX_BLANC" => array("4_index_blanc", "index_HP", "index_HC"),
			"INDEX_ROUGE" => array("5_index_rouge", "index_HP", "index_HC"),
			"SET_TEMP_ECO" => array("temp"),
			"INDICATION_TEMP_ECO" => array("temp"),
			"SET_V3V_CONSIGNE" => array("temp_consigne", "temp_aux", "temp_security", "band", "forcing"),
			"BATTERY_WEAK" => array("battery_weak_indicator"),
			"CLOCK_SYNCHRONISATION" => array("hour", "minute", "second", "unknown", "unknown", "day", "month", "year"),
			"SET_CLOCK_TIME_PARAMETERS" => array("year", "month", "day", "hour", "minute", "second"),
			"INDICATION_CLOCK_TIME_PARAMETERS" => array("year", "month", "day", "hour", "minute", "second"),
			"OVERRIDE_FOR_TIME" => array("time"),
			"ACTION_FOR_TIME" => array("time"),
			"ACTION_IN_TIME" => array("time"),
			"INFO_SCENE_OFF" => array("family_type", "address"),
			"REQUEST_ID" => array("function_or_reference"),
			"DEVICE_DESCRIPTION_STATUS" => array("reference", "version", "function_code", "units_count"),
			"MEMORY_DATA" => array("family_type", "address", "preset_value", "frame_number", "message_length"),
			"MEMORY_DEPTH_INDICATION" => array("depth"),
			"EXTENDED_MEMORY_DATA" => array("family_type", "address", "preset_value", "frame_number"),
			"MEMORY_WRITE" => array("family_type", "address", "preset_value"),
			"UNIT_DESCRIPTION_STATUS" => array("unit_code", "unit_status"),
			"SET_COMMUNICATION_PARAMETER" => array("node_parameter"),
			"SET_CLOCK_TIME_PARAMETER" => array("year", "month", "day", "hour", "minute", "second"),
			"INDICATION_CLOCK_TIME_PARAMETER" => array("hour", "minute", "second", "unknown", "unknown", "day", "month", "year"),
			"OPEN_LEARNING" => array("function_code", "0xFF", "extended_command_code"),
			"ADDRESS_ERASE" => array("family_type", "address"),
			"OCCUPIED" => array("mode", "duration"),
			"UNOCCUPIED" => array("mode", "duration")
	);
	//Definition des differents type de contenu d'une trame
	public $OWN_TRAME_DEFINITION = array(
			"1" => array(
					"TYPE" => "LIGHTING",
					"1" => "ON",
					"0" => "OFF",
					"38" => "DIM_STOP",
					"DIMENSION" => array(
							"#10_" => "DIM_STEP",
							"#1_" => "GO_TO_LEVEL_TIME"
					)
			), //1 Lighting
			"2" => array(
					"TYPE" => "SHUTTER",
					"0" => "MOVE_STOP",
					"1" => "MOVE_UP",
					"2" => "MOVE_DOWN"
			), //2 Automations
			"4" => array(
					"TYPE" => "THERMOREGULATION",
					"50_" => "CONSIGNE",
					"51_" => "DEROGATION_CONSIGNE",
					"52" => "FIN_DEROGATION",
					"53_" => "GO_TO_TEMPERATURE",
					"54" => "ARRET",
					"55" => "FIN_ARRET",
					"56" => "STOP_FAN_SPEED",
					"57" => "LOW_FAN_SPEED",
					"58" => "HIGH_FAN_SPEED",
					"59_" => "CONFORT_JOUR_ROUGE",
					"DIMENSION" => array(
							"#40_" => "COMMANDE_ECS",
							"42_" => "INFORMATION_TARIF",
							"43" => "QUEL_INDEX",
							"43*1_" => "INDEX_BASE",
							"43*2_" => "INDEX_HC",
							"43*3_" => "INDEX_BLEU",
							"43*4_" => "INDEX_BLANC",
							"43*5_" => "INDEX_ROUGE",
							"#41_" => "SET_TEMP_CONFORT",
							"41" => "READ_TEMP_CONFORT",
							"41_" => "INDICATION_TEMP_CONFORT",
							"#44_" => "SET_TEMP_ECO",
							"44" => "READ_TEMP_ECO",
							"44_" => "INDICATION_TEMP_ECO",
							"#45_" => "SET_V3V_CONSIGNE",
							"45" => "CONSIGN_V3V_REQUEST"
									)
			), //4 Thermoregulation (Heating)
			"8" => array(
			"TYPE" => "ALARM",
			"1" => "CONCIERGE_CALL",
			"19" => "LOCKER_CONTROL"
					), //8 Door Entry System
					"25" => array(
					"TYPE" => "SCENE",
					"11" => "ACTION",
					"16" => "STOP_ACTION",
					"17_" => "ACTION_FOR_TIME",
					"18_" => "ACTION_IN_TIME",
					"19_" => "INFO_SCENE_OFF"
							), //25 Scenarios
							"13" => array(
							"TYPE" => "MANAGEMENT",
							"23_" => "CLOCK_SYNCHRONISATION",
							"24_" => "LOW_BATTERY",
							"DIMENSION" => array(
							"22" => "READ_CLOCK_TIME_PARAMETER",
							"22_" => "INDICATION_CLOCK_TIME_PARAMETER",
							"#22_" => "SET_CLOCK_TIME_PARAMETER"
									)
							), //13 Management
							"14" => array(
							"TYPE" => "SPECIAL_COMMAND",
							"0_" => "OVERRIDE_FOR_TIME",
							"1" => "END_OF_OVERRIDE"
									), //14 Special commands
									"1000" => array(
									"TYPE" => "CONFIGURATION",
									"61_" => "OPEN_LEARNING",
									"62" => "CLOSE_LEARNING",
									"63_" => "ADDRESS_ERASE",
									"64" => "MEMORY_RESET",
									"65" => "MEMORY_FULL",
									"66" => "MEMORY_READ",
									"72" => "VALID_ACTION",
									"73" => "INVALID_ACTION",
									"68" => "CANCEL_ID",
									"69_" => "MANAGEMENT_CLOCK_SYNCHRONISATION",
									"70_" => "OCCUPIED",
									"71_" => "UNOCCUPIED",
									"DIMENSION" => array(
									"13" => "ANNOUNCE_ID",
									"51" => "DEVICE_DESCRIPTION_REQUEST",
									"51_" => "DEVICE_DESCRIPTION_STATUS",
									"13_" => "REQUEST_ID",
									"53_" => "EXTENDED_MEMORY_DATA",
									"56_" => "MEMORY_DEPTH_INDICATION",
									"52_" => "MEMORY_DATA",
									"55" => "UNIT_DESCRIPTION_REQUEST",
									"55_" => "UNIT_DESCRIPTION_STATUS",
									"#54_" => "MEMORY_WRITE",
									"#57_" => "SET_COMMUNICATION_PARAMETER"
											)
									)
	);
}

?>