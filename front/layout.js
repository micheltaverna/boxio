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

var layout = {
	func: {
		add: function(cmp) {
			Ext.getCmp('Content').add(cmp);
		},

		clear: function() {
			Ext.getCmp('Content').removeAll(true);
		},
		
		init: function() {
			Ext.onReady(function(){	
				new Ext.Viewport({ 
					id: 'Viewport',
					autoScroll: true,
					frame : true, 
					border: true,
					style: {backgroundImage: 'url(imgs/desk.jpg)'},
					defaults: {autoScroll: true},
					items: [{
						xtype: 'panel',
						id: 'Header', 
						region: 'north',
						padding:'10', 
						border: false,
						frame : false,
						autoScroll: true,
						items: [Ext.getCmp('Menu')]
					},{
						xtype: 'panel',
						id: 'Content', 
						region: 'center', 
						padding:'0, 10, 10, 10', 
						border: false,
						frame: false,
						autoScroll: true
					}] 
				});
				Ext.QuickTips.init();
			});
		}
	}
};


