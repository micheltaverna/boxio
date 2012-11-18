/**
 * Gestion des trames
 */
var openTrame = function() {
		
	// Creation du tableau
	var panelTrame = new Ext.grid.Panel({
		title : 'Lecture du BUS', 
		id: 'panelTrame',
		store: Ext.data.StoreManager.lookup('dataTrame'),
		disableSelection: true,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		columns: [
			{text: "Date", dataIndex: 'Date', width: 131},
			{text: "Id", dataIndex: 'id', width: 59},
			{text: "Référence", dataIndex: 'id_legrand', sortable: false, width: 95},
			{text: "Unite", dataIndex: 'unit', sortable: false, width: 58},
			{text: "Media", dataIndex: 'media', sortable: false, width: 84},
			{text: "Mode", dataIndex: 'mode', sortable: false, width: 83},
			{text: "Format", dataIndex: 'format', sortable: false, width: 135},
			{text: "Dimension", dataIndex: 'dimension', sortable: false, width: 198},
			{text: "Type", dataIndex: 'type', sortable: false, width: 123},
			{text: "Value", dataIndex: 'value', sortable: false, width: 132},
			{text: "Param", dataIndex: 'param', sortable: false, width: 143},
			{text: "Trame", dataIndex: 'trame', sortable: false, width: 272}
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