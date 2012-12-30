
var createFavoris = function() {
	
	var formAction = Ext.create('Ext.form.FieldSet', {
		title: 'Références du favoris',
		collapsible: true,
		defaults: {
			width: 500
		},
		items: [{
			xtype     : 'textfield',
			name      : 'nom',
			fieldLabel: 'Nom',
			msgTarget: 'side',
			allowBlank: false
		},{
			xtype     : 'textfield',
			name      : 'trame',
			fieldLabel: 'Trame',
			msgTarget: 'side',
			allowBlank: false
		}]
	});
	
	var formSendCommande = Ext.create('Ext.form.Panel', {
		title:'Ajout de Favoris',
		height:200,
		closable: true,
		autoScroll:true,
		defaults: {
			margin:10,
			padding: 10
		},
		items: [ formAction ],
		buttons: [{
			text: 'Effacer',
			handler: function() {
				this.up('form').getForm().reset();
			}
		},{
			text: 'Envoyer',
			handler: function() {
				var form = this.up('form').getForm(),
					encode = Ext.String.htmlEncode,
					s='';
				if (form.isValid()) {
					var formValues = form.getValues();
					Ext.iterate(formValues, function(key, value) {
						value = encode(value);
						s += Ext.util.Format.format("{0} = {1}<br />", key, value);
					}, this);
					var params = "'"+encode(formValues.nom)+"','"+encode(formValues.trame)+"'";
					Ext.Ajax.request({
						url: '../back/client.php',
						method: 'GET',
						success: function(response) {
							Ext.myMsg.msg('Information', 'Ok : Favoris enregistré !<br />'+response.responseText);
						},
						failure: function(response) {
							Ext.myMsg.msg('Information', 'Erreur : Le favoris n\'a pas été envoyé pour enregistrement !');
						},
						params: { call: 'add_favoris', params: params }
					});
				}
			}
		}]
	});

	//Affichage
	clearContent();
	var region = Ext.getCmp('Content');
	region.add(formSendCommande);
	formSendCommande.show();
	
};

var openFavoris = function() {	
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
	var panelFavoris = new Ext.grid.Panel({
		title : 'Liste des favoris enregistrés', 
		store: 'DataFavoris',
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [filter],
		columns: [
			{text: 'id', dataIndex: 'id', width: 131,
				filter: {
					type: 'string'
				}
			},
			{text: 'nom', dataIndex: 'nom', width: 131}, 
			{text: 'trame', dataIndex: 'trame', width: 131}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataFavoris'),
			displayInfo: true,
			displayMsg: 'Liste des favoris {0} - {1} of {2}',
			emptyMsg: "Aucun favoris"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelFavoris);
	panelFavoris.show();
};