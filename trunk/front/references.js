/**
 * Creation du model de Data
 */ 

var openReferences = function() {
	Ext.define('references',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'ref_legrand', type: 'int'}, 
			{name: 'nom', type: 'string'}, 
			{name: 'family', type: 'string'}, 
			{name: 'media', list: ['RF', 'CPL', 'IR', 'UNKNOWN']}
		]
	});
	
	// Creation des Data
	var DataReferences = new Ext.data.Store({
		storeId: 'DataReferences',
		model: 'references',
		pageSize: 20,
		remoteSort: true,
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../back/client.php?view=view_references',
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
	var panelReferences = new Ext.grid.Panel({
		title : 'Liste des Référenes supportées par le serveur', 
		store: DataReferences,
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [filter],
		columns: [
			{text: 'ref_legrand', dataIndex: 'ref_legrand', width: 131,
				filter: {
					type: 'string'
				}
			},
			{text: 'nom', dataIndex: 'nom', width: 131}, 
			{text: 'family', dataIndex: 'family', width: 131}, 
			{text: 'media', dataIndex: 'media', width: 131}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataReferences'),
			displayInfo: true,
			displayMsg: 'Liste des références {0} - {1} of {2}',
			emptyMsg: "Aucune référence"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelReferences);
	panelReferences.show();
};