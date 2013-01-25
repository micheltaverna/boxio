// Creation du model de Data
var openMacros = function() {
	// Creation du tableau
	var panelMacros = new Ext.grid.Panel({
		title : 'Liste des macros enregistrées', 
		store: Ext.data.StoreManager.lookup('DataMacros'),
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
			phpMode: true
	    },{
	        ftype: 'groupingsummary',
	        groupHeaderTpl: '{columnName}: {name} ({rows.length} commande{[values.rows.length > 1 ? "s" : ""]})',
	        hideGroupedHeader: false,
	        enableGroupingMenu: true
	    }],
		columns: [
			{text: 'Id de la Commande', dataIndex: 'id_command', width: 131, hidden: true, filter: {type: 'string'}},
			{text: 'Id de la Macro', dataIndex: 'id_macro', width: 131, hidden: true, filter: {type: 'string'}}, 
			{text: 'Nom de la Macro', dataIndex: 'nom', width: 200, hidden: true, filter: {type: 'string'}},
			{text: 'Id du Favoris', dataIndex: 'id_favoris', hidden: true, width: 131, filter: {type: 'string'}}, 
			{text: 'Nom de la Commande', dataIndex: 'nom_command', width: 200, filter: {type: 'string'}},
			{text: 'Trame executée', dataIndex: 'trame', width: 131, hidden: true, filter: {type: 'string'}}, 
			{text: 'Temporisation', dataIndex: 'timing', width: 131, filter: {type: 'numeric'}, renderer: function(val) {
				if (val == 0) {
					return '<span style="font-style:italic;">Immédiat</span>';
				} else if (val == 1) {
					return '<span style="font-style:italic;">'+val+'<sup>ère</sup> seconde</span>';
				} else {
					return '<span style="font-style:italic;">'+val+'<sup>ème</sup> secondes</span>';
				}
			}}
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

var addMacros = function() {
	
};