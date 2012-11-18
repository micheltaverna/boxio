/**
 * Liste des definitions des datas models partagés
 */

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
		{name: 'nom', type: 'string'}, 
		{name: 'zone', type: 'string'}, 
		{name: 'id_legrand', type: 'int'}, 
		{name: 'ref_legrand', type: 'int'}
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

