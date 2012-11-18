// Creation du model de Data
var openMacros = function() {

	Ext.define('macros',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'id_command', type: 'int'}, 
			{name: 'id_macro', type: 'int'}, 
			{name: 'nom', type: 'string'}, 
			{name: 'id_favoris', type: 'int'}, 
			{name: 'trame_favoris', type: 'string'},
			{name: 'trame', type: 'string'},
			{name: 'timing', type: 'int'} 
		]
	});
	
	// Creation des Data
	var DataMacros = new Ext.data.Store({
		storeId: 'DataMacros',
		model: 'macros',
		pageSize: 20,
		remoteSort: true,
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../back/client.php?view=view_macros',
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
	var panelMacros = new Ext.grid.Panel({
		title : 'Liste des macros enregistrées', 
		store: DataMacros,
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [filter],
		columns: [
			{text: 'id_command', dataIndex: 'id_command', width: 131,
				filter: {
					type: 'string'
				}
			},
			{text: 'id_macro', dataIndex: 'id_macro', width: 131}, 
			{text: 'nom', dataIndex: 'nom', width: 131},
			{text: 'id_favoris', dataIndex: 'id_favoris', width: 131}, 
			{text: 'trame_favoris', dataIndex: 'trame_favoris', width: 131},
			{text: 'trame', dataIndex: 'trame', width: 131}, 
			{text: 'timing', dataIndex: 'timing', width: 131}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataMacros'),
			displayInfo: true,
			displayMsg: 'Liste des macros {0} - {1} of {2}',
			emptyMsg: "Aucune macros"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelMacros);
	panelMacros.show();
};