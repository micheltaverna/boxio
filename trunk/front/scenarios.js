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
		columns: [
			{text: "Id Legrand", dataIndex: 'id_legrand', width: 59},
			{text: "Unite", dataIndex: 'unit', sortable: false, width: 58},
			{text: "Référence", dataIndex: 'reference', sortable: false, width: 84},
			{text: "Famille", dataIndex: 'family', sortable: false, width: 84},
			{text: "Media", dataIndex: 'media', sortable: false, width: 84},
			{text: "Référence Interne", dataIndex: 'reference_interne', sortable: false, width: 83},
			{text: "Nom", dataIndex: 'nom', sortable: false, width: 135},
			{text: "Zone", dataIndex: 'zone', sortable: false, width: 198},
			{text: "Id Legrand d'écoute", dataIndex: 'id_legrand_listen', sortable: false, width: 123},
			{text: "Unite d'écoute", dataIndex: 'unit_listen', sortable: false, width: 132},
			{text: "Scénarios", dataIndex: 'scenario_listen', sortable: false, width: 143},
			{text: "Famille", dataIndex: 'family_listen', sortable: false, width: 143},
			{text: "Référence", dataIndex: 'reference_listen', sortable: false, width: 143},
			{text: "Référence Interne", dataIndex: 'reference_interne_listen', sortable: false, width: 143},
			{text: "Nom", dataIndex: 'nom_listen', sortable: false, width: 272},
			{text: "Zone", dataIndex: 'zone_listen', sortable: false, width: 272}
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