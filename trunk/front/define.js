/**
 * Liste des definitions des datas models partagés
 */

//Definition des media d'ecoute
var defineMedia = {
		'CPL' : '96',
		'RF' : '64',
		'IR' : '128',
		'96' : 'CPL',
		'64' : 'RF',
		'128' : 'IR'
};

//Definition du vtype listInteger
Ext.apply(Ext.form.field.VTypes, {
	listInteger:  function(v) {
        return /^\d+.*$/.test(v);
    },
    listIntegerText: 'Champ numérique obligatoire',
    listIntegerMask: /[\d]/i
});

//Definition des trames temporaires
Ext.define('trameSaved', {
	extend: 'Ext.data.Model',
	fields: [
		'id_legrand',
		'unit',
		'action',
		'param',
		'mode',
		'media',
		'hours',
		'minutes',
		'date',
		'trame'
	]
});

//Definition du module de recheche de scenarios
Ext.define('checkScenarios',{
	extend: 'Ext.data.Model',
	fields: [
	  	{name: 'id_legrand', type: 'int'}, 
	  	{name: 'unit', type: 'int'}, 
	  	{name: 'id_legrand_listen', type: 'int'}, 
		{name: 'unit_listen', type: 'int'}, 
		{name: 'value_listen', type: 'string'},
		{name: 'media_listen', type: 'string'},
		{name: 'in_memory', type: 'string'},
		{name: 'in_db', type: 'string'},
		{name: 'nom', type: 'string'},
		{name: 'zone', type: 'string'},
		{name: 'family', type: 'string'}
	]
});

//Definition du module de recherche d'une reference
Ext.define('findReference',{
	extend: 'Ext.data.Model',
	fields: [
 		{name: 'reference', type: 'int'}, 
		{name: 'id_legrand', type: 'int'}, 
		{name: 'reference_geree', type: 'string'},
		{name: 'reference_nom', type: 'string'},
		{name: 'reference_family', type: 'string'}
	]
});

//Definition du module de recherche du statut serveur
Ext.define('findStatus',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'status_long', type: 'string'},
		{name: 'status_short', type: 'string'},
		{name: 'status', type: 'string'}
	]
});

//Definition du module des macros
Ext.define('macros',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id_command', type: 'int'}, 
		{name: 'id_macro', type: 'int'}, 
		{name: 'nom', type: 'string'}, 
		{name: 'id_favoris', type: 'int'}, 
		{name: 'nom_command', type: 'string'},
		{name: 'trame', type: 'string'},
		{name: 'timing', type: 'int'} 
	]
});

//Definition des references
Ext.define('references',{
	extend: 'Ext.data.Model',
	fields: [
  		{name: 'id', mapping: 'ref_legrand'},
		{name: 'text', mapping: 'nom', convert:function(value, record) {
            return record.get('nom')+' ('+record.get('id')+')';
		}},
		{name: 'list', mapping: 'nom', convert:function(value, record) {
            return record.get('id')+' ('+record.get('nom')+')';
		}},
		{name: 'ref_legrand', type: 'int'}, 
		{name: 'nom', type: 'string'}, 
		{name: 'family', type: 'string'}, 
		{name: 'media', list: ['RF', 'CPL', 'IR', 'UNKNOWN']}
	]
});

//Definition des favoris
Ext.define('favoris',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'}, 
		{name: 'nom', type: 'string'}, 
		{name: 'trame', type: 'string'}
	]
});

//Definition des zones
Ext.define('zones',{
	extend: 'Ext.data.Model',
	fields: [
 		{name: 'id', mapping: 'nom'},
		{name: 'text', mapping: 'nom'}
	]
});

//Definition des equipements
Ext.define('equipements',{
	extend: 'Ext.data.Model',
	fields: [
	 	{name: 'list', mapping: 'nom', convert:function(value, record) {
            return record.get('id_legrand')+' ('+record.get('nom')+')';
		}},
		{name: 'nom', type: 'string'}, 
		{name: 'zone', type: 'string'}, 
		{name: 'id_legrand', type: 'int'}, 
		{name: 'ref_legrand', type: 'int'}
	]
});

//Definition des equipements inconnu
Ext.define('unknownEquipements',{
	extend: 'Ext.data.Model',
	fields: [
			{name: 'id_legrand', type: 'int'}, 
			{name: 'media', list: ['RF', 'CPL', 'IR', 'UNKNOWN']}, 
			{name: 'Date', type: 'timestamp'}
	]
});

//Definition des equipements cron (jalons)
Ext.define('cron',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id_cron', mapping: 'id', type: 'int'}, 
		{name: 'nom', type: 'string'}, 
		{name: 'readCron', convert:function(value, record) {
			var minutes = record.get('minutes');
			if (minutes == '*') {
				minutes = '<span class="result_cell_horodatage">Toutes</span> les minutes';
			} else {
				if (minutes.match(/[-,]/) == -1 || minutes.match(/[-,]/) == null) {
					if (minutes == '1') {
						minutes = 'La <span class="result_cell_horodatage">première</span> minute';
					} else {
						minutes = 'La <span class="result_cell_horodatage">'+minutes+'<sup>ème</sup></span> minute';
					}
				} else {
					minutes = minutes.replace(/-/g, ' à ');
					minutes = minutes.replace(/,/g, ' et ');
					minutes = 'Les minutes <span class="result_cell_horodatage">'+minutes+'</span>';
				}
			}
			var heures = record.get('heures');
			if (heures == '*') {
				heures = ' de <span class="result_cell_horodatage">toutes</span> les heures';
			} else {
				if (heures.match(/[-,]/) == -1 || heures.match(/[-,]/) == null) {
					if (heures == '1') {
						heures = ' de la <span class="result_cell_horodatage">première</span> heure';
					} else {
						heures = ' de la <span class="result_cell_horodatage">'+heures+'<sup>ème</sup></span> heure';
					}
				} else {
					heures = heures.replace(/-/g, ' à ');
					heures = heures.replace(/,/g, ' et ');
					heures = ' des heures <span class="result_cell_horodatage">'+heures+'</span>';
				}
			}
			var jour = record.get('jour');
			if (jour == '*') {
				jour = ', de <span class="result_cell_horodatage">tous</span> les jours du mois';
			} else {
				if (jour.match(/[-,]/) == -1 || jour.match(/[-,]/) == null) {
					if (jour == '1') {
						jour = ', du <span class="result_cell_horodatage">premier</span> jour du mois ';
					} else {
						jour = ', du <span class="result_cell_horodatage">'+jour+'<sup>ème</sup></span> jour du mois';
					}
				} else {
					jour = jour.replace(/-/g, ' à ');
					jour = jour.replace(/,/g, ' et ');
					jour = ', des jours <span class="result_cell_horodatage">'+jour +'</span> du mois';
				}
			}
			var jourSemaine = record.get('jourSemaine');
			if (jourSemaine == '*') {
				jourSemaine = ' de <span class="result_cell_horodatage">tous</span> les jours de la semaine';
			} else {
				if (jourSemaine.match(/[-,]/) == -1 || jourSemaine.match(/[-,]/) == null) {
					jourSemaine = ' mais uniquement <span class="result_cell_horodatage">le '+jourSemaine+'</span>';
				} else {
					jourSemaine = jourSemaine.replace(/-/g, ' au ');
					jourSemaine = jourSemaine.replace(/,/g, ' et du ');
					jourSemaine = ' mais uniquement les jours <span class="result_cell_horodatage">du '+jourSemaine+'</span>';
				}
				jourSemaine = jourSemaine.replace('1', ' lundi');
				jourSemaine = jourSemaine.replace('2', ' mardi');
				jourSemaine = jourSemaine.replace('3', ' mercredi');
				jourSemaine = jourSemaine.replace('4', ' jeudi');
				jourSemaine = jourSemaine.replace('5', ' vendredi');
				jourSemaine = jourSemaine.replace('6', ' samedi');
				jourSemaine = jourSemaine.replace('7', ' dimanche');
			}
			var mois = record.get('mois');
			if (mois == '*') {
				mois = ' pour <span class="result_cell_horodatage">tous</span> les mois de l\'année.';
			} else {
				if (mois.match(/[-,]/) == -1 || mois.match(/[-,]/) == null) {
					mois = ' seulement <span class="result_cell_horodatage">en '+mois+'</span>.';
				} else {
					mois = mois.replace('-', ' à ');
					mois = mois.replace(',', ' et de ');
					mois = ' seulement <span class="result_cell_horodatage">les mois de '+mois+'</span>.';
				}
				mois = mois.replace('1', ' janvier');
				mois = mois.replace('2', ' févreier');
				mois = mois.replace('3', ' mars');
				mois = mois.replace('4', ' avril');
				mois = mois.replace('5', ' mais');
				mois = mois.replace('6', ' juin');
				mois = mois.replace('7', ' juillet');
				mois = mois.replace('8', ' août');
				mois = mois.replace('9', ' septembre');
				mois = mois.replace('10', ' octobre');
				mois = mois.replace('11', ' novembre');
				mois = mois.replace('12', ' décembre');
			}
            return ('<div style="white-space:normal !important;">'+minutes+heures+jour+jourSemaine+mois+'</div>');
		}},
		{name: 'minutes', type: 'string'}, 
		{name: 'heures', type: 'string'}, 
		{name: 'jour', type: 'string'},
		{name: 'jourSemaine', type: 'string'},
		{name: 'mois', type: 'string'} ,
		{name: 'id_favoris', type: 'int'}, 
		{name: 'nom_favoris', type: 'string'}, 
		{name: 'id_macro', type: 'int'}, 
		{name: 'nom_macro', type: 'string'}, 
		{name: 'trame', type: 'string'}, 
		{name: 'active', type: 'int'}
	]
});

//Definition des trames
Ext.define('Trame',{
	extend: 'Ext.data.Model',
	fields: [
		{name: 'id', type: 'int'}, 
		{name: 'trame', type: 'string'}, 
		{name: 'direction'}, 
		{name: 'mode'}, 
		{name: 'media', list: ['RF', 'CPL', 'IR', 'UNKNOWN']}, 
		{name: 'format'}, 
		{name: 'type'}, 
		{name: 'value'}, 
		{name: 'dimension'}, 
		{name: 'param'}, 
		{name: 'id_legrand', type: 'int'}, 
		{name: 'unit', type: 'int'},
		{name: 'Date', type: 'timestamp'}
	]
});

//Definition des Actions dans une trame
Ext.define('TrameAction', {
	extend: 'Ext.data.Model',
	fields: [
		{type: 'string', name: 'type'},
		{type: 'string', name: 'name'}
	]
});

