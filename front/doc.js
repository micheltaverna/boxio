// Creation du model de Data
var openDoc = function() {
	Ext.MessageBox.show({
		title: 'Version',
		msg: 'En cours d\'écriture... Consulter les documentations disponibles sur : <a href="http://code.google.com/p/boxio/" target="_blank">ICI</a>',
		buttons: Ext.MessageBox.OK,
		animateTarget: Ext.getCmp('menuVersion'),
		fn: function() {
		},
		icon: Ext.MessageBox.INFO
	});
};
