/*******************************************************************************
 *             SCRIPTS NECESSAIRES A LA CREATION D'UNE TRAME IOBL
 ******************************************************************************/ 
 
var InOne = function() {
	
	/*******************************************************************************
	 *                                VARIABLES
	 ******************************************************************************/ 
	
	/** 
	 *  tableau de référence 
	 **/
	this.OWN_tab_action = {
		"1" : {
			"1" : "ON",
			"0" : "OFF",
			"38" : "DIM_STOP"
		}, //1	Lighting
		"#1" : {
			"#10" : "DIM_STEP",
			"#1" : "GO_TO_LEVEL_TIME"
		},
		"2" : {
			"0" : "MOVE_STOP",
			"1" : "MOVE_UP",
			"2" : "MOVE_DOWN"
		}, // 2	Automations
		"4" : {
			"50" : "CONSIGNE",
			"51" : "DEROGATION_CONSIGNE",
			"52" : "FIN_DEROGATION",
			"53" : "GO_TO_TEMPERATURE",
			"54" : "ARRET",
			"55" : "FIN_ARRET",
			"56" : "STOP_FAN_SPEED",
			"57" : "LOW_FAN_SPEED",
			"58" : "HIGH_FAN_SPEED",
			"59" : "CONFORT_JOUR_ROUGE"
		}, // 4	Thermoregulation (Heating)
		"8" : {
			"1" : "CONCIERGE_CALL",
			"19" : "LOCKER_CONTROL"
		}, // 8	Door Entry System
		"#4" : {
			"#40" : "COMMANDE_ECS",
			"42" : "INFORMATION_TARIF",
			"43" : "QUEL_INDEX",
			"43*1" : "INDEX_BASE",
			"43*2" : "INDEX_HC",
			"43*3" : "INDEX_BLEU",
			"43*4" : "INDEX_BLANC",
			"43*5" : "INDEX_ROUGE",
			"#41" : "SET_TEMP_CONFORT",
			"41" : "READ_TEMP_CONFORT",
			"41_" : "INDICATION_TEMP_CONFORT",
			"#44" : "SET_TEMP_ECO",
			"44" : "READ_TEMP_ECO",
			"44_" : "INDICATION_TEMP_ECO",
			"#45" : "SET_V3V_CONSIGNE",
			"45" : "CONSIGN_V3V_REQUEST"
		},
		"25" : {
			"11" : "ACTION",
			"16" : "STOP_ACTION",
			"17" : "ACTION_FOR_TIME",
			"18" : "ACTION_IN_TIME",
			"19" : "INFO_SCENE_OFF"
		}, // 25 Scenarios
		"13" : {
			"23" : "CLOCK_SYNCHRONISATION",
			"24" : "LOW_BATTERY"
		}, // 13	Management
		"#13" : {
			"22" : "READ_CLOCK_TIME_PARAMETER",
			"22" : "INDICATION_CLOCK_TIME_PARAMETER",
			"#22" : "SET_CLOCK_TIME_PARAMETER"
		},
		"14" : {
			"0" : "OVERRIDE_FOR_TIME",
			"1" : "END_OF_OVERRIDE"
		}, // 14	Special commands
		"#1000" : {
			"13" : "ANNOUNCE_ID",
			"51" : "DEVICE_DESCRIPTION_REQUEST",
			"51_" : "DEVICE_DESCRIPTION_STATUS",
			"13_" : "REQUEST_ID",
			"53" : "EXTENDED_MEMORY_DATA",
			"56" : "MEMORY_DEPTH_INDICATION",
			"52" : "MEMORY_DATA",
			"55" : "UNIT_DESCRIPTION_REQUEST",
			"55_" : "UNIT_DESCRIPTION_STATUS",
			"#54" : "MEMORY_WRITE",
			"#57" : "SET_COMMUNICATION_PARAMETER"
		}, // 51, 13 !! ?
		"1000" : {
			"61" : "OPEN_LEARNING",
			"62" : "CLOSE_LEARNING",
			"63" : "ADDRESS_ERASE",
			"64" : "MEMORY_RESET",
			"65" : "MEMORY_FULL",
			"66" : "MEMORY_READ",
			"72" : "VALID_ACTION",
			"73" : "INVALID_ACTION",
			"68" : "CANCEL_ID",
			"70" : "OCCUPIED",
			"71" : "UNOCCUPIED"
		}
	};
	
	/*******************************************************************************
	 *                         FONCTIONS (interne au protocole inone)
	 ******************************************************************************/ 
	
	this.getId = function(own_id) {
		var UnitSize = 1;
		if (own_id.length >= 8) {
			UnitSize = 2;
		}
		var IdUnit = this.decToHexa(own_id);
		var Id = this.HexaToDec(IdUnit.substr(0, IdUnit.length-UnitSize)+'0')/16;
		return Id;
	};

	this.getUnit = function(own_id) {
		var UnitSize = 1;
		if (own_id.length >= 8) {
			UnitSize = 2;
		}
		var IdUnit = this.decToHexa(own_id);
		var Unit = IdUnit.charAt(IdUnit.length-UnitSize);
		return Unit;
	};
	
	this.AddLeadingZero = function(currentField, nbZero)
	{
	  //Check if the value length hasn't reach its max length yet
	  if (currentField)
	  {
		//Add leading zero(s) in front of the value
		currentField = currentField.toString();
		var numToAdd = nbZero - currentField.length;
		
		var value = "";
		for (var i = 0; i < numToAdd; i++)
		{
		  value += "0";
		}
		currentField = value + currentField;
		
	  }
	  return currentField;
	};
	
	/**
	 *  Passage d'une valeur décimale en valeur Hexa
	 *
	 *  @param {String} dec 
	 */  
	this.decToHexa = function(dec)
	{
		var hexa='0123456789ABCDEF',hex='';
		while (dec>15)
		{
			tmp=dec-(Math.floor(dec/16))*16;
			hex=hexa.charAt(tmp)+hex;
			dec=Math.floor(dec/16);
		}
		hex=hexa.charAt(dec)+hex;
		return(hex); 
	};
	
	/**
	 *  Passage d'une valeur hexa décimale en valeur décimale
	 *
	 *  @param {String} hex
	 */  
	this.HexaToDec = function(hex)
	{
		if(hex.indexOf("0x")) hex.substring(2,hex.length);
		return parseInt(hex,16);
	};
	
	/**
	 * Séparation id et unité
	 * @return {Object}
	 *      .id
	 *      .unit
	 **/
	this.eManager_split_id = function(idunit)
	{
		var split_idunit = idunit.split('|');
		var id = split_idunit[0];
		var unit = split_idunit[1];
	/*
	    switch(idunit.length)
	    {
	        case 8: //Unit sur 2 caractères, ex RTS Somfy
	            var id = idunit.substring(0, idunit.length - 2);
	            var unit = idunit.substring(idunit.length - 2, idunit.length);
	            break;
	        default:
	            var id = idunit.substring(0, idunit.length - 1);
	            var unit = idunit.substring(idunit.length - 1, idunit.length);
	            break;
	    }
	*/
	    return {
	        id : id,
	        unit : unit
	    };
	};
	
	/** 
	 * détection de la forme de la trame : pour une création (utilisé par createFrame())
	 * 
	 * 2 SANS WHAT APRES WHERE (nb de params...)
	 * 1 avec WHAT : *WHO*WHAT#PARAMETER1#PARAMETER2#*WHERE##
	 *
	 * @param {String} action
	 *          une action de la table this.tab_action
	 * @param {Array} tab_param
	 *          liste des paramètres a créer
	 * @return {} : [type_param, liste des données formatées]  
	 **/
	this.ownManager_actionParam = function(tab_action,tab_param)
	{
		var type_param = 1;
		if(tab_action[0].substring(0, 1) == "#")
			type_param = 2;
		
		if(type_param == 1)
			return [ type_param, (tab_param == "") ? "" : tab_param.join("#") ];
		if(type_param == 2)
			return [ type_param, (tab_param == "") ? "" : tab_param.join("*") ];
		return false;
	};
	
	/** (inverse de WHOWHATToAction) recupere les paramètres WHO et WHAT à partir d'un nom d'action
	 * @param {String} action
	 *          ex : "MOVE_UP"
	 * @return {}
	 *          [WHO, WHAT]
	 **/
	this.ownManager_actionToWHOWHAT = function(action)
	{
		for ( var i in this.OWN_tab_action)
		{
			for ( var j in this.OWN_tab_action[i])
			{
				if(this.OWN_tab_action[i][j] == action)
				{
					return [ i, j ];
					
				}	
			}
		}
		return false;
	};
	
	/** 
	 * utilisé par "createFrame", concatene les éléments
	 **/
	this.ownManager_assembleFrame = function(WHO, WHAT, PARAMS, WHERE, typeofAddr)
	{
		var txt = "*" + WHO;
		if(WHAT)
			txt = txt + "*" + WHAT;
		return txt + "*" + typeofAddr + WHERE + "##";
	};
			
	/** 
	* @param {String} id
	*          id du produit
	* @param {String} unite
	*          unité/module du produit 
	* @param {String} action
	*          nom de l'action, ex : "ACTION"
	* @param {String} addr
	*           type d'addressage : "B"/"AM"/"AU" selon action
	* @param {Array} params
	*          Tableau de paramètres selon type d'action 
	* @param {String} cpl
	*           type d'addressage : "CPL"/"RF"/"IR" selon la famille
	* @return
	**/
	this.ownManager_createFrame = function(id, action, addr, params, media)
	{
		var tab = this.ownManager_actionToWHOWHAT(action);
		var par = this.ownManager_actionParam(tab,params);
		
		if(par)
		{
			var tab1 = (tab[1].indexOf("_") != -1) ? tab[1].substring(0, tab[1].length - 1) : tab[1];
	
		   switch (par[0])
			{
				case 1:
					var ttt = tab1 + ((par[1] == "") ? "" : "#" + par[1]);
					return this.ownManager_assembleFrame(tab[0], ttt, "", this.ownManager_idToWHERE(id, media), this.ownManager_typeofAddr(addr));
				case 2:
					par1 = (par[1] != "" ? "*" : "") + par[1];
					return this.ownManager_assembleFrame(tab[0], "", "", this.ownManager_idToWHERE(id, media) + "*" + tab1 + par1, this.ownManager_typeofAddr(addr)); // toujours ok?
			}
		}
		return false;
	};
	
	/** 
	 * formattage de l'id et de l'unité pour envoi ( utilisé dans createFrame() )
	 * @param {String} id
	 *      identifiant d'equipement
	 **/
	this.ownManager_idToWHERE = function(id, media)
	{
		idunit = id.toString();
		// algo : id to hexa + unit to hexa > decimal
		var id = this.eManager_split_id(idunit).id;
		var unit = this.eManager_split_id(idunit).unit;
		var idh = this.decToHexa(id);
		var unith = this.decToHexa(unit);
		var h = this.HexaToDec(idh + unith);
		var ret = this.AddLeadingZero(h.toString(), 7);
		
		switch(media)
		{
			case 'RF': //RF
				ret = ret+"#1";
				break;
			
			case 'IR': //IR
				ret = ret+"#2";
				break;
		}
		return ret;
	};
		
	/**
	 * transforme une trame openwebnet en equivalent "netgem" (* devient Y , # devient Z)
	 **/
	this.ownManager_starsharp_to_YZ = function(txt)
	{
		txt = txt.replace(/\*/g,"Y");
		txt = txt.replace(/#/g,"Z");
		return txt;
	};
	
	/** 
	 * création des données de type d'addressage pour ajout dans trame ( utilisé dans createFrame() )
	 * @param {String} type
	 *      type de transmission : B / AM / AU 
	 **/
	this.ownManager_typeofAddr = function(type)
	{
		switch (type)
		{
			case "B":
				return "0#";
			case "AM":
				return "#";
			case "AU":
				return ""; // non implementé > broadcast par default
			default:
				return ""; // broadcast par default
		}
	};
	
	/** 
	 * récuperation du nom de l'action
	 * @param {String} WHO
	 *                code openwebnet pour le type de produits
	 * @param {String} WHAT
	 *                code openwebnet pour l'action
	 * @return {String}
	 *                retourne le nom de l'action
	 **/
	this.ownManager_WHOWHATToAction = function(WHO, WHAT)
	{
		return this.OWN_tab_action[WHO][WHAT];
	};
	
	return this;
};


var InOne = new InOne();