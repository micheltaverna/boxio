function triggers() {
	this.form = {
		ref: {
			xtype: 'fieldset',
			title: 'Références du triggers',
			collapsible: true,
			defaults: {
				width: 800
			},
			items: [{
				xtype: 'textfield',
				id:'triggersFormRefNom',
				name: 'nom',
				fieldLabel: 'Nom',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'radiogroup',
				fieldLabel: 'Activation',
				items: [{
					xtype: 'radiofield',
					name: 'active',
					inputValue: 'oui',
					checked: true,
					boxLabel: 'oui'
				},{
					xtype: 'radiofield',
					name: 'active',
					inputValue: 'non',
					boxLabel: 'non'
				}]
			}]
		},
		action: {
			xtype: 'fieldset',
			title: 'Paramètrage du Déclencheur',
			collapsible: true,
			defaults: {
				width: 800,
				columns: 4
			},
			items: [{
				xtype: 'textarea',
				name: 'triggers',
				fieldLabel: 'Déclencheurs',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'textarea',
				name: 'conditions',
				fieldLabel: 'Conditions',
				msgTarget: 'side',
				allowBlank: true
			},{
				xtype: 'textarea',
				name: 'actions',
				fieldLabel: 'Actions',
				msgTarget: 'side',
				allowBlank: false
			}]
		}
	};
	
	this.panel = {
		triggers: function() {
			var content = {
				id: 'panelTriggers',
				title : 'Liste des triggers enregistrés', 
				icon: 'imgs/target_32x32.png',
				emptyText: 'Aucun triggers trouvé',
				store: 'DataTriggers',
				disableSelection: false,
				loadMask: true,
				width: '100%',
				height: 500,
				autoScroll: true,
				closable: true,
				viewConfig: {
		            enableTextSelection: true
		        },
		        selModel: {
					listeners: {
				        selectionchange: function(sm, selections) {
				            if (selections.length) {
				                Ext.getCmp('triggersToolbarBtnDel').enable();
				                Ext.getCmp('triggersToolbarBtnMod').enable();
				            } else {
				                Ext.getCmp('triggersToolbarBtnDel').disable();
				                Ext.getCmp('triggersToolbarBtnMod').disable();
				            }
				        }
					}
				},
				features: [{
			        ftype: 'filters',
			        encode: true,
			        local: false,
					phpMode: true,
			        filters: [{
			            type: 'boolean',
			            dataIndex: 'visible'
			        }]
			    }],
				columns: [
					{text: 'Id', dataIndex: 'id', width: 131,
						filter: {
							type: 'string'
						}, hidden: true, tooltip: 'Identifiant du Déclencheur'
					},
					{text: 'Nom', dataIndex: 'nom', width: 131, filter: {
						type: 'string'
					}, tooltip: 'Nom du Déclencheur'}, 
					{text: 'Déclencheurs', dataIndex: 'triggers', width: 300, filter: {
						type: 'string'
					}, tooltip: 'Liste des Déclencheurs'},
					{text: 'Conditions', dataIndex: 'conditions', width: 300, filter: {
						type: 'string'
					}, tooltip: 'Liste des Conditions'},
					{text: 'Actions', dataIndex: 'actions', width: 300, filter: {
						type: 'string'
					}, tooltip: 'Actions sur le Déclencheur'},
					{text: 'Actif', dataIndex: 'active', width: 131, filter: {
						type: 'string'
					}, tooltip: 'Actions sur le Déclencheur'},
					{
					    xtype:'actioncolumn', tooltip:'Opération sur le Déclencheur',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            triggers.win.upd(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            triggers.func.del(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'triggersToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter un Déclencheur',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	triggers.win.add();
		                        }
		                    },{
		                    	id:'triggersToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer le Déclencheur',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelTriggers').getSelectionModel().getSelection()[0];
		                        	triggers.win.upd(rec);
		                        }
		                    },{
		                    	id:'triggersToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer le Déclencheur',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelTriggers').getSelectionModel().getSelection()[0];
		                        	triggers.func.del(rec);
		                        }
		                    },{
		                    	id:'triggersToolbarBtnHelp',
		                    	icon: 'imgs/information.png',
		                        text: 'Aide',
		                        tooltip:'Aide sur les Déclencheurs',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	triggers.win.help();
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataTriggers'),
					displayInfo: true,
					displayMsg: 'Liste des Déclecheurs {0} - {1} de {2}',
					emptyMsg: "Aucun Déclencheur"
				})
			};
			return new Ext.grid.Panel(content);
		}
	};
	
	this.win = {
		help: function() {
			var winTriggersHelp = Ext.getCmp('winTriggersHelp');
			if (!winTriggersHelp) {
				winTriggersHelp = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winTriggersHelp',
					icon: 'imgs/information.png',
				    closeAction: 'close',
				    width: 800,
				    height: 500,
				    title:'Aide sur les Déclencheurs',
				    items: [{
				    	xtype:'panel',
				    	id:'winTriggersHelpPanel'
				    }],
				    listeners: {
				        'render': function() {
			                Ext.Ajax.request({
			                    url: 'triggerHelp.php',
			                    success: function(response){
			                        Ext.getCmp('winTriggersHelpPanel').update(response.responseText);
			                    }
			                });                
			            }
				    },
				    buttons: [{
						text: 'Fermer',
						handler: function() {
							Ext.getCmp('winTriggersHelp').close();
						}
					}]
				});
			}
			winTriggersHelp.show();			
		},
		
		add: function() {
			var winTriggers = Ext.getCmp('winTriggers');
			if (!winTriggers) {
				winTriggers = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winTriggers',
					icon: 'imgs/target_32x32.png',
				    closeAction: 'close',
				    items: [{
				            xtype: 'form',
				            id: 'formAddTriggers',
						    items: [triggers.form.ref,triggers.form.action]
				    }],
				    buttons: [{
						text: 'Effacer',
						id: 'winTriggersBtnClear',
						handler: function() {
							Ext.getCmp('formAddTriggers').getForm().reset();
						}
					},{
						text: 'Annuler',
						handler: function() {
							Ext.getCmp('winTriggers').close();
						}
					},{
						text: 'Enregistrer',
						id: 'winTriggersBtnSave',
						handler: function() {
							triggers.func.validateAdd();
						}
					}]
				});
			}
			winTriggers.show();
			Ext.getCmp('formAddTriggers').getForm().reset();
			winTriggers.setTitle('Ajout d\'un Déclencheur');
	        Ext.getCmp('triggersFormRefNom').enable(true);
			Ext.getCmp('winTriggersBtnClear').show();
			Ext.getCmp('winTriggersBtnSave').setHandler(function() {
				triggers.func.validateAdd();
			});
		},
		
		upd: function(rec) {
			triggers.win.add();
			var winTriggers = Ext.getCmp('winTriggers');
			winTriggers.setTitle('Modification d\'un Déclencheur');
	        var form = Ext.getCmp('formAddTriggers').getForm();
	        Ext.getCmp('triggersFormRefNom').disable(true);
			Ext.getCmp('winTriggersBtnClear').hide();
			Ext.getCmp('winTriggersBtnSave').setHandler(function() {
				triggers.func.validateUpd();
			});
	        var active = rec.get('active')=='0'?'non':'oui';
	        form.setValues({
	        	nom:rec.get('nom'),
	        	triggers:rec.get('triggers'),
	        	conditions:rec.get('conditions'),
	        	actions:rec.get('actions'),
	        	active:active
	        });
		}
	};
	
	this.func = {
		validateAdd: function() {
			var form = Ext.getCmp('formAddTriggers').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var triggers = encode(formValues.triggers);
				var conditions = encode(formValues.conditions);
				var actions = encode(formValues.actions);
				var active = formValues.active=='oui'?'true':'false';
				var params = "'"+nom+"','"+triggers+"','"+conditions+"','"+actions+"',"+active;
				requestCall('add_trigger', params, {ok:'Déclencheur ajouté !', error:'impossible d\'ajouter le Déclencheur !'}, {
					onsuccess:function(response){
						Ext.getCmp('formAddTriggers').getForm().reset();
						Ext.getCmp('winTriggers').close();
						Ext.data.StoreManager.lookup('DataTriggers').reload();
	            	},
	            	onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Le Déclencheur "'+formValues.nom+'" na pas pu être ajouté ! Erreur de communication, réessayez plus tard.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
	            	}
	            });
			} else {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Les champs ne sont pas valides !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}

		},
		
		validateUpd: function() {
			var form = Ext.getCmp('formAddTriggers').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
		        Ext.getCmp('triggersFormRefNom').enable(true);
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var triggers = encode(formValues.triggers);
				var conditions = encode(formValues.conditions);
				var actions = encode(formValues.actions);
				var active = formValues.active=='oui'?'true':'false';
				var params = "'"+nom+"','"+triggers+"','"+conditions+"','"+actions+"',"+active;
				requestCall('add_trigger', params, {ok:'Déclencheur modifié !', error:'impossible de modifier le Déclencheur !'}, {
					onsuccess:function(response){
						Ext.getCmp('formAddTriggers').getForm().reset();
						Ext.getCmp('winTriggers').close();
						Ext.data.StoreManager.lookup('DataTriggers').reload();
	            	},
	            	onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Le Déclencheur "'+formValues.nom+'" na pas pu être modifié ! Erreur de communication, réessayez plus tard.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
	            	}
	            });
			} else {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Les champs ne sont pas valides !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		},
		
		del: function(rec) {
			if (rec) {
			    var id = rec.get('id');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer le Déclencheur <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_trigger', id, {ok:'Déclencheur éffacé !', error:'impossible d\'éffacer le Déclencheur !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataTriggers').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Le Déclencheur "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
			            	}
			            });
			    	}
			    });
			}
		},
	
		panelList: function() {
			if (Ext.getCmp('panelTriggers')) {
				Ext.data.StoreManager.lookup('DataTriggers').reload();
			} else {
				layout.func.clear();
				layout.func.add(triggers.panel.triggers());
				Ext.data.StoreManager.lookup('DataTriggers').reload();
			};
		}			
	};
};

var triggers = new triggers();
