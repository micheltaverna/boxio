/*
 * Gestion des Utilisateurs
 */

function users() {
	this.form = {
		ref: {
			xtype: 'fieldset',
			title: 'Paramètres de l\'utilisateur',
			collapsible: true,
			defaults: {
				width: 600
			},
			items: [{
				xtype: 'textfield',
				id:'usersFormRefNom',
				name: 'login',
				fieldLabel: 'Identifiant',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'textfield',
				inputType: 'password',
				name: 'password',
				fieldLabel: 'Mot de passe',
				msgTarget: 'side',
				allowBlank: false,
				enableKeyEvents: true,
				listeners: {
			        keyup:function(t, m, k) { 
			        	password = t.getValue();
			        	passwordSha512 = hex_sha512(password);
			            Ext.getCmp('usersFormRefpasswordSha512').setValue(passwordSha512);
			        }
			    }
			},{
				xtype: 'textfield',
				inputType: 'password',
				name: 'password_verif',
				fieldLabel: 'Vérification du mot de passe',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'textfield',
				id: 'usersFormRefpasswordSha512',
				name: 'passwordSha512',
				fieldLabel: 'Mot de passe Crypté',
				msgTarget: 'side',
				allowBlank: false
			}]
		}
	};
	
	this.panel = {
		users: function() {
			var content = {
				id: 'panelUsers',
				title : 'Liste des utilisateurs enregistrés', 
				icon: 'imgs/user_24x32.png',
				emptyText: 'Aucun utilisateur trouvé',
				store: 'DataUsers',
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
				                Ext.getCmp('usersToolbarBtnDel').enable();
				                Ext.getCmp('usersToolbarBtnMod').enable();
				            } else {
				                Ext.getCmp('usersToolbarBtnDel').disable();
				                Ext.getCmp('usersToolbarBtnMod').disable();
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
						}, hidden: true, tooltip: 'Identifiant du Users'
					},
					{text: 'Identifiant', dataIndex: 'login', width: 131, filter: {
						type: 'string'
					}, tooltip: 'Identifiant de l\'utilisateur'},
					{text: 'Mot de Passe Crypté', dataIndex: 'password', width: 800, filter: {
						type: 'string'
					}, hidden: false, tooltip: 'Mot de passe crypté'},
					{
					    xtype:'actioncolumn', tooltip:'Opération sur l\'utilisateur',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            users.win.upd(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            users.func.del(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'usersToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter un utilisateur',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	users.win.add();
		                        }
		                    },{
		                    	id:'usersToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer l\'utilisateur',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelUsers').getSelectionModel().getSelection()[0];
		                        	users.win.upd(rec);
		                        }
		                    },{
		                    	id:'usersToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer l\'utilisateur',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelUsers').getSelectionModel().getSelection()[0];
		                        	users.func.del(rec);
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataUsers'),
					displayInfo: true,
					displayMsg: 'Liste des utilisateurs {0} - {1} de {2}',
					emptyMsg: "Aucun utilisateur"
				})
			};
			return new Ext.grid.Panel(content);
		}
	};
	
	this.win = {
		add: function() {
			var winUsers = Ext.getCmp('winUsers');
			if (!winUsers) {
				winUsers = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winUsers',
					icon: 'imgs/user_24x32.png',
				    closeAction: 'close',
				    items: [{
				            xtype: 'form',
				            id: 'formAddUsers',
						    items: [users.form.ref]
				    }],
				    buttons: [{
						text: 'Effacer',
						id: 'winUsersBtnClear',
						handler: function() {
							Ext.getCmp('formAddUsers').getForm().reset();
						}
					},{
						text: 'Annuler',
						handler: function() {
							Ext.getCmp('winUsers').close();
						}
					},{
						text: 'Enregistrer',
						id: 'winUsersBtnSave',
						handler: function() {
							users.func.validateAdd();
						}
					}]
				});
			}
			winUsers.show();

			Ext.getCmp('formAddUsers').getForm().reset();
			winUsers.setTitle('Ajout d\'un utilisateur');
	        Ext.getCmp('usersFormRefNom').enable(true);
			Ext.getCmp('winUsersBtnClear').show();
			Ext.getCmp('winUsersBtnSave').setHandler(function() {
				users.func.validateAdd();
			});
		},
		
		upd: function(rec) {
			users.win.add();
			var winUsers = Ext.getCmp('winUsers');
			winUsers.setTitle('Modification d\'un utilisateur');
	        var form = Ext.getCmp('formAddUsers').getForm();
	        Ext.getCmp('usersFormRefNom').disable(true);
			Ext.getCmp('winUsersBtnClear').hide();
			Ext.getCmp('winUsersBtnSave').setHandler(function() {
				users.func.validateUpd();
			});
	        form.setValues({
	        	login:rec.get('login'),
	        	passwordSha512:rec.get('password')
	        });
		}
	};
	
	this.func = {
		validateAdd: function() {
			var form = Ext.getCmp('formAddUsers').getForm(),
			encode = Ext.String.htmlEncode;
			var formValues = form.getValues();
			var password = formValues.password;
			var password_verif = formValues.password_verif;
			if (password_verif !== password) {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Le mot de passe n\'est pas identique !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
		        form.setValues({
		        	password:null,
		        	password_verif:null
		        });
			}
			if (form.isValid()) {
				var login = encode(formValues.login);
				var passwordSHA512 = hex_sha512(formValues.password);
				requestGET('../back/client.php', {user:'',action:'add',new_login:login,new_password:passwordSHA512}, {ok:'opération effectuée !', error:'impossible d\'effectuer l\'opération sur le serveur !'}, {
					onsuccess:function(response) {
						//TODO: gérer les erreurs
						Ext.getCmp('formAddUsers').getForm().reset();
						Ext.getCmp('winUsers').close();
						Ext.data.StoreManager.lookup('DataUsers').reload();
					},
					onfailure:function(response) {
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Erreur de communication avec le server, réessayez plus tard.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						waiting.hide();
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
			var encode = Ext.String.htmlEncode;
	        Ext.getCmp('usersFormRefNom').enable(true);
			var form = Ext.getCmp('formAddUsers').getForm();
			var formValues = form.getValues();
			var login = encode(formValues.login);
			var password = formValues.password;
			var password_verif = formValues.password_verif;
	        Ext.getCmp('usersFormRefNom').disable(true);
			if (password_verif !== password) {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Le mot de passe n\'est pas identique !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
		        form.setValues({
		        	password:null,
		        	password_verif:null
		        });
			}
			if (form.isValid()) {
				var passwordSHA512 = hex_sha512(formValues.password);
				requestGET('../back/client.php', {user:'',action:'upd',old_login:login,new_password:passwordSHA512}, {ok:'opération effectuée !', error:'impossible d\'effectuer l\'opération sur le serveur !'}, {
					onsuccess:function(response) {
						//TODO: gérer les erreurs
						Ext.getCmp('formAddUsers').getForm().reset();
						Ext.getCmp('winUsers').close();
						Ext.data.StoreManager.lookup('DataUsers').reload();
					},
					onfailure:function(response) {
						Ext.MessageBox.show({
							title: 'Erreur',
							msg: 'Erreur de communication avec le server, réessayez plus tard.',
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						waiting.hide();
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
			    var login = rec.get('login');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer l\'utilisateur <b>"'+login+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
						requestGET('../back/client.php', {user:'',action:'del',old_login:login}, {ok:'opération effectuée !', error:'impossible d\'effectuer l\'opération sur le serveur !'}, {
							onsuccess:function(response) {
								//TODO: gérer les erreurs
								Ext.data.StoreManager.lookup('DataUsers').reload();
								if (Ext.getCmp('winUsers')) {
									Ext.getCmp('winUsers').close();
								}
							},
							onfailure:function(response) {
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Erreur de communication avec le server, réessayez plus tard.',
									buttons: Ext.MessageBox.OK,
									icon: Ext.MessageBox.ERROR
								});
								waiting.hide();
							}
						});
			    	}
			    });
			}
		},
	
		panelList: function() {
			if (Ext.getCmp('panelUsers')) {
				Ext.data.StoreManager.lookup('DataUsers').reload();
			} else {
				layout.func.clear();
				layout.func.add(users.panel.users());
				Ext.data.StoreManager.lookup('DataUsers').reload();
			};
		}			
	};
};

var users = new users();
