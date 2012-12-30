/**
 * Liste des definitions des datas models partagés
 */

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
		{name: 'id', type: 'int'}, 
		{name: 'nom', type: 'string'}, 
		{name: 'minutes', type: 'string'}, 
		{name: 'heures', type: 'string'}, 
		{name: 'jour', type: 'string'},
		{name: 'jourSemaine', type: 'string'},
		{name: 'mois', type: 'string'} ,
		{name: 'id_favoris', type: 'int'}, 
		{name: 'id_macro', type: 'int'}, 
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

