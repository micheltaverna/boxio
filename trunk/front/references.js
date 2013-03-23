/**
 * Creation du model de Data
 */ 

var openReferences = function() {

	var func_createPanel = function() {
		// Creation du tableau
		var panelReferences = new Ext.grid.Panel({
			title : 'Liste des Référenes supportées par le serveur', 
			id: 'panelReferences',
			store: 'DataReferences',
			disableSelection: false,
			loadMask: true,
			width: '100%',
			height: 500,
			autoScroll: true,
			closable: true,
			features: [{
		        ftype: 'filters',
		        encode: true,
		        local: false,
				phpMode: true,
		        filters: [{
		            type: 'boolean',
		            dataIndex: 'visible'
		        }]
		    }],
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
	
	if (Ext.getCmp('panelReferences')) {
		Ext.data.StoreManager.lookup('DataReferences').reload();
	} else {
		func_createPanel();
		Ext.data.StoreManager.lookup('DataReferences').reload();
	};
};