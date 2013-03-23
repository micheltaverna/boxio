function equipements() {
	this.form = {
			
	};

	this.panel = {
		equipements: function() {
			var content = {
				id:'panelEquipements',
				title : 'Liste des équipements référencés dans le serveur', 
				icon: 'imgs/share_32x32.png',
				store: Ext.data.StoreManager.lookup('DataEquipements'),
				disableSelection: false,
				loadMask: true,
				minWidth: 500,
				width: '100%',
				height: 500,
				emptyText: 'Aucun équipement trouvé',
				autoScroll: true,
				closable: true,
				selModel: {
					listeners: {
				        selectionchange: function(sm, selections) {
				            if (selections.length) {
				                Ext.getCmp('equipementsToolbarBtnDel').enable();
				                Ext.getCmp('equipementsToolbarBtnMod').enable();
				                Ext.getCmp('equipementsToolbarBtnScn').enable();
				            } else {
				                Ext.getCmp('equipementsToolbarBtnDel').disable();
				                Ext.getCmp('equipementsToolbarBtnMod').disable();
				                Ext.getCmp('equipementsToolbarBtnScn').disable();
				            }
				        }
					}
				},
				features: [{
				        ftype: 'filters',
				        encode: true,
				        local: false,
						phpMode: true
				    },{
				        ftype: 'groupingsummary',
				        groupHeaderTpl: '{columnName}: {name} ({rows.length} équipement{[values.rows.length > 1 ? "s" : ""]})',
				        hideGroupedHeader: false,
				        enableGroupingMenu: true
			    }],
				columns: [
					{text: 'Nom', dataIndex: 'nom', width: 131, filter: {type: 'string'}, tooltip:'Nom de l\'équipement'},
					{text: 'Zone', dataIndex: 'zone', width: 131, filter: {type: 'list', store:Ext.data.StoreManager.lookup('DataZones')}, tooltip:'Zone de l\'équipement'}, 
					{text: 'Référence Legrand', dataIndex: 'ref_legrand', width: 131, filter: {type: 'list', store:Ext.data.StoreManager.lookup('DataReferences')}, tooltip:'Référence Legrand'},
					{text: 'Id Legrand', dataIndex: 'id_legrand', width: 131, filter: {type: 'string'}, tooltip:'Id de l\'équipement'}, 
					{
					    xtype:'actioncolumn', tooltip:'Opération sur l\'équipement',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            equipements.func.upd(rec);
					        }
					    },{
					        icon: 'imgs/cog.png',
					        tooltip: 'Vérifier les Scénarios',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            equipements.func.updScenar(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            equipements.func.del(rec);
					        }
					    }]
					}
				],
				//Creation des boutons
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'equipementsToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter un équipement',
		                        disabled: false,
		                        handler: function(widget, event) {
		                			equipements.win.add();
		                        }
		                    },{
		                    	id:'equipementsToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer l\'équipement',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
		                        	equipements.func.upd(rec);
		                        }
		                    },{
		                    	id:'equipementsToolbarBtnScn',
		                    	icon: 'imgs/cog.png',
		                        text: 'Scénarios',
		                        tooltip:'Vérifier les Scénarios enregistrés',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
		                        	equipements.func.updScenar(rec);
		                        }
		                    },{
		                    	id:'equipementsToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer l\'équipement',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
		                        	equipements.func.del(rec);
		                        }
		                    }]
		        }],
		        // Creation de la bar de defilement des pages
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataEquipements'),
					displayInfo: true,
					displayMsg: 'Liste des équipements {0} - {1} de {2}',
					emptyMsg: "Aucun équipement"
				})
			};
			return new Ext.grid.Panel(content);
		}
	
	};

	this.win = {		
		add: function() {
			var winAddEquipement = Ext.getCmp('winAddEquipement');
			if (!winAddEquipement) {
				winAddEquipement = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winAddEquipement',
				    title: 'Ajout/Modification d\'un équipement',
					icon: 'imgs/plus_alt_32x32.png',
				    closeAction: 'close',
				    items: [{
				            xtype: 'form',
				            id: 'formAddEquipement',
						    items: [{
						    	xtype: 'fieldset',
								title: 'Référence',
								id:'formRefaddEquipement',
								collapsible: true,
								defaults: {
									width: 600,
									layout: {
										type: 'hbox',
										defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
									}
								},
								items: [{
									xtype: 'fieldcontainer',
									items: [{
										xtype: 'textfield',
										flex:4,
										fieldLabel:'Id Legrand',
										name:'id_legrand',
										msgTarget: 'side',
										vtype:'listInteger',
										allowBlank: false
									},{
										xtype: 'button',
										flex: 1,
										text: 'Rechercher',
								        tooltip: 'Recherche les équipements inconnus du serveur',
								        icon: 'imgs/find.png',
								        iconAlign: 'left',
										handler: function() {
											equipements.win.findEquipements();
								        	Ext.getCmp('winfindEquipements').show();
									    }
									}]
								},{
									xtype: 'fieldcontainer',
									items: [{
										xtype: 'combobox',
										flex:4,
										fieldLabel:'Référence',
										name:'reference',
										valueField: 'id',
										displayField: 'list',
										store: Ext.data.StoreManager.lookup('DataReferences'),
										msgTarget: 'side',
										vtype:'listInteger',
										allowBlank: false
									},{
										xtype: 'button',
										flex: 1,
										text: 'Analyser',
								        icon: 'imgs/cog.png',
								        tooltip: 'Rechercher la référence en fonction de l\'Id Legrand',
								        iconAlign: 'left',
										handler: function() {
								            var form = Ext.getCmp('formAddEquipement').getForm();
								            var formValues = form.getValues();
								            if (formValues.id_legrand) {
								            	equipements.win.findReference();
									        	Ext.getCmp('winfindReference').show();
								            } else {
								            	Ext.MessageBox.show({
								    				title: 'Erreur',
								    				msg: 'Vous devez entrer un Id Legrand pour lancer une recherche !',
								    				buttons: Ext.MessageBox.OK,
								    				icon: Ext.MessageBox.ERROR
								    			});
								            }
									    }
									}]
								}]
							}, {
						    	xtype: 'fieldset',
								title: 'Nommage',
								collapsible: true,
								defaults: {
									width: 500
								},
								items: [{
									xtype: 'textfield',
									fieldLabel:'Nom',
									name:'nom',
									valueField: 'nom',
									msgTarget: 'side',
									allowBlank: false
								},{
									xtype: 'combobox',
									fieldLabel:'Zone',
									name:'zone',
									displayField: 'text',
									store: Ext.data.StoreManager.lookup('DataZones'),
									msgTarget: 'side',
									allowBlank: false
								}]
							}]
				    }],	
				    buttons: [{
				    	id:'winAddEquipementBtnClear',
						text: 'Effacer',
				        tooltip: 'Effacer tous les champs',
						handler: function() {
							Ext.getCmp('formAddEquipement').getForm().reset();
						}
					},{
						text: 'Annuler',
				        tooltip: 'Annuler l\'ajout et fermer la fenêtre',
						handler: function() {
							Ext.getCmp('winAddEquipement').close();
						}
					},{
						text: 'Enregistrer',
				    	id:'winAddEquipementBtnSave',
				        tooltip: 'Enregistrer l\'équipement',
						handler: function() {
							equipements.func.validateAdd();
						}
					}]
				});
			}
			winAddEquipement.show();
			Ext.getCmp('formAddEquipement').getForm().reset();
			winAddEquipement.setTitle('Ajout d\'un équipement');
			Ext.getCmp('winAddEquipementBtnClear').show();
			Ext.getCmp('formRefaddEquipement').enable();
			Ext.getCmp('winAddEquipementBtnSave').setHandler(function() {
				equipements.func.validateAdd();
			});
		},
	
		findReference: function() {
			var winfindReference = Ext.getCmp('winfindReference');
			if (!winfindReference) {
				winfindReference = Ext.create('Ext.window.Window', {
					id: 'winfindReference',
				    title: 'Recherche de référence',
					icon: 'imgs/cog.png',
				    closeAction: 'close',
					listeners: {
						show: {
							fn: function() {
					            var form = Ext.getCmp('formAddEquipement').getForm();
					            var formValues = form.getValues();

								Ext.get(Ext.query('.findReference_id')).update(formValues.id_legrand);
								Ext.get(Ext.query('.findReference_ref')).update('');
								Ext.get(Ext.query('.findReference_nom')).update('');
								Ext.get(Ext.query('.findReference_valid')).update('');

								var params = "'"+Ext.String.htmlEncode(formValues.id_legrand)+"'";
								var waiting = new Ext.LoadMask(winfindReference, {msg:"Recherche en cours..."});
								waiting.show();
								requestCall('find_reference', params, {ok:'recheche effectué !', error:'impossible d\'éxecuter la recherche !'}, {
									onsuccess:function(response) {
											waiting.hide();
											var memstore = new Ext.data.Store({
											    autoLoad: true,
											    model: 'findReference',
											    data : response.responseXML,
											    proxy: {
											        type: 'memory',
											        reader: {
														type: 'xml',
														record: 'module',
														root: 'content'
											        }
											    }
											});
											var arrayResult = memstore.getRange(0);
											Ext.get(Ext.query('.findReference_ref')).update(arrayResult[0].data.reference);
											var elem = Ext.get(Ext.query('.findReference_valid'));
											if (arrayResult[0].data.reference_geree == 'TRUE') {
												elem.update('OUI');
												Ext.get(Ext.query('.findReference_nom')).update(' - '+arrayResult[0].data.reference_nom+' ('+arrayResult[0].data.reference_family+')');
											} else {
												elem.update('NON (impossible d\'ajouter cette référence, merci de poster une demande d\'ajout <a href="http://code.google.com/p/boxio/wiki/Ajout_Reference" target="_blank">ici</a>)');
											}
											waiting.hide();
										},
						            	onfailure:function(response){
											Ext.MessageBox.show({
												title: 'Erreur',
												msg: 'L\'équipement "'+formValues.nom+'" na pas pu être trouvé ! Erreur de communication, réessayez plus tard.',
												buttons: Ext.MessageBox.OK,
												icon: Ext.MessageBox.ERROR
											});
											waiting.hide();
						            	}
								});
							}
						}
			
					},
				    items: [{
				        html : "<div class='findReference'>" +
				        		"<div class='findReference_information'><img src='imgs/error.png'><span>Si votre référence est un produit Radio ou Infrarouge, la recherche sera infructueuse ! (pas de retour d'information sur ces produits)</span>" +
				        		"<br /><img src='imgs/information.png'><span>La recherche dure environ 5 secondes. si vous rencontrez des perturbations CPL, relancer la recherche.</span>" +
				        		"</div><br /><div class='findReference_content'>" +
				        		"<span>Id Legrand recherché : <span class='findReference_id'></span></span><br/><br/>" +
				        		"<span>Référence trouvé : <span class='findReference_ref'></span><span class='findReference_nom'></span></span><br/><br/>" +
				        		"<span>Référence gérée par le serveur : <span class='findReference_valid'></span></span><br/><br/>" +
				        		"</div></div>"
				    }],
				    buttons: [{
				        text: 'Annuler',
				        handler: function() {
				        	Ext.getCmp('winfindReference').close();
				        }
				    },{
				        text: 'Valider',
				        handler: function() {
				        	var validRef = Ext.get(Ext.query('.findReference_valid'));
				        	if (validRef.elements[0].innerHTML == 'OUI') {
					        	var findRef = Ext.get(Ext.query('.findReference_ref'));
					            var form = Ext.getCmp('formAddEquipement').getForm();
					            form.setValues({reference:findRef.elements[0].innerHTML});
				        	}
				            Ext.getCmp('winfindReference').close();
				        }
				    }]
				});
			} 
		},
		
		findEquipements: function() {
			var winfindEquipements = Ext.getCmp('winfindEquipements');
			if (!winfindEquipements) {
				winfindEquipements = Ext.create('Ext.window.Window', {
					id: 'winfindEquipements',
				    title: 'Listes des équipements non enregistrés',
					icon: 'imgs/find.png',
				    closeAction: 'close',
				    width: 500,
					listeners: {
						show: {
							fn: function() {
								Ext.data.StoreManager.lookup('DataUnknownEquipements').reload();
							}
						}
					},
				    items: [{
				    	xtype:'gridpanel',
						id: 'formfindEquipements',
				    	title : 'Sélectionner un equipement trouvé durant les dernières 24 heures', 
						height:400,
						store: Ext.data.StoreManager.lookup('DataUnknownEquipements'),
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true
				        },
						disableSelection: false,
						columns: [
							{text: "Id Legrand", dataIndex: 'id_legrand', sortable: true, tooltip: 'Id Legrand de l\'équipement trouvé', width: 95},
							{text: "Media", dataIndex: 'media', sortable: true, tooltip: 'Média de communication', width: 84},
							{text: "Date", dataIndex: 'Date', sortable: true, tooltip: 'Date de la derniére opération de l\'équipement', width: 150},
							{
							    xtype:'actioncolumn',
							    tooltip: 'Opération sur l\'équipement',
								text: 'Séléction',
								align: 'right',
								width: 80,
							    items: [{
							        icon: 'imgs/accept.png',
							        tooltip: 'Séléctionner cet Id Legrand',
							        handler: function(grid, rowIndex, colIndex) {
							            var rec = grid.getStore().getAt(rowIndex);
							            equipements.func.selUnknown(rec);
							        }
							    }]
							}
						],
						dockedItems: [{
				            xtype: 'toolbar',
				            items: [{
		                    	id:'findEequipementToolbarBtnRefresh',
		                    	icon: 'imgs/table_refresh.png',
		                    	tooltip: 'Relancer la recherhe de nouveaux équipements',
		                        text: 'Rechercher à nouveau',
		                        disabled: false,
		                        handler: function(widget, event) {
		        					Ext.data.StoreManager.lookup('DataUnknownEquipements').reload();
		                        }
				            }]
				        }]
				    }],
				    buttons: [{
				        text: 'Annuler',
				        tooltip: 'Annuler la recherche et fermer la fenêtre',
				        handler: function() {
				        	Ext.getCmp('winfindEquipements').close();
				        }
				    },{
				        text: 'Valider la selection',
				        tooltip: 'Valider la sélection',
				        handler: function() {
				        	var rec = Ext.getCmp('formfindEquipements').getSelectionModel().getSelection()[0];
				        	equipements.func.selUnknown(rec);
				        }
				    }]
				});
			}
		},
		
		equipementScenars: function() {
			var winEquipementScenars = Ext.getCmp('winEquipementScenars');
			if (!winEquipementScenars) {
				winEquipementScenars = Ext.create('Ext.window.Window', {
					id: 'winEquipementScenars',
				    title: 'Listes des scenarios de l\'équipements (dans le serveur / dans le module)',
					icon: 'imgs/cog.png',
				    closeAction: 'close',
				    width: 900,
				    items: [{
			        	xtype:'gridpanel',
						id: 'gridScenario',
						store: Ext.data.StoreManager.lookup('DataCheckScenarios'),
				    	title : 'Scénarios enregistrés dans la base de donnée ET/OU la mémoire du module', 
				    	height: 500,
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true
				        },
						disableSelection: false,
					    columns: [
							{text: "Id Legrand", dataIndex: 'id_legrand', tooltip:'Id Legrand de l\'équipement programmé', width: 110, renderer: function(val, style, record) {
								if (record.get('nom') && record.get('zone')) {
									return val+' <span style="font-style:italic;">('+record.get('nom')+' - '+record.get('zone')+')</span>';
								}
								return val;
							}},
							{text: "Unite", dataIndex: 'unit', tooltip:'Unité de l\'équipement programmé', width: 80},
							{text: "Id Legrand d'écoute", dataIndex: 'id_legrand_listen', tooltip:'Id Legrand d\'écoute', width: 120},
							{text: "Unité d'écoute", dataIndex: 'unit_listen', tooltip:'Unité d\'écoute', width: 100},
							{text: "Média d'écoute", dataIndex: 'media_listen', tooltip:'Média d\'écoute', width: 85, renderer: function(val) {
								return defineMedia[val]+' <span style="font-style:italic;">('+val+')</span>';
							}},
							{text: "Fonction", dataIndex: 'value_listen', tooltip:'Type d\'action programmé', width: 100, renderer: function(val, style, record) {
								var ret = 'UNKNOWN';
								var family = record.get('family');
								if (family == 'LIGHTING') {
									if (val == '101') {
										ret = 'ON';
									} else if (val == '102') {
										ret = 'OFF';
									} else {
										ret = 'DIM '+val+'%';
									}
								} else if (family == 'SHUTTER') {
									if (val == '102') {
										ret = 'MOVE_UP';
									} else if (val == '103') {
										ret = 'MOVE_DOWN';
									} else if (val == '101') {
										ret = 'STOP';
									}
								} else if (family == 'CONFORT') {
									if (val == '6') {
										ret = 'PRESENCE';
									} else if (val == '7') {
										ret = 'ECO';
									} else if (val == '8') {
										ret = 'HORS_GEL';
									} else if (val == '5') {
										ret = 'AUTOMATIQUE';
									} else if (val == '0') {
										ret = 'SONDE';
									}
								}
								return ret+' <span style="font-style:italic;">('+val+')</span>';
							}},
							{text: "En mémoire", dataIndex: 'in_memory', width: 100, 
								tooltip:'Etat de la programmation en Base de donnée', renderer: function(val) {
								if (val == 'true') {
									return '<span style="color:green;">OK</span>';
								} else if (val == 'update') {
									return '<span style="color:orange;">PROGRAMME</span>';
								} else {
									return '<span style="color:red;">ERREUR</span>';
								}
							}},
							{text: "En base de donnée", dataIndex: 'in_db', width: 100, 
			                    tooltip:'Etat de la programmation en mémoire', renderer: function(val) {
								if (val == 'true') {
									return '<span style="color:green;">OK</span>';
								} else if (val == 'update') {
									return '<span style="color:orange;">PROGRAMME</span>';
								} else {
									return '<span style="color:red;">ERREUR</span>';
								}
							}},
							{
							    xtype:'actioncolumn',
								text: 'Action',
			                    tooltip:'Opérations sur l\'équipement',
								align: 'right',
								width: 70,
							    items: [{
							        icon: 'imgs/cog.png',
							        tooltip: 'Programmer',
				                    tooltip:'Lancer la programmation de l\'équipement',
							        handler: function(grid, rowIndex, colIndex) {
							        	var rec = grid.getStore().getAt(rowIndex);
							        	equipements.func.progScenario(rec);
							        }
							    }]
							}
						]
			        }],
					//Creation des boutons
					dockedItems: [{
			            xtype: 'toolbar',
			            items: [{
		                	icon: 'imgs/table_refresh.png',
		                    text: 'Actualiser',
		                    tooltip:'Relancer la recherche des Scénarios',
		                    disabled: false,
		                    handler: function(widget, event) {
		                    	var ScenarStore = Ext.data.StoreManager.lookup('DataCheckScenarios');
		            		    ScenarStore.load();
		            		}
			            }]
					}],
			        buttons: [{
				        text: 'Fermer',
		                tooltip:'Fermer la fenêtre',
				        handler: function() {
				        	Ext.getCmp('winEquipementScenars').close();
				        }
				    }]
				});
			}
			winEquipementScenars.show();
		}
	};
	
	this.func = {
		validateAdd: function() {
			var form = Ext.getCmp('formAddEquipement').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
				var formValues = form.getValues();
				
				//Gestion de l'ID LEGRAND
				var dataRef = Ext.getStore('DataEquipements').getRange();
				var ret = true;
				for (var ref in dataRef) {
					if (dataRef[ref].data.id_legrand == formValues.id_legrand) {
						ret = false;
						break;
					}
				}
				if (ret == false) {
		        	Ext.MessageBox.show({
						title: 'Erreur',
						msg: 'L\'ID Legrand '+formValues.id_legrand+' est déjà inscrit dans la base donnée !<br /><br /><em>Utiliser la modification plutôt que l\'ajout</em>',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
		        	return;
				}
		
				//Gestion de la Référence
				var dataRef = Ext.getStore('DataReferences').getRange();
				var ret = false;
				for (var ref in dataRef) {
					if (dataRef[ref].data.ref_legrand == formValues.reference) {
						ret = true;
						break;
					}
				}
				if (ret == false) {
		        	Ext.MessageBox.show({
						title: 'Erreur',
						msg: 'La référence '+formValues.reference+' n\'est pas encore référencée !<br /><br /><em>Merci de poster une demande d\'ajout <a href="http://code.google.com/p/boxio/wiki/Ajout_Reference" target="_blank">ici</a></em>',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
		        	return;
				}
				
				//Gestion du nom
				var dataRef = Ext.getStore('DataEquipements').getRange();
				var ret = true;
				for (var ref in dataRef) {
					if (dataRef[ref].data.nom == formValues.nom) {
						ret = false;
						break;
					}
				}
				if (ret == false) {
		        	Ext.MessageBox.show({
						title: 'Erreur',
						msg: 'Le nom '+formValues.nom+' est déjà inscrit dans la base de donnée !<br /><br /><em>Utiliser la modification plutôt que l\'ajout</em>',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
		        	return;
				}
		
				//Creation de l'envoie
				var params = "'"+encode(formValues.id_legrand)+"','"+encode(formValues.reference)+"','"+encode(formValues.nom)+"','"+encode(formValues.zone)+"'";
				requestCall('add_equipement', params, {ok:'équipement ajouté !', error:'impossible d\'ajouter l\'équipement !'}, {
					onsuccess:function(response) {
						Ext.MessageBox.show({
							title: 'Information',
							msg: 'Equipement "'+formValues.nom+'" ajouté !',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						Ext.getCmp('formAddEquipement').getForm().reset();
						Ext.getCmp('winAddEquipement').close();
						Ext.data.StoreManager.lookup('DataEquipements').reload();
					},
					onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Information',
							msg: 'Equipement "'+formValues.nom+'" na pas pu être ajouté ! Erreur de communication, réessayez plus tard.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
					}
				});
			} else {
				Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Vous devez remplir tous les champs',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		},

		validateUpd: function() {
			var form = Ext.getCmp('formAddEquipement').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
				Ext.getCmp('formRefaddEquipement').enable();
				var formValues = form.getValues();
				Ext.getCmp('formRefaddEquipement').disable();
				//Creation de l'envoie
				var params = "'"+encode(formValues.id_legrand)+"','"+encode(formValues.reference)+"','"+encode(formValues.nom)+"','"+encode(formValues.zone)+"'";
				requestCall('add_equipement', params, {ok:'équipement modifié !', error:'impossible de modifier l\'équipement !'}, {
					onsuccess:function(response){
						Ext.getCmp('formAddEquipement').getForm().reset();
						Ext.getCmp('winAddEquipement').close();
						Ext.data.StoreManager.lookup('DataEquipements').reload();
	            	},
	            	onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'L\'équipement "'+formValues.nom+'" na pas pu être modifié ! Erreur de communication, réessayez plus tard.',
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

		upd: function(rec) {
			equipements.win.add();
			var winAddEquipement = Ext.getCmp('winAddEquipement');
			winAddEquipement.setTitle('Modification d\'un équipement');
	        var form = Ext.getCmp('formAddEquipement').getForm();
	        form.setValues({
	        	id_legrand:rec.get('id_legrand'),
	        	reference:rec.get('ref_legrand'),
	        	nom:rec.get('nom'),
	        	zone:rec.get('zone')
	        });
			Ext.getCmp('winAddEquipementBtnClear').hide();
			Ext.getCmp('formRefaddEquipement').disable();
			Ext.getCmp('winAddEquipementBtnSave').setHandler(function() {
				equipements.func.validateUpd();
			});
		},

		del: function(rec) {
			if (rec) {
			    var id = rec.get('id_legrand');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_equipement', id, {ok:'équipement éffacé !', error:'impossible d\'éffacer l\'équipement !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataEquipements').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'L\'équipement "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
			            	}
			            });
			    	}
			    });
			}
		},

		updScenar: function(rec) {
			if (rec) {
			    var id = rec.get('id_legrand');
			    equipements.win.equipementScenars();
			    var ScenarStore = Ext.data.StoreManager.lookup('DataCheckScenarios');
			    ScenarStore.getProxy().url = '../back/client.php?check_memory_db='+id;
			    ScenarStore.load();
			}
		},

		selUnknown: function(rec) {
			if (rec) {
	            var form = Ext.getCmp('formAddEquipement').getForm();
	            form.setValues({id_legrand:rec.get('id_legrand')});
	            Ext.getCmp('winfindEquipements').close();
			} else {
				Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Vous devez sélectionner une ligne',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		},
		
		progScenario: function(rec) {
	    	var in_memory = rec.get('in_memory');
	    	var in_db = rec.get('in_db');
	    	if (in_memory === 'true' && in_db === 'true') {
	        	Ext.MessageBox.show({
					title: 'Information',
					msg: 'Programmation correcte aucune modification à apporter.',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO
				});
	    	} else if (in_memory === 'true' && in_db === 'false') {
				params = "'"+rec.get('id_legrand')+"','"+rec.get('unit')+"','"+rec.get('id_legrand_listen')+"','"+rec.get('unit_listen')+"','"+rec.get('value_listen')+"','"+rec.get('media_listen')+"'";
	        	Ext.MessageBox.show({
					title: 'Programmation',
					msg: 'Voulez-vous vraiment ajouter la programmation du module au serveur ?',
					buttons: Ext.MessageBox.OKCANCEL,
					fn: function() {
						requestCall('add_scenario', params, {ok:'scénario programmé !', error:'Impossible de programmer le scénario !'}, {
							onsuccess:function(response) {
								rec.set('in_memory', 'update');
			            	},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Le scénario pour "'+rec.get('id_legrand')+'" n\'a pas pu être programmé ! Erreur de communication, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
			            	}
			            });
						alert('add!!');
					},
					icon: Ext.MessageBox.WARNING
				});
	    	} else if (in_memory === 'false' && in_db === 'true') {
	        	Ext.MessageBox.show({
					title: 'Inofrmation',
					msg: 'Voulez-vous vraiment supprimmer du serveur la programmation inexistante du module ?',
					buttons: Ext.MessageBox.OKCANCEL,
					fn: function() {
						alert('delete!!');
					},
					icon: Ext.MessageBox.WARNING
				});
	    	}
	    },

		panelList: function() {
			if (Ext.getCmp('panelEquipements')) {
				Ext.data.StoreManager.lookup('DataEquipements').reload();
			} else {
				layout.func.clear();
				layout.func.add(equipements.panel.equipements());
				Ext.data.StoreManager.lookup('DataEquipements').reload();
			};
		}
	};
}

var equipements = new equipements();

