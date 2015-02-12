function commande() {
	this.form = {
			
	};
	
	this.win = {
			
	};
}

var commande = new commande();

/**
 * 
 */
var createCommande = function(action) {
	
	//Si on a déjà ouvert une fenetre
	if (action == 'generate') {
		if (Ext.getCmp('winGenerateCommande')) {
			if (Ext.getCmp('winGenerateCommande').isVisible) {
				Ext.getCmp('winGenerateCommande').show();
				return;
			}
		}
	}

	
	//creation du fieldset pour les Référence Legrand
	var formRef = Ext.create('Ext.form.FieldSet', {
		title: 'Référence Legrand',
		collapsible: true,
		defaults: {
			layout: {
				type: 'hbox',
				defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			}
		},
		items: [{
			xtype: 'fieldcontainer',
			combineErrors: true,
			fieldLabel:'Id',
			defaults: {
			},
			items: [{
				xtype: 'combobox',
				name: 'id',
				width:400,
				valueField: 'id_legrand',
				displayField: 'list',
				store: Ext.data.StoreManager.lookup('AllDataEquipements'),
				msgTarget: 'side',
				vtype:'listInteger',
				allowBlank: false
			},{
				xtype: 'displayfield',
				value: 'Unite :'
			},{
				xtype: 'numberfield',
				name: 'unit',
				minValue:0,
				maxValue:15,
				value:0,
				width:48,
				msgTarget: 'side',
				allowBlank: false
			}]
		}]
	});

	//creation du fieldset pour les Actions
	var formAction = Ext.create('Ext.form.FieldSet', {
		title: 'Action à envoyer',
		collapsible: true,
		defaults: {
		},
		items: [
		{
			xtype: 'fieldcontainer',
			fieldLabel: 'Action',
			combineErrors: true,
			msgTarget : 'side',
			layout: 'hbox',
			defaults: {
			},
			items: [
				{
					xtype: 'combobox',
					name:'action',
					width: 250,
					displayField: 'name',
					store: Ext.data.StoreManager.lookup('DataTrameAction'),
					msgTarget: 'side',
					queryMode: 'local',
					allowBlank: false
				},
				{xtype: 'displayfield', value: 'Paramètres :'},
				{
					xtype     : 'textfield',
					name      : 'param',
					msgTarget: 'side',
					allowBlank: true
				}]
		}]
	});
	
	//Creation des modes de communications
	var formMedia = Ext.create('Ext.form.FieldSet', {
		title: 'Méthodes de communication',
		collapsible: true,
		defaults: {
			width:500,
			columns : 4
		},
		items: [
		{
			xtype: 'radiogroup',
			fieldLabel: 'Média',
			items: [{
				xtype: 'radiofield',
				name: 'media',
				inputValue: 'CPL',
				checked: true,
				boxLabel: 'CPL'
			},{
				xtype: 'radiofield',
				name: 'media',
				inputValue: 'RF',
				boxLabel: 'Radio'
			},{
				xtype: 'radiofield',
				name: 'media',
				inputValue: 'IR',
				boxLabel: 'InfraRouge'
			}]
		},{
			xtype: 'radiogroup',
			fieldLabel: 'Mode',
			items: [{
				xtype: 'radiofield',
				checked: true,
				name: 'mode',
				inputValue: 'NC',
				boxLabel: 'Default'
			},{
				xtype: 'radiofield',
				name: 'mode',
				inputValue: 'B',
				boxLabel: 'Broadcast'
			},{
				xtype: 'radiofield',
				name: 'mode',
				inputValue: 'AM',
				boxLabel: 'Multicast'
			},{
				xtype: 'radiofield',
				name: 'mode',
				inputValue: 'AU',
				boxLabel: 'Unicast'
			}]
		}]
	});

	//creation du fieldset pour l'envoie diféré
	var formDiffere = Ext.create('Ext.form.FieldSet', {
		title: 'Action à envoyer',
		collapsible: true,
		defaults: {
			layout: {
				type: 'hbox',
				defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			}
		},
		items: [{
			xtype: 'fieldcontainer',
			fieldLabel: 'Horaire',
			combineErrors: true,
			defaults: {
				hideLabel: true
			},
			items: [{
				   name : 'hours',
				   xtype: 'numberfield',
				   minValue:0,
				   maxValue:23,
				   value:new Date().getHours(),
				   width: 48,
				   allowBlank: true
				},{
				   xtype: 'displayfield',
				   value: 'Heure'
				},{
				   name : 'minutes',
				   minValue:0,
				   maxValue:59,
				   value:new Date().getMinutes(),
				   xtype: 'numberfield',
				   width: 48,
				   allowBlank: true
				},{
				   xtype: 'displayfield',
				   value: 'minutes'
				},{
				   name : 'secondes',
				   xtype: 'numberfield',
				   minValue:0,
				   maxValue:59,
				   value:new Date().getSeconds(),
				   width: 48,
				   allowBlank: true
				},{
				   xtype: 'displayfield',
				   value: 'secondes'
				}]
			},{
			xtype: 'datefield',
			flex: 2,
			name: 'date',
			format: 'd/m/Y',
			fieldLabel: 'Date d\'envoie',
			value: new Date(),
			msgTarget: 'side',
			allowBlank: true
		}]
	});

	//creation du fieldset pour les Boutons
	var formBtns = Ext.create('Ext.form.FieldSet', {
		title: 'Action',
		collapsible: true,
		defaults: {
			layout: {
				type: 'hbox',
				defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
			}
		},
		items: [{
			xtype: 'fieldcontainer',
			combineErrors: true,
			msgTarget : 'side',
			layout: 'hbox',
			defaults: {
			},
			items: [
				{
					xtype: 'button',
					text: 'Envoyer',
					handler: function() {
						var form = Ext.getCmp('formGenerateCommande').getForm();
						if (form.isValid()) {
							var formValues = form.getValues();
							var params = formValues.param.split(',');
							var trame = InOne.ownManager_createFrame(formValues.id+'|'+formValues.unit, formValues.action, formValues.mode, params, formValues.media);
							Ext.myMsg.msg('Information', 'Ok : Trame générée !<br />'+trame);
							sendCommand('trame', trame);
						}
					}
				},{
					xtype: 'button',
					text: 'Enregistrer',
					handler: function() {
						var form = Ext.getCmp('formGenerateCommande').getForm();
						if (form.isValid()) {
							var formValues = form.getValues();
							var params = formValues.param.split(',');
							var trame = InOne.ownManager_createFrame(formValues.id+'|'+formValues.unit, formValues.action, formValues.mode, params, formValues.media);
							Ext.myMsg.msg('Information', 'Ok : Trame enregistrée !<br />'+trame);
							var currentTrame = Ext.data.StoreManager.lookup('savedTrame');
							currentTrame.insert(0, {
								trame:trame, id_legrand:formValues.id, unit:formValues.unit, 
								action:formValues.action, param:formValues.param, media:formValues.media, mode:formValues.mode
							});
							currentTrame.sync();
						}
					}
				}]
		}]
	});

	var formResultTrame = Ext.create('Ext.grid.Panel', {
		title : 'Trames Enregistrées', 
		store: Ext.data.StoreManager.lookup('savedTrame'),
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        },
		height:200,
		disableSelection: false,
		columns: [
			{text: "Trame", dataIndex: 'trame', sortable: false, width: 250},
			{text: "id Legrand", dataIndex: 'id_legrand', sortable: false, width: 80},
			{text: "Unite", dataIndex: 'unit', sortable: false, width: 50},
			{text: "Action", dataIndex: 'action', sortable: false, width: 150},
			{text: "Param", dataIndex: 'param', sortable: false, width: 130},
			{text: "Media", dataIndex: 'media', sortable: false, width: 60},
			{text: "Mode", dataIndex: 'mode', sortable: false, width: 60},
			{
				xtype:'actioncolumn', tooltip:'Opération sur l\'équipement',
				text: 'Action', width: 70,
				items: [{
					icon: 'imgs/gears.png',
					tooltip: 'Lancer la commande',
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						sendCommand('trame', rec.get('trame'));
					}
				},{
					icon: 'imgs/delete.png',
					tooltip: 'Effacer la commande',
					handler: function(grid, rowIndex, colIndex) {
						var rec = grid.getStore().getAt(rowIndex);
						var currentTrame = Ext.data.StoreManager.lookup('savedTrame');
						currentTrame.remove(rec);
					}
				}]
			}
		],
		//Creation des boutons
		dockedItems: [{
			xtype: 'toolbar',
			items: [{
				id:'commandeToolbarBtnDeleteAll',
				icon: 'imgs/delete.png',
				text: 'Tout effacer',
				tooltip:'Effacer toutes les commandes Enregistrées !',
				disabled: false,
				handler: function(widget, event) {
					Ext.getCmp('formGenerateCommande').getForm().reset();
					var currentTrame = Ext.data.StoreManager.lookup('savedTrame');
					currentTrame.removeAll();
					currentTrame.getProxy().clear();
					currentTrame.sync();
				}
			}]
		}]

	});

	if (action == 'send') {
		var formSendCommande = Ext.create('Ext.form.Panel', {
			title:'Générateur de Commande',
			height:500,
			closable: true,
			autoScroll:true,
			defaults: {
				margin:10,
				padding: 10
			},
			items: [ formRef, formAction, formMedia, formDiffere],
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
						var params = formValues.param.split(',');
						var trame = InOne.ownManager_createFrame(formValues.id+'|'+formValues.unit, formValues.action, formValues.mode, params, formValues.media);
						trame = InOne.ownManager_starsharp_to_YZ(trame);
						var dateFormat=Ext.util.Format.date(Ext.Date.parse(formValues.date, "d/m/Y"), 'Y-m-d');
						dateFormat=dateFormat+' '+formValues.hours+':'+formValues.minutes+':'+formValues.secondes;
						sendCommand('trame', trame, dateFormat, 0);
					}
				}
			}]
		});

		//Affichage
		clearContent();
		var region = Ext.getCmp('Content');
		region.add(formSendCommande);
		formSendCommande.show();
	}
	
	if (action == 'generate') {
		var formGenerateCommande = Ext.create('Ext.Window', {
			id: 'winGenerateCommande',
			title:'Générateur de Commande',
			height:600,
			width:900,
			closable: true,
			closeAction: 'hide',
			autoScroll:true,
			defaults: {
				margin: 5,
				padding: 0
			},
			items: [{
				xtype: 'form',
				id: 'formGenerateCommande',
				items: [formRef, formAction, formMedia, formBtns, formResultTrame]
			}],
			textarea: {
				name: 'result',
				fieldLabel: 'Résultat',
				value: 'Trame'
			},
			buttons: [{
				text: 'Fermer',
				handler: function() {
					Ext.getCmp('winGenerateCommande').close();
				}
			}]
		});

		//Affichage
		formGenerateCommande.show();
	}
};