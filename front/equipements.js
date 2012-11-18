/**
 * Gestion des equipements
 */

var addEquipements = function() {
	;
};

var openEquipements = function() {
	var panelEquipements = new Ext.grid.Panel({
		title : 'Liste des équipements référencés dans le serveur', 
		store: Ext.data.StoreManager.lookup('DataEquipements'),
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		emptyText: 'Aucun équipement trouvé',
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
			{text: 'Nom', dataIndex: 'nom', width: 131, filter: {type: 'string'}},
			{text: 'Zone', dataIndex: 'zone', width: 131, filter: {type: 'list', store:Ext.data.StoreManager.lookup('DataZones')}}, 
			{text: 'Référence Legrand', dataIndex: 'ref_legrand', width: 131, filter: {type: 'numeric'}},
			{text: 'Id Legrand', dataIndex: 'id_legrand', width: 131, filter: {type: 'numeric'}}, 
			{
			    xtype:'actioncolumn',
				text: 'Action', width: 50,
			    items: [{
			        icon: 'imgs/delete.png',
			        tooltip: 'Effacer',
			        handler: function(grid, rowIndex, colIndex) {
			            var rec = grid.getStore().getAt(rowIndex);
			            var id = rec.get('id_legrand');
			            Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			            	if (btn == 'yes') {
					            requestCall('del_equipement', id);
			            	}
			            });
			        }
			    }]
			}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataEquipements'),
			displayInfo: true,
			displayMsg: 'Liste des équipements {0} - {1} of {2}',
			emptyMsg: "Aucun équipement"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelEquipements);
	panelEquipements.show();
};