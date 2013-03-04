function update() {
	this.html = {
			updateCheck: "<img src='imgs/orange-led.gif'>&nbsp;Recherche en cours...",
			updateOK: "<img src='imgs/green-led.gif'>&nbsp;A jour !",
			updateNEED: "<img src='imgs/red-led.gif'>&nbsp;Une nouvelle mise à jour doit être installée !",
			updateStatus: "<div class='update'>" +
			"<div class='update_information'><img src='imgs/error.png'><span>La gestion des mises à jours n'est disponible que dans un environement BOXIO (avec une RaspberryPi) !</span>" +
			"<br /><img src='imgs/information.png'><span>Les mises à jours sont plus ou moins longues, entre 1 et 5 minutes. <br/>Il est donc préférable de patienter avant une nouvelle opération.</span>" +
			"</div><br /><div class='update_content'>" +
			"<span>Le statut actuel du serveur est : <span class='update_status'>"+this.updateCheck+"</span></span><br/><br/>" +
			"</div></div>"		
	};
	
	this.panel = {
		update: function() {
			var content = {
				id:'panelUpdate',
				title : 'Gestion des mises à jour du serveur',
				height: 500,
				autoScroll: true,
				closable: true,
				defaults: {
					margin:10,
					padding: 10
				},
				items: [{				    	
					xtype: 'fieldset',
					title: 'Statut',
					collapsible: true,
					defaults: {
						layout: {
							type: 'vbox',
							defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
						}
					},
					items: [{
						xtype:'fieldcontainer',
						items: [{
							xtype:'box',
							html:update.html.updateStatus
						},{
							xtype:'button',
							text:'Rafraichir',
					        handler: function() {
								update.func.updateStatus('check');
					        }
						}]
					}]
				},{				    	
					xtype: 'fieldset',
					title: 'Opérations',
					id: 'fieldOperation',
					disabled: true,
					collapsible: true,
					defaults: {
						layout: {
							type: 'vbox'
						}
					},
					items: [{
						xtype:'fieldcontainer',
						items:[{
							xtype:'fieldcontainer',
							layout: {
								type: 'hbox',
								defaultMargins: {top: 5, right: 5, bottom: 5, left: 5}
							},
							items:[{
								xtype:'button',
								text:'Mettre à jour',
						        handler: function() {
									update.func.updateStatus('update');
						        }
							},{
								xtype:'box',
								html:"Lance la mise à jour du serveur, si necessaire."
							},{
								xtype:'textfield',
								id:'updateLink',
								hidden:true
							}]
						}]
					}],
					listeners: {
						afterrender: {
							fn: function() {
								update.func.updateStatus('check');
							}
						}
					}
				}]
			};
			return new Ext.Panel(content);
		}
	};
	
	this.func = {
		updateStatus: function(action) {
			var waiting = new Ext.LoadMask(panelUpdate, {msg:"recherche en cours, merci de patienter..."});
			waiting.show();
			Ext.get(Ext.query('.update_status')).update(update.html.updateCheck);
			var updateLink = Ext.getCmp('updateLink').getValue();
			var release = updateLink?updateLink:'';
			if (action == 'update') {
				waiting.hide();
				Ext.Ajax.timeout = 120000;
				Ext.MessageBox.show({
					title: 'Merci de patienter',
					msg: 'Installation de la mise à jour...',
					progressText: 'Initialisation...',
					width:300,
					progress:true,
					closable:false
				});	
				var f = function(v){
					return function(){
						if(v == 12){
							Ext.MessageBox.hide();
						}else{
					    	var i = v/11;
							Ext.MessageBox.updateProgress(i, Math.round(100*i)+'% effectué');
						}
					};
				};
				for(var i = 1; i < 13; i++){
					setTimeout(f(i), i*10000);
				}
			}
			requestGET('../back/client.php', {version:'',release:release,action:action}, {ok:'opération effectuée !', error:'impossible d\'effectuer l\'opération sur le serveur !'}, {
				onsuccess:function(response) {
					Ext.Ajax.timeout = 30000;
					if (action == 'update') {
						Ext.getCmp('updateLink').setValue('');
						update.func.updateStatus('check');
						return;
					}
					var memstore = new Ext.data.Store({
					    autoLoad: true,
					    model: 'checkVersion',
					    data:response.responseXML,
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
					if (arrayResult[0].data.status == 'TRUE') {
						var version = 'VERSION : '+arrayResult[0].data.current_version_name+' (sortie le '+arrayResult[0].data.current_version_release+', installée le '+arrayResult[0].data.current_version_update+')';
						Ext.get(Ext.query('.update_status')).update(update.html.updateOK+' '+version);
					} else {
						var version = 'VERSION : '+arrayResult[0].data.next_version_name+' (sortie le '+arrayResult[0].data.next_version_release+')';
						Ext.get(Ext.query('.update_status')).update(update.html.updateNEED+' '+version);
						Ext.getCmp('fieldOperation').enable();
						Ext.getCmp('updateLink').setValue(arrayResult[0].data.next_version_path);
					}
					waiting.hide();
					Ext.getCmp('panelUpdate').updateLayout();
				},
				onfailure:function(response) {
					Ext.Ajax.timeout = 30000;
					if (action == 'update') {
						Ext.getCmp('updateLink').setValue('');
						update.func.updateStatus('check');
						return;
					}
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
			
		panelList: function() {
			if (Ext.getCmp('panelUpdate')) {
				this.updateStatus('check');
			} else {
				layout.func.clear();
				layout.func.add(update.panel.update());
			};
		}
	};
};
var update = new update();
