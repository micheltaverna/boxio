/**
 * Gestion des scénarios
 */

var openScenarios = function() {
	Ext.define('Scenarios',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'id_legrand', type: 'int'}, 
			{name: 'unit', type: 'int'}, 
			{name: 'reference', type: 'string'}, 
			{name: 'family', type: 'string'}, 
			{name: 'media', list: ['RF', 'CPL', 'IR', 'UNKNOWN']}, 
			{name: 'reference_interne', type: 'string'}, 
			{name: 'nom', type: 'string'}, 
			{name: 'zone', type: 'string'}, 
			{name: 'id_legrand_listen', type: 'int'}, 
			{name: 'unit_listen', type: 'int'}, 
			{name: 'scenario_listen', type: 'string'}, 
			{name: 'family_listen', type: 'string'},
			{name: 'reference_listen', type: 'string'},
			{name: 'reference_interne_listen', type: 'string'},
			{name: 'nom_listen', type: 'string'},
			{name: 'zone_listen', type: 'string'}
		]
	});
	
	// Creation des Data
	new Ext.data.Store({
		storeId: 'dataScenarios',
		model: 'Scenarios',
		pageSize: 50,
		remoteSort: true,
		remoteGroup: true,
		autoLoad: true,
		proxy: {
			// load using HTTP
			type: 'ajax',
			url: '../back/client.php?view=view_scenarios',
			// the return will be XML, so lets set up a reader
			reader: {
				type: 'xml',
				// records will have an "Item" tag
				record: 'module',
				root: 'content',
				totalRecords: 'total'
			},
			simpleSortMode: true
		}
	});
	
	// Creation du tableau
	var panelScenarios = new Ext.grid.Panel({
		title : 'Liste des Scénarios référencés dans le serveur', 
		id: 'panelScenarios',
		store: Ext.data.StoreManager.lookup('dataScenarios'),
		disableSelection: true,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [{
				ftype: 'filters',
				encode: true,
				local: false,
				phpMode: true
	    	},{
	    		ftype: 'groupingsummary',
	    		groupHeaderTpl: '{columnName}: {name} ({rows.length} équipement{[values.rows.length > 1 ? "s" : ""]})',
	    		hideGroupedHeader: false,
	    		enableGroupingMenu: true
	    }],
	    columns: [
	              {text:'Récepteurs',	
	            	  columns: [
	        					{text: "Nom", dataIndex: 'nom', sortable: true, width: 135, filter: {type: 'string'}},
	        					{text: "Référence", dataIndex: 'reference', sortable: true, width: 175, filter: {type: 'string'}},
	        					{text: "Référence Interne", dataIndex: 'reference_interne', sortable: true, width: 230, filter: {type: 'string'}},
	        					{text: "Zone", dataIndex: 'zone', sortable: true, width: 80, filter: {type: 'string'}},
	        					{text: "Id Legrand", dataIndex: 'id_legrand', width: 60, hidden: true, filter: {type: 'numeric'}},
	        					{text: "Unite", dataIndex: 'unit', sortable: true, width: 60, hidden: true, filter: {type: 'numeric'}},
	        					{text: "Famille", dataIndex: 'family', sortable: true, width: 80, hidden: true, filter: {type: 'string'}},
	        					{text: "Media", dataIndex: 'media', sortable: true, width: 88, hidden: true, filter: {type: 'string'}}
	            	          ]  
	              },
	              {text:'Emetteurs',	
	            	  columns: [
								{text: "Nom d'écoute", dataIndex: 'nom_listen', sortable: true, width: 135, filter: {type: 'string'}},
								{text: "Référence d'écoute", dataIndex: 'reference_listen', sortable: true, width: 175, filter: {type: 'string'}},
								{text: "Référence Interne d'écoute", dataIndex: 'reference_interne_listen', sortable: true, width: 230, filter: {type: 'string'}},
								{text: "Zone d'écoute", dataIndex: 'zone_listen', sortable: true, width: 80, filter: {type: 'string'}},
								{text: "Id Legrand d'écoute", dataIndex: 'id_legrand_listen', sortable: true, width: 60, hidden: true, filter: {type: 'numeric'}},
								{text: "Unite d'écoute", dataIndex: 'unit_listen', sortable: true, width: 60, hidden: true, filter: {type: 'numeric'}},
								{text: "Famille d'écoute", dataIndex: 'family_listen', sortable: true, width: 80, hidden: true, filter: {type: 'string'}},
								{text: "Référence Scénarios d'écoute", dataIndex: 'scenario_listen', sortable: true, width: 80, hidden: true, filter: {type: 'string'}}
		           	          ]  
	              },
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('dataScenarios'),
			displayInfo: true,
			displayMsg: 'Liste des Scénarios {0} - {1} of {2}',
			emptyMsg: "Aucun Scénario"
		})
	});


	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelScenarios);
	panelScenarios.show();
};