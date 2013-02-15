function macros() {
	this.panel = {
			
		favoris: function() {
			var content = {
				id: 'winCommandPanelFavoris',
				title : 'Liste des favoris enregistrés', 
				store: Ext.data.StoreManager.lookup('DataFavoris'),
				disableSelection: false,
				loadMask: true,
				width: '100%',
				icon: 'imgs/heart_stroke_32x28.png',
				autoScroll: true,
				closable: false,
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
					{
						text: 'Nom', 
						dataIndex: 'nom', 
						width: 390,
						filter: {
							type: 'string'
						}
					},{
						text: 'Référence', dataIndex: 'id', width: 75, hidden: true,
						filter: {
							type: 'string'
						}
					},{
					    xtype:'actioncolumn',
						text: 'Séléction',
						align: 'right',
						width: 80,
					    items: [{
					        icon: 'imgs/accept.png',
					        tooltip: 'Séléctionner',
					        handler: function(grid, rowIndex, colIndex) {
					        	var rec = grid.getStore().getAt(rowIndex);
					        	var form = Ext.getCmp('formAddCommand').getForm();
			        			var values = form.getValues();
			        			if (values.trame != '') {
			        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit une Trame, voulez-vous la remplacer par ce Favoris ?', function(res) {
			        					if (res == 'yes') { 
			    				            form.setValues({favoris:rec.get('id'),trame:''});
			    				            Ext.getCmp('formCommandFavorisNom').update('<span style="font-style:italic;">'+rec.get('nom')+'</span>');
			    						}
			        				});
			        			} else {
						            form.setValues({favoris:rec.get('id'),trame:''});
						            Ext.getCmp('formCommandFavorisNom').update('<span style="font-style:italic;">'+rec.get('nom')+'</span>');
			        			}
					        }
					    }]
					},{
						text: 'trame', 
						dataIndex: 'trame', 
						width: 200,
						hidden: true
					}
				],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataFavoris'),
					displayInfo: true,
					displayMsg: 'Liste des favoris {0} - {1} de {2}',
					emptyMsg: "Aucun favoris"
				})
			};
			return new Ext.grid.Panel(content);
		},

		macros: function() {
			var content = {
					title : 'Liste des macros enregistrées', 
					id: 'panelMacros',
					store: Ext.data.StoreManager.lookup('DataMacros'),
					disableSelection: false,
					loadMask: true,
					width: '100%',
					height: 500,
					icon: 'imgs/list_32x28.png',
					autoScroll: true,
					closable: true,
					features: [{
				        ftype: 'filters',
				        encode: true,
				        local: false,
						phpMode: true
				    },{
				        ftype: 'groupingsummary',
				        groupHeaderTpl: [
				        	'{columnName}: {name} ({rows.length} commande{[values.rows.length > 1 ? "s" : ""]})'+
			        	    '<span> - <a href="#" class="buttonTpl" onclick="{rows:this.formatClickEdit}"><span class="edit">Editer</span></a></span>\
				        	&nbsp;&nbsp;<a href="#" class="buttonTpl" onclick="{rows:this.formatClickDelete}"><span class="delete">Effacer</span></a></span>',
			        	    {
				        		formatClickEdit: function (rows) {
				        			var id_macro = rows[0].data.id_macro;
				        			var nom = rows[0].data.nom;
				        			return "\
				        			macros.win.upd('"+id_macro+"','"+nom+"');\
				        			";
				        		},
				        		formatClickDelete: function (rows) {
				        			var id_macro = rows[0].data.id_macro;
				        			return "\
				        			macros.func.delMacro('"+id_macro+"');\
				        			";
				        			return;
				        		}
				        	}
			        	],
				        hideGroupedHeader: false,
				        startCollapsed: false,
				        enableGroupingMenu: false
				    }],
					columns: [
						{text: 'Id de la Commande', dataIndex: 'id_command', width: 131, hidden: true, filter: {type: 'string'}},
						{text: 'Id de la Macro', dataIndex: 'id_macro', width: 131, hidden: true, filter: {type: 'string'}}, 
						{text: 'Nom de la Macro', dataIndex: 'nom', width: 131, hidden: true, filter: {type: 'string'}},
						{text: 'Id du Favoris', dataIndex: 'id_favoris', hidden: true, width: 131, filter: {type: 'string'}}, 
						{text: 'Nom de la Commande', dataIndex: 'nom_command', width: 300, filter: {type: 'string'}},
						{text: 'Trame executée', dataIndex: 'trame', width: 131, hidden: true, filter: {type: 'string'}}, 
						{text: 'Temporisation', dataIndex: 'timing', width: 300, filter: {type: 'numeric'}, renderer: function(val) {
							if (val == 0) {
								return '<span style="font-style:italic;">Immédiat</span>';
							} else if (val == 1) {
								return '<span style="font-style:italic;">'+val+'<sup>ère</sup> seconde</span>';
							} else {
								return '<span style="font-style:italic;">'+val+'<sup>ème</sup> secondes</span>';
							}
						}}
					],
					dockedItems: [{
			            xtype: 'toolbar',
			            items: [{
			                    	id:'macrosToolbarBtnAddMacro',
			                    	icon: 'imgs/add.png',
			                        text: 'Ajouter une macro',
			                        tooltip:'Ajouter une macro',
			                        disabled: false,
			                        handler: function(widget, event) {
			                        	macros.win.add();
			                        }
		                    }]
			        }],
					bbar: Ext.create('Ext.PagingToolbar', {
						store: Ext.data.StoreManager.lookup('DataMacros'),
						displayInfo: true,
						displayMsg: 'Liste des macros {0} - {1} of {2}',
						emptyMsg: "Aucune macros"
					})
			};
			
			return new Ext.grid.Panel(content);
		},
	
		commands: function() {
			var content = {
				title : 'Liste des commandes enregistrées', 
				store: Ext.data.StoreManager.lookup('DataMacrosCommands'),
				id: 'panelCommand',
				disableSelection: false,
				loadMask: true,
				width: '100%',
				icon: 'imgs/bolt_32x32.png',
				autoScroll: true,
				closable: false,
				features: [{
			        ftype: 'filters',
			        encode: true,
			        local: false,
					phpMode: true
			    }],
				columns: [
					{text: 'Id de la Commande', dataIndex: 'id_command', width: 131, hidden: true, filter: {type: 'string'}},
					{text: 'Id de la Macro', dataIndex: 'id_macro', width: 131, hidden: true, filter: {type: 'string'}}, 
					{text: 'Nom de la Macro', dataIndex: 'nom', width: 350, hidden: true, filter: {type: 'string'}},
					{text: 'Id du Favoris', dataIndex: 'id_favoris', hidden: true, width: 131, filter: {type: 'string'}}, 
					{text: 'Nom de la Commande', dataIndex: 'nom_command', width: 200, filter: {type: 'string'}},
					{text: 'Trame executée', dataIndex: 'trame', width: 131, hidden: true, filter: {type: 'string'}}, 
					{text: 'Temporisation', dataIndex: 'timing', width: 200, filter: {type: 'numeric'}, renderer: function(val) {
						if (val == 0) {
							return '<span style="font-style:italic;">Immédiat</span>';
						} else if (val == 1) {
							return '<span style="font-style:italic;">'+val+'<sup>ère</sup> seconde</span>';
						} else {
							return '<span style="font-style:italic;">'+val+'<sup>ème</sup> secondes</span>';
						}
					}},
					{
					    xtype:'actioncolumn', tooltip:'Opération sur la commande',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            macros.win.updCommand(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            macros.func.delCommand(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'commandsToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter une commande',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	macros.win.addCommand();
		                        }
		                    },{
		                    	id:'commandsToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer la commande',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelCommand').getSelectionModel().getSelection()[0];
		                        	macros.func.delMacro(rec);
		                        }
		                    },{
		                    	id:'commandsToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer la commande',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelCommand').getSelectionModel().getSelection()[0];
		                        	macros.func.delCommand(rec);
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataMacrosCommands'),
					displayInfo: true,
					displayMsg: 'Liste des commandes {0} - {1} de {2}',
					emptyMsg: "Aucune commandes"
				})					
			};
			return new Ext.grid.Panel(content);			
		}
	};
	
	this.win = {
			add: function() {
				var winMacro = Ext.getCmp('winMacro');
				if (!winMacro) {
					winMacro = Ext.create('Ext.window.Window', {
						xtype: 'form',
						id: 'winMacro',
						icon: 'imgs/clock_alt_fill_32x32.png',
					    items: [{
					            xtype: 'form',
					            id: 'formAddMacro',
							    items: [macros.form.ref, macros.form.command()]
					    }],
					    buttons: [{
							text: 'Effacer',
							id: 'winMacroBtnClear',
							handler: function() {
								Ext.getCmp('formAddMacro').getForm().reset();
							}
						},{
							text: 'Fermer',
							id: 'winMacroBtnClose',
							handler: function() {
								Ext.getCmp('winMacro').close();
							}
						}]
					});
				}
				winMacro.show();
				Ext.getCmp('formAddMacro').getForm().reset();
				winMacro.setTitle('Ajout d\'une macro');
				Ext.getCmp('winMacroBtnClear').show();
				Ext.getCmp('formRefNomMacro').enable(true);
				Ext.getCmp('formRefBtnAddMacro').show();
				Ext.getCmp('formPanelCommandMacro').hide();
		        var store = Ext.data.StoreManager.lookup('DataMacrosCommands');
				store.clearFilter(true);
				store.load();
				store.filter([{ property: "id_macro", value: '0' }]);
			},

			upd: function(id_macro, nom) {
				macros.win.add();
				var winMacro = Ext.getCmp('winMacro');
				winMacro.setTitle('Modification d\'une macro');
		        var form = Ext.getCmp('formAddMacro').getForm();
		        Ext.getCmp('formRefNomMacro').disable(true);
				Ext.getCmp('winMacroBtnClear').hide();
				Ext.getCmp('formRefBtnAddMacro').hide();
				Ext.getCmp('formPanelCommandMacro').show();
		        form.setValues({nom:nom});
		        var store = Ext.data.StoreManager.lookup('DataMacrosCommands');
				store.clearFilter(true);
				store.load();
				store.filter([{ property: "id_macro", value: id_macro }]);
			},
			
			addCommand: function() {
				var winCommand = Ext.getCmp('winCommand');
				if (!winCommand) {
					winCommand = Ext.create('Ext.window.Window', {
						xtype: 'form',
						id: 'winCommand',
						icon: 'imgs/bolt_32x32.png',
					    items: [{
					            xtype: 'form',
					            id: 'formAddCommand',
							    items: [macros.form.refCommand, macros.form.actionCommand()]
					    }],
					    buttons: [{
							text: 'Effacer',
							id: 'winCommandBtnClear',
							handler: function() {
    				            Ext.getCmp('formCommandFavorisNom').update('&nbsp;');
								Ext.getCmp('formAddCommand').getForm().reset();
							}
						},{
							text: 'Annuler',
							handler: function() {
								Ext.getCmp('winCommand').close();
							}
						},{
							text: 'Enregistrer',
							id: 'winCommandBtnSave',
							handler: function() {
								macros.func.addCommand();
							}
						}]
					});
				}
				winCommand.show();
				Ext.getCmp('formAddCommand').getForm().reset();
				winCommand.setTitle('Ajout d\'une commande');
				Ext.getCmp('winCommandBtnClear').show();
				store: Ext.data.StoreManager.lookup('DataFavoris').reload();
		        Ext.getCmp('formRefNomCommand').enable(true);
			}
	};
	
	this.form = {
		ref: {
			xtype: 'fieldset',
			title: 'Référence de la Macro',
			collapsible: true,
			defaults: {
				width: 500,
				layout: {
					type: 'hbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				}
			},
			items: [{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					id: 'formRefNomMacro',
					flex: 4,
					name: 'nom',
					fieldLabel: 'Nom',
					msgTarget: 'side',
					allowBlank: false
				},{
					xtype: 'textfield',
					id: 'formRefIdMacro',
					hidden: false,
					name: 'id_macro',
					allowBlank: true
				},{
					xtype: 'button',
					id: 'formRefBtnAddMacro',
					flex: 1,
					text: 'Générer',
			        icon: 'imgs/add.png',
			        iconAlign: 'left',
					tooltip: 'Créer la Macro',
					handler: function() {
						macros.func.addMacro();
				    }
				}]
			}]
		},

		refCommand: {
			xtype: 'fieldset',
			title: 'Référence de la commande',
			collapsible: true,
			defaults: {
				width: 500,
				columns: 4
			},
			items: [{
				xtype: 'textfield',
				id: 'formRefNomCommand',
				name: 'nom',
				fieldLabel: 'Nom',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'numberfield',
				id: 'formRefTimingCommand',
				name: 'timing',
				fieldLabel: 'Timing',
				msgTarget: 'side',
				allowBlank: false
			}]
		},

		actionCommand: function() {
			var content = {
				title: 'Action de la commande',
				collapsible: true,
				items: [{
					xtype: 'tabpanel',
					plain:true,
					width:500,
			        items: [{
						title: 'Favoris',
						id: 'formAddCommandTabFavoris',
						items: [{
							xtype: 'fieldset',
							padding: 0,
							margin: 0,
							border: 0,
							defaults: {
								layout: 'hbox',
								padding: 0,
								margin: 0
							},
							items: [
							{
								xtype: 'fieldcontainer',
								margin: 5,
								items: [{
									xtype: 'textfield',
									flex: 2,
									fieldLabel: 'Référence du Favoris',
									msgTarget: 'side',
									labelWidth : 120,
									name: 'favoris',
									allowBlank: true,
								},{
									xtype: 'box',
									id: 'formCommandFavorisNom',
									flex: 2,
									border: 0,
									margin: 2,
									html: ''
								},{
									xtype: 'button',
									margin: '0 0 0 5',
									flex: 1,
							        icon: 'imgs/delete.png',
							        iconAlign: 'left',
									text: 'Effacer',
									tooltip: 'Efface la selection du favoris en cours',
									handler: function() {
										Ext.getCmp('formAddCommand').getForm().setValues({favoris:null});
										Ext.getCmp('formCommandFavorisNom').update('&nbsp;');
									}
								}]
							},{
								xtype: 'fieldcontainer',
								items: [
								        macros.panel.favoris()
								        ]
							}
							]
						}
						]
					},{
						title: 'Trame',
						id: 'formAddCommandTabTrame',
						items: [{
							xtype: 'textfield',
							width: 450,
							labelWidth: 50,
				            padding: 10,
							name: 'trame',
							fieldLabel: 'Trame',
							msgTarget: 'side',
							allowBlank: true,
							listeners: {
								change: {
						            fn: function(elem, new_value, old_vlaue, opts) { 
							        	var form = Ext.getCmp('formAddCommand').getForm();
					        			var values = form.getValues();
					        			if (new_value == '') {
					        				return;
					        			}
					        			if (values.favoris != '') {
					        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit un Favoris, voulez-vous le remplacer par une Trame ?', function(res) {
					        					if (res == 'yes') { 
					    				            form.setValues({favoris:''});
					    				            Ext.getCmp('formCommandFavorisNom').update('&nbsp;');
					        					} else {
					        						form.setValues({trame:''});
					    						}
					        				});
					        			}
						            }
						        }
							}
						}]
					}]
				}]
			};
			return new Ext.form.FieldSet(content);
		},

		command: function() {
			var content = {
				title: 'Commandes de la Macro',
				id: 'formPanelCommandMacro',
				collapsible: true,
				items: [macros.panel.commands()]
			};
			return new Ext.form.FieldSet(content);
		}
	};

	this.func = {
		addMacro: function() {
			var form = Ext.getCmp('formAddMacro').getForm();
			if (form.isValid()) {
				Ext.getCmp('formRefBtnAddMacro').hide();
				Ext.getCmp('formPanelCommandMacro').show();
				Ext.getCmp('winMacroBtnClear').hide();
		        Ext.getCmp('formRefNomMacro').disable(true);
		        
			} else {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Les champs ne sont pas valides !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});				
			}
		},
		
		delMacro: function(rec) {
			if (rec) {
			    var id_macro = rec.get('id_macro');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer la macro <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_macro', id_macro+", 'NULL'", {ok:'macro éffacé !', error:'impossible d\'éffacer la macro !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataMacros').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'La macro "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
			            	}
			            });
			    	}
			    });
			}
		},
		
		delCommand: function(rec) {
			if (rec) {
			    var id_macro = rec.get('id_macro');
			    var id_command = rec.get('id_command');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer la macro <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_macro', id_macro+', '+id_command, {ok:'commande éffacé !', error:'impossible d\'éffacer la commande !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataMacros').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'La commande "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
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
			if (Ext.getCmp('panelMacros')) {
				Ext.data.StoreManager.lookup('DataMacros').reload();
			} else {
				layout.func.clear();
				layout.func.add(macros.panel.macros());
				Ext.data.StoreManager.lookup('DataMacros').reload();
			};
		}
	};
};

var macros = new macros();

