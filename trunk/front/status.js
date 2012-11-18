/**
 * Gestion du status des equipements
 */
var openStatus = function() {

	Ext.define('equipement_status',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'id_legrand', type: 'int'}, 
			{name: 'unit', type: 'int'}, 
			{name: 'idunit', type: 'int'}, 
			{name: 'ref_legrand', type: 'int'}, 
			{name: 'equipement', type: 'string'}, 
			{name: 'reference', type: 'string'}, 
			{name: 'nom_interne', type: 'string'}, 
			{name: 'Btn', type: 'string'}, 
			{name: 'possibility', type: 'string'}, 
			{name: 'server_opt', type: 'string'}, 
			{name: 'status', type: 'string'}, 
			{name: 'unit_status', type: 'string'}, 
			{name: 'zone', type: 'string'}, 
			{name: 'Date', type: 'timestamp'}
		]
	});
	
	// Creation des Data
	var DataStatus = new Ext.data.Store({
		storeId: 'DataStatus',
		model: 'equipement_status',
		pageSize: 20,
		remoteSort: true,
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../back/client.php?view=view_equipements_status',
			reader: {
				type: 'xml',
				record: 'module',
				root: 'content',
				totalRecords: 'total'
			},
			simpleSortMode: true
		}
	});
	
	var filter = {
        ftype: 'filters',
        encode: true,
        local: false,
		phpMode: true,
        filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
    };

	// Creation du tableau
	var panelStatus = new Ext.grid.Panel({
		title : 'Statut des équipements', 
		store: DataStatus,
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [filter],
		columns: [
			{text: 'id_legrand', dataIndex: 'id_legrand', width: 131,
				filter: {
					type: 'string'
				}
			},
			{text: 'unit', dataIndex: 'unit', width: 131,
				filter: {
					type: 'numeric'
				}
			}, 
			{text: 'idunit', dataIndex: 'idunit', width: 131}, 
			{text: 'ref_legrand', dataIndex: 'ref_legrand', width: 131}, 
			{text: 'equipement', dataIndex: 'equipement', width: 131}, 
			{text: 'reference', dataIndex: 'reference', width: 131}, 
			{text: 'nom_interne', dataIndex: 'nom_interne', width: 131}, 
			{text: 'Btn', dataIndex: 'Btn', width: 131}, 
			{text: 'possibility', dataIndex: 'possibility', width: 131}, 
			{text: 'server_opt', dataIndex: 'server_opt', width: 131}, 
			{text: 'status', dataIndex: 'status', width: 131}, 
			{text: 'unit_status', dataIndex: 'unit_status', width: 131}, 
			{text: 'zone', dataIndex: 'zone', width: 131}, 
			{text: 'Date', dataIndex: 'Date', width: 131}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataStatus'),
			displayInfo: true,
			displayMsg: 'Liste des équipements {0} - {1} of {2}',
			emptyMsg: "Aucun équipement"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelStatus);
	panelStatus.show();
};