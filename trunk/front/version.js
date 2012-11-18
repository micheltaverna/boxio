// Creation du model de Data
var openVersion = function() {
	Ext.MessageBox.show({
		title: 'Version',
		msg: 'Version du produit : '+version,
		buttons: Ext.MessageBox.OK,
		animateTarget: Ext.getCmp('menuVersion'),
		fn: function() {
		},
		icon: Ext.MessageBox.INFO
	});
};
