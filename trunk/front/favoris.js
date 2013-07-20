function favoris() {
	this.form = {
		ref: {
			xtype: 'fieldset',
			title: 'Références du favoris',
			collapsible: true,
			defaults: {
				width: 500
			},
			items: [{
				xtype: 'textfield',
				id:'favorisFormRefNom',
				name: 'nom',
				fieldLabel: 'Nom',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'textfield',
				name: 'trame',
				fieldLabel: 'Trame',
				msgTarget: 'side',
				allowBlank: false
			}]
		}
	};
	
	this.panel = {
		favoris: function() {
			var content = {
				id: 'panelFavoris',
				title : 'Liste des favoris enregistrés', 
				icon: 'imgs/heart_stroke_32x28.png',
				emptyText: 'Aucun favoris trouvé',
				store: 'DataFavoris',
				disableSelection: false,
				loadMask: true,
				width: '100%',
				height: 500,
				autoScroll: true,
				closable: true,
				selModel: {
					listeners: {
				        selectionchange: function(sm, selections) {
				            if (selections.length) {
				                Ext.getCmp('favorisToolbarBtnDel').enable();
				                Ext.getCmp('favorisToolbarBtnMod').enable();
				                Ext.getCmp('favorisToolbarBtnStart').enable();
				            } else {
				                Ext.getCmp('favorisToolbarBtnDel').disable();
				                Ext.getCmp('favorisToolbarBtnMod').disable();
				                Ext.getCmp('favorisToolbarBtnStart').disable();
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
						}, hidden: true, tooltip: 'Identifiant du Favoris'
					},
					{text: 'Nom', dataIndex: 'nom', width: 131, filter: {
						type: 'string'
					}, tooltip: 'Nom du Favoris'}, 
					{text: 'Trame', dataIndex: 'trame', width: 131, tooltip: 'Trame à éxecuter'},
					{
					    xtype:'actioncolumn', tooltip:'Opération sur le favoris',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/gears.png',
					        tooltip: 'Démarrer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            favoris.func.start(rec);
					        }
					    },{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            favoris.win.upd(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            favoris.func.del(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'favorisToolbarBtnStart',
		                    	icon: 'imgs/gears.png',
		                        text: 'Démarer',
		                        tooltip:'Démarrer le favoris',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelFavoris').getSelectionModel().getSelection()[0];
		                        	favoris.func.start(rec);
		                        }
		                    },{
		                    	id:'favorisToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter un favoris',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	favoris.win.add();
		                        }
		                    },{
		                    	id:'favorisToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer le favoris',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelFavoris').getSelectionModel().getSelection()[0];
		                        	favoris.win.upd(rec);
		                        }
		                    },{
		                    	id:'favorisToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer le favoris',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelFavoris').getSelectionModel().getSelection()[0];
		                        	favoris.func.del(rec);
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataFavoris'),
					displayInfo: true,
					displayMsg: 'Liste des favoris {0} - {1} de {2}',
					emptyMsg: "Aucun favoris"
				})
			};
			return new Ext.grid.Panel(content);
		}
	};
	
	this.win = {
		add: function() {
			var winFavoris = Ext.getCmp('winFavoris');
			if (!winFavoris) {
				winFavoris = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winFavoris',
					icon: 'imgs/heart_fill_32x28.png',
				    closeAction: 'close',
				    items: [{
				            xtype: 'form',
				            id: 'formAddFavoris',
						    items: [favoris.form.ref]
				    }],
				    buttons: [{
						text: 'Effacer',
						id: 'winFavorisBtnClear',
						handler: function() {
							Ext.getCmp('formAddFavoris').getForm().reset();
						}
					},{
						text: 'Annuler',
						handler: function() {
							Ext.getCmp('winFavoris').close();
						}
					},{
						text: 'Enregistrer',
						id: 'winFavorisBtnSave',
						handler: function() {
							favoris.func.validateAdd();
						}
					}]
				});
			}
			winFavoris.show();
			Ext.getCmp('formAddFavoris').getForm().reset();
			winFavoris.setTitle('Ajout d\'un favoris');
	        Ext.getCmp('favorisFormRefNom').enable(true);
			Ext.getCmp('winFavorisBtnClear').show();
			Ext.getCmp('winFavorisBtnSave').setHandler(function() {
				favoris.func.validateAdd();
			});
		},
		
		upd: function(rec) {
			favoris.win.add();
			var winFavoris = Ext.getCmp('winFavoris');
			winFavoris.setTitle('Modification d\'un favoris');
	        var form = Ext.getCmp('formAddFavoris').getForm();
	        Ext.getCmp('favorisFormRefNom').disable(true);
			Ext.getCmp('winFavorisBtnClear').hide();
			Ext.getCmp('winFavorisBtnSave').setHandler(function() {
				favoris.func.validateUpd();
			});
	        form.setValues({
	        	nom:rec.get('nom'),
	        	trame:rec.get('trame')
	        });
		}
	};
	
	this.func = {
		validateAdd: function() {
			var form = Ext.getCmp('formAddFavoris').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var trame = encode(formValues.trame);
				var params = "'"+nom+"','"+trame+"'";
				requestCall('add_favoris', params, {ok:'favoris ajouté !', error:'impossible d\'ajouter le favoris !'}, {
					onsuccess:function(response){
						Ext.getCmp('formAddFavoris').getForm().reset();
						Ext.getCmp('winFavoris').close();
						Ext.data.StoreManager.lookup('DataFavoris').reload();
	            	},
	            	onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Le favoris "'+formValues.nom+'" na pas pu être ajouté ! Erreur de communication, réessayez plus tard.',
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
			var form = Ext.getCmp('formAddFavoris').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
		        Ext.getCmp('favorisFormRefNom').enable(true);
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var trame = encode(formValues.trame);
				var params = "'"+nom+"','"+trame+"'";
				requestCall('add_favoris', params, {ok:'favoris modifié !', error:'impossible de modifier le favoris !'}, {
					onsuccess:function(response){
						Ext.getCmp('formAddFavoris').getForm().reset();
						Ext.getCmp('winFavoris').close();
						Ext.data.StoreManager.lookup('DataFavoris').reload();
	            	},
	            	onfailure:function(response){
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Le favoris "'+formValues.nom+'" na pas pu être modifié ! Erreur de communication, réessayez plus tard.',
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
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer le favoris <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_favoris', id, {ok:'favoris éffacé !', error:'impossible d\'éffacer le favoris !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataFavoris').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Le favoris "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
			            	}
			            });
			    	}
			    });
			}
		},

		start: function(rec) {
			if (rec) {
			    var id = rec.get('id');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment démarrer le favoris <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('send_favoris', id+", NULL, NULL", {ok:'favoris démarré !', error:'impossible de démarré le favoris !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataFavoris').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Le favoris "'+formValues.nom+'" na pas pu être démarré ! Erreur de communication, réessayez plus tard.',
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
			if (Ext.getCmp('panelFavoris')) {
				Ext.data.StoreManager.lookup('DataFavoris').reload();
			} else {
				layout.func.clear();
				layout.func.add(favoris.panel.favoris());
				Ext.data.StoreManager.lookup('DataFavoris').reload();
			};
		}			
	};
};

var favoris = new favoris();
