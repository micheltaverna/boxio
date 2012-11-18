/**
 * Gestion du layout general de l'interface
 */

var clearContent = function() {
	var cmp = Ext.getCmp('Content');
    var f;
    while(f = cmp.items.first()){
        cmp.remove(f, true);
    }
};

Ext.onReady(function(){
	
	new Ext.Panel({ 
		id: 'Header', 
		region: 'north',
		padding:'10', 
		border: false,
		frame : false,
		autoScroll: true,
		items: [Ext.getCmp('Menu')]
	});
	
	new Ext.Panel({ 
		id: 'Content', 
		region: 'center', 
		padding:'0, 10, 10, 10', 
		border: false,
		frame: false,
		autoScroll: true
	}); 
	
	new Ext.Viewport({ 
		id: 'Viewport',
		autoScroll: true,
		frame : true, 
		border: true,
		style: {backgroundImage: 'url(imgs/desk.jpg)'},
		defaults: {autoScroll: true},
		items: [ Ext.getCmp('Header'), Ext.getCmp('Content')] 
	});
	
	//Initialisation des QuickTips
	Ext.QuickTips.init();
});

