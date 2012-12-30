// Creation du model de Data
var openAuthor = function() {
	Ext.MessageBox.show({
		title: 'L\'Auteur',
		msg: 'Auteur / Concepteur : <a href="http://code.google.com/p/boxio/" target="_blank">'+auteur+'</a>',
		buttons: Ext.MessageBox.OK,
		animateTarget: Ext.getCmp('menuAuteur'),
		fn: function() {
		},
		icon: Ext.MessageBox.INFO
	});
};
