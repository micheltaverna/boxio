/**
 * Gestion du login
 */

function login() {
	this.form = {
		login: {
			xtype: 'fieldset',
			title: 'Connexion',
			collapsible: true,
			defaults: {
				width: 500
			},
			items: [{
				xtype: 'textfield',
				name: 'login',
				fieldLabel: 'Utilisateur',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'textfield',
				inputType: 'password',
				name: 'password',
				fieldLabel: 'Mot de Passe',
				msgTarget: 'side',
				allowBlank: false
			}]
		}
	};
	
	this.win = {
		login: function(callback) {
			var winLogin = Ext.getCmp('winLogin');
			if (!winLogin) {
				winLogin = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winLogin',
					title: 'Connexion',
					modal: true,
					icon: 'imgs/key_fill_32x32.png',
				    closeAction: 'close',
				    closable: false,
				    items: [{
				            xtype: 'form',
				            id: 'formLogin',
						    items: [login.form.login]
				    }],
				    buttons: [{
						text: 'Connexion',
						id: 'winLoginBtnConnect'
					}]
				});
			}
			winLogin.show();
			Ext.getCmp('winLoginBtnConnect').setHandler(function() {
				login.func.validateLogin(callback);
			});
			Ext.getCmp('formLogin').getForm().reset();
		}
	};
	
	this.func = {
		logout: function(callback) {
			requestGET('../back/client.php', {logout:''}, {ok:'Déconnexion en cours...', error:'impossible de vérifier la connexion au serveur !'}, {
				onsuccess:function(response) {
					layout.func.clear();
					login.func.checkLogin(function(status) {
						if (status == 'false') {
							login.win.login();
						}
					});
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
		},

		checkLogin: function(callback) {
			requestGET('../back/client.php', {check_login:''}, {ok:'test de la connexion en cours...', error:'impossible de vérifier la connexion au serveur !'}, {
				onsuccess:function(response) {
					var memstore = new Ext.data.Store({
					    autoLoad: true,
					    model: 'checkLogin',
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
					callback(arrayResult[0].data.login_status);
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
		},
		
		validateLogin: function(callback) {
			var form = Ext.getCmp('formLogin').getForm();
			if (form.isValid()) {
				var formValues = form.getValues();
				var login = formValues.login;
				var pHash512 = hex_sha512(formValues.password);
				requestGET('../back/client.php', {login:login,pHash512:pHash512}, {ok:'connexion en cours...', error:'impossible de lancer la connexion sur le serveur !'}, {
					onsuccess:function(response) {
						var memstore = new Ext.data.Store({
						    autoLoad: true,
						    model: 'checkLogin',
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
						if (arrayResult[0].data.login_status == 'true') {
							if (callback && callback.onSucess) {
								callback.onSucess();
							}
							Ext.getCmp('winLogin').close();
						} else {
							Ext.MessageBox.show({
								title: 'Erreur',
								msg: 'Erreur, nom d\'utilsater et/ou mot de passe invalide ! (Error:'+arrayResult[0].data.login_error+')',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
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
		}
	};
}

var login = new login();
