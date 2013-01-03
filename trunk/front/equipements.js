/**
 * Gestion des equipements
 */

var addEquipements = function() {
	var func_validateAddEquipement = function() {
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
					Ext.getCmp('winAddEquipement').hide();
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
	};
		
	var winfindReference = Ext.getCmp('winfindReference');
	if (!winfindReference) {
		winfindReference = Ext.create('Ext.window.Window', {
			id: 'winfindReference',
		    title: 'Recherche de référence',
		    closeAction: 'hide',
			listeners: {
				afterlayout: {
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
		        	Ext.getCmp('winfindReference').hide();
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
		            Ext.getCmp('winfindReference').hide();
		        }
		    }]
		});
	} 

	func_selUnknownEquipement = function(rec) {
		if (rec) {
            var form = Ext.getCmp('formAddEquipement').getForm();
            form.setValues({id_legrand:rec.get('id_legrand')});
            Ext.getCmp('winfindEquipements').hide();
		} else {
			Ext.MessageBox.show({
				title: 'Erreur',
				msg: 'Vous devez sélectionner une ligne',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});
		}
	};

	var winfindEquipements = Ext.getCmp('winfindEquipements');
	if (!winfindEquipements) {
		
		winfindEquipements = Ext.create('Ext.window.Window', {
			id: 'winfindEquipements',
		    title: 'Listes des équipements non enregistrés',
		    closeAction: 'hide',
		    width: 500,
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
					{text: "Id Legrand", dataIndex: 'id_legrand', sortable: true, width: 95},
					{text: "Media", dataIndex: 'media', sortable: true, width: 84},
					{text: "Date", dataIndex: 'Date', sortable: true, width: 150},
					{
					    xtype:'actioncolumn',
						text: 'Séléction',
						align: 'right',
						width: 80,
					    items: [{
					        icon: 'imgs/accept.png',
					        tooltip: 'Séléctionner',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            func_selUnknownEquipement(rec);
					        }
					    }]
					}
				],
				//Creation des boutons
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
                    	id:'findEequipementToolbarBtnRefresh',
                    	icon: 'imgs/table_refresh.png',
                        text: 'Rechercher à nouveau',
                        disabled: false,
                        handler: function(widget, event) {
        					Ext.data.StoreManager.lookup('DataUnknownEquipements').reload();
                        }
		            }]
		        }],
		    }],
		    buttons: [{
		        text: 'Annuler',
		        handler: function() {
		        	Ext.getCmp('winfindEquipements').hide();
		        }
		    },{
		        text: 'Valider la selection',
		        handler: function() {
		        	var rec = Ext.getCmp('formfindEquipements').getSelectionModel().getSelection()[0];
		        	func_selUnknownEquipement(rec);
		        }
		    }]
		});
	}

	var winAddEquipement = Ext.getCmp('winAddEquipement');
	if (!winAddEquipement) {
		winAddEquipement = Ext.create('Ext.window.Window', {
			xtype: 'form',
			id: 'winAddEquipement',
		    title: 'Ajout/Modification d\'un équipement',
		    closeAction: 'hide',
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
								fieldLabel:'Id',
								name:'id_legrand',
								msgTarget: 'side',
								vtype:'listInteger',
								allowBlank: false
							},{
								xtype: 'button',
								flex: 1,
								text: 'Rechercher',
						        icon: 'imgs/find.png',
						        iconAlign: 'left',
								handler: function() {
							        winfindEquipements.show();
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
						        iconAlign: 'left',
								handler: function() {
						            var form = Ext.getCmp('formAddEquipement').getForm();
						            var formValues = form.getValues();
						            if (formValues.id_legrand) {
						            	winfindReference.show();
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
				handler: function() {
					Ext.getCmp('formAddEquipement').getForm().reset();
				}
			},{
				text: 'Annuler',
				handler: function() {
					Ext.getCmp('winAddEquipement').hide();
				}
			},{
				text: 'Enregistrer',
		    	id:'winAddEquipementBtnSave',
				handler: function() {
					func_validateAddEquipement();
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
		func_validateAddEquipement();
	});
};


var modEquipementScenar = function() {

	var func_progScenario = function(rec) {
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
        	Ext.MessageBox.show({
				title: 'Programmation',
				msg: 'Voulez-vous vraiment ajouter la programmation du module au serveur ?',
				buttons: Ext.MessageBox.OKCANCEL,
				fn: function() {
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
    };
	
	var winEquipementScenars = Ext.getCmp('winEquipementScenars');
	if (!winEquipementScenars) {
		winEquipementScenars = Ext.create('Ext.window.Window', {
			id: 'winEquipementScenars',
		    title: 'Listes des scenarios de l\'équipements (dans le serveur / dans le module)',
		    closeAction: 'hide',
		    width: 700,
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
					{text: "Id Legrand d'écoute", dataIndex: 'id_legrand_listen', width: 115},
					{text: "Unité d'écoute", dataIndex: 'unit_listen', width: 85},
					{text: "Média d'écoute", dataIndex: 'media_listen', width: 85},
					{text: "Fonction", dataIndex: 'value_listen', width: 80},
					{text: "En mémoire", dataIndex: 'in_memory', width: 90, renderer: function(val) {
						if (val == 'true') {
							return '<span style="color:green;">OK</span>';
						} else {
							return '<span style="color:red;">ERREUR</span>';
						}
					}},
					{text: "En base de donnée", dataIndex: 'in_db', width: 90, renderer: function(val) {
						if (val == 'true') {
							return '<span style="color:green;">OK</span>';
						} else {
							return '<span style="color:red;">ERREUR</span>';
						}
					}},
					{
					    xtype:'actioncolumn',
						text: 'Action',
						align: 'right',
						width: 80,
					    items: [{
					        icon: 'imgs/cog.png',
					        tooltip: 'Programmer',
					        handler: function(grid, rowIndex, colIndex) {
					        	var rec = grid.getStore().getAt(rowIndex);
					        	func_progScenario(rec);
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
                    disabled: false,
                    handler: function(widget, event) {
                    	var ScenarStore = Ext.data.StoreManager.lookup('DataCheckScenarios');
            		    ScenarStore.load();
            		}
	            }]
			}],
	        buttons: [{
		        text: 'Fermer',
		        handler: function() {
		        	Ext.getCmp('winEquipementScenars').hide();
		        }
		    }]
		});
	}
	winEquipementScenars.show();
};

var openEquipements = function() {

	var func_validateModEquipement = function() {
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
					Ext.getCmp('winAddEquipement').hide();
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
	};

	var func_modEquipement = function(rec) {
		addEquipements();
		var winAddEquipement = Ext.getCmp('winAddEquipement');
		winAddEquipement.setTitle('Modification d\'un équipement');
        var form = Ext.getCmp('formAddEquipement').getForm();
        form.setValues({
        	id_legrand:rec.get('id_legrand'),
        	reference:rec.get('ref_legrand'),
        	nom:rec.get('nom'),
        	zone:rec.get('zone'),
        });
		Ext.getCmp('winAddEquipementBtnClear').hide();
		Ext.getCmp('formRefaddEquipement').disable();
		Ext.getCmp('winAddEquipementBtnSave').setHandler(function() {
			func_validateModEquipement();
		});
	};

	var func_delEquipement = function(rec) {
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
	};

	var func_modEquipementScenar = function(rec) {
		if (rec) {
		    var id = rec.get('id_legrand');
		    modEquipementScenar();
		    var ScenarStore = Ext.data.StoreManager.lookup('DataCheckScenarios');
		    ScenarStore.getProxy().url = '../back/client.php?check_memory_db='+id;
		    ScenarStore.load();
		}
	};

	var func_createPanel = function() {

		var panelEquipements = new Ext.grid.Panel({
			id:'panelEquipements',
			title : 'Liste des équipements référencés dans le serveur', 
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
				{text: 'Nom', dataIndex: 'nom', width: 131, filter: {type: 'string'}},
				{text: 'Zone', dataIndex: 'zone', width: 131, filter: {type: 'list', store:Ext.data.StoreManager.lookup('DataZones')}}, 
				{text: 'Référence Legrand', dataIndex: 'ref_legrand', width: 131, filter: {type: 'list', store:Ext.data.StoreManager.lookup('DataReferences')}},
				{text: 'Id Legrand', dataIndex: 'id_legrand', width: 131, filter: {type: 'numeric'}}, 
				{
				    xtype:'actioncolumn',
					text: 'Action', width: 70,
				    items: [{
				        icon: 'imgs/edit.png',
				        tooltip: 'Editer',
				        handler: function(grid, rowIndex, colIndex) {
				            var rec = grid.getStore().getAt(rowIndex);
				            func_modEquipement(rec);
				        }
				    },{
				        icon: 'imgs/cog.png',
				        tooltip: 'Scénarios',
				        handler: function(grid, rowIndex, colIndex) {
				            var rec = grid.getStore().getAt(rowIndex);
				            func_modEquipementScenar(rec);
				        }
				    },{
				        icon: 'imgs/delete.png',
				        tooltip: 'Effacer',
				        handler: function(grid, rowIndex, colIndex) {
				            var rec = grid.getStore().getAt(rowIndex);
				            func_delEquipement(rec);
				        }
				    }]
				}
			],
			//Creation des boutons
			dockedItems: [{
	            xtype: 'toolbar',
	            items: [
	                    {
	                    	id:'equipementsToolbarBtnAdd',
	                    	icon: 'imgs/add.png',
	                        text: 'Ajouter',
	                        disabled: false,
	                        handler: function(widget, event) {
	                        	addEquipements();
	                        }
	                    },
	                    {
	                    	id:'equipementsToolbarBtnMod',
	                    	icon: 'imgs/edit.png',
	                        text: 'Editer',
	                        disabled: true,
	                        handler: function(widget, event) {
	                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
	                        	func_modEquipement(rec);
	                        }
	                    },
	                    {
	                    	id:'equipementsToolbarBtnScn',
	                    	icon: 'imgs/cog.png',
	                        text: 'Scénarios',
	                        disabled: true,
	                        handler: function(widget, event) {
	                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
	                        	func_modEquipementScenar(rec);
	                        }
	                    },
	                    {
	                    	id:'equipementsToolbarBtnDel',
	                    	icon: 'imgs/delete.png',
	                        text: 'Effacer',
	                        disabled: true,
	                        handler: function(widget, event) {
	                        	var rec = Ext.getCmp('panelEquipements').getSelectionModel().getSelection()[0];
	                        	func_delEquipement(rec);
	                        }
	                    }
	                    ]
	        }],
	        // Creation de la bar de defilement des pages
			bbar: Ext.create('Ext.PagingToolbar', {
				store: Ext.data.StoreManager.lookup('DataEquipements'),
				displayInfo: true,
				displayMsg: 'Liste des équipements {0} - {1} of {2}',
				emptyMsg: "Aucun équipement"
			}),
		});

		clearContent();
		var region = Ext.getCmp('Content');
		region.add(panelEquipements);
		panelEquipements.show();
	};

	if (Ext.getCmp('panelEquipements')) {
		Ext.data.StoreManager.lookup('DataEquipements').reload();
	} else {
		func_createPanel();
		Ext.data.StoreManager.lookup('DataEquipements').reload();
	};

};