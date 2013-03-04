// Creation du model de Data
var openVersion = function() {
	Ext.MessageBox.show({
		title: 'Version',
		msg: 'Version du produit : "'+version+'". Pour plus de détail sur la version en cours et les mises à jour, consulter le service "Mise à jours".',
		buttons: Ext.MessageBox.OK,
		animateTarget: Ext.getCmp('menuVersion'),
		fn: function() {
		},
		icon: Ext.MessageBox.INFO
	});
};
