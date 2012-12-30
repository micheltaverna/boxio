/**
 * Gestion du server
 */

var openServer = function() {

	var html_server_search = "<img src='imgs/orange-led.gif'>&nbsp;Recherche en cours...";
	var html_server_running = "<img src='imgs/green-led.gif'>&nbsp;Démarré !";
	var html_server_stopping = "<img src='imgs/red-led.gif'>&nbsp;Arrêté !";

	var html = "<div class='server'>" +
	"<div class='server_information'><img src='imgs/error.png'><span>La gestion du serveur n'est disponible que dans un environement BOXIO (avec une RaspberryPi) !</span>" +
	"<br /><img src='imgs/information.png'><span>Les changements d'états (démarrage/arrêt) sont plus ou moins longs, entre 5 et 20 secondes. Il est donc préférable de patienter entre chaque opérations que vous effectuer sur le serveur.</span>" +
	"</div><br /><div class='server_content'>" +
	"<span>Le statut actuel du serveur est : <span class='server_status'>"+html_server_search+"</span></span><br/><br/>" +
	"</div></div>";

	var server_status = function(action) {
		var waiting = new Ext.LoadMask(panelServer, {msg:"en cours, merci de patienter..."});
		waiting.show();
		Ext.get(Ext.query('.server_status')).update(html_server_search);
		requestGET('../back/client.php', {server_service:'',action:action}, {ok:'opération effectuée !', error:'impossible d\'effectuer l\'opération sur le serveur !'}, {
			onsuccess:function(response) {
					var memstore = new Ext.data.Store({
					    autoLoad: true,
					    model: 'findStatus',
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
					if (arrayResult[0].data.status == 'TRUE') {
						Ext.get(Ext.query('.server_status')).update(html_server_running);
					} else {
						Ext.get(Ext.query('.server_status')).update(html_server_stopping);
					}
					waiting.hide();
				},
				onfailure:function(response) {
					Ext.MessageBox.show({
						title: 'Erreur',
						msg: 'L\'équipement "'+formValues.nom+'" na pas pu être modifié ! Erreur de communication, réessayez plus tard.',
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.ERROR
					});
					waiting.hide();
				}
			});		
	};
	
	var panelServer = new Ext.Panel({
		id:'panelServer',
		title : 'Statut du serveur et des services', 
		height: 500,
		autoScroll: true,
		closable: true,
		defaults: {
			margin:10,
			padding: 10
		},
		items: [{				    	
			xtype: 'fieldset',
			title: 'Status',
			collapsible: true,
			defaults: {
				width: 600,
				layout: {
					type: 'vbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				}
			},
			items: [{
				xtype:'fieldcontainer',
				items: [{
					xtype:'box',
					html:html
				},{
					xtype:'button',
					text:'Rafraichir',
			        handler: function() {
						server_status('status');
			        }
				}]
			}]
		},{				    	
			xtype: 'fieldset',
			title: 'Opérations',
			collapsible: true,
			defaults: {
				width: 600,
				layout: {
					type: 'vbox',
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
						text:'Arrêter',
				        handler: function() {
							server_status('stop');
				        }
					},{
						xtype:'box',
						html:"Force l'arrêt du serveur"
					}]
				},{
					xtype:'fieldcontainer',
					layout: {
						type: 'hbox',
						defaultMargins: {top: 5, right: 5, bottom: 5, left: 5}
					},
					items:[{
						xtype:'button',
						text:'Démarrer',
				        handler: function() {
							server_status('start');
				        }
					},{
						xtype:'box',
						html:"Démarre le serveur si celui-ci est éteint"
					}]
				}]
			}],
			listeners: {
				afterrender: {
					fn: function() {
						server_status('status');
					}
				}
			}
		}]
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelServer);
	panelServer.show();
};