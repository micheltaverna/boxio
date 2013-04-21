/**
 * Gestion des trames
 */
var openTrame = function() {
	
	var func_createPanel = function() {
		// Creation du tableau
		var panelTrame = new Ext.grid.Panel({
			title : 'Lecture du BUS', 
			id: 'panelTrame',
			store: Ext.data.StoreManager.lookup('dataTrame'),
			disableSelection: false,
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
		        groupHeaderTpl: '{columnName}: {name} ({rows.length} trame{[values.rows.length > 1 ? "s" : ""]})',
		        hideGroupedHeader: false,
		        enableGroupingMenu: true
		    }],
			columns: [
				{text: "Date", dataIndex: 'Date', width: 131, filter: {type: 'date'}, tooltip:'Heure d\'execution'},
				{text: "Id", dataIndex: 'id', width: 59, filter: {type: 'string'}, tooltip:'Id de la Trame'},
				{text: "Id Legrand", dataIndex: 'id_legrand', sortable: false, width: 95, filter: {type: 'string'}, tooltip:'Id de l\'équipement'},
				{text: "Unite", dataIndex: 'unit', sortable: false, width: 58, filter: {type: 'string'}, tooltip:'Unite de l\'équipement'},
				{text: "Media", dataIndex: 'media', sortable: false, width: 84},
				{text: "Mode", dataIndex: 'mode', sortable: false, width: 83},
				{text: "Format", dataIndex: 'format', sortable: false, width: 135},
				{text: "Dimension", dataIndex: 'dimension', sortable: false, width: 198},
				{text: "Type", dataIndex: 'type', sortable: false, width: 123},
				{text: "Value", dataIndex: 'value', sortable: false, width: 132},
				{text: "Param", dataIndex: 'param', sortable: false, width: 143}
			],
			// Creation de la bar de defilement des pages
			bbar: Ext.create('Ext.PagingToolbar', {
				store: Ext.data.StoreManager.lookup('dataTrame'),
				displayInfo: true,
				displayMsg: 'Liste des Trames {0} - {1} of {2}',
				emptyMsg: "Aucune Trame"
			})
		});
	
		clearContent();
		var region = Ext.getCmp('Content');
		region.add(panelTrame);
		panelTrame.show();
	};

	if (Ext.getCmp('panelTrame')) {
		Ext.data.StoreManager.lookup('dataTrame').reload();
	} else {
		func_createPanel();
		Ext.data.StoreManager.lookup('dataTrame').reload();
	};
};