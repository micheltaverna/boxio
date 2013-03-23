/**
 * Gestion du menu principal
*/

new Ext.toolbar.Toolbar({
	id: 'Menu',
	border: false,
	frame: false,
	layout: {
        overflowHandler: 'Menu'
    },
    items: [{
		xtype: 'buttongroup',
		title: 'Utilisateur',
		defaults: {
			scale: 'large',
			iconAlign:'top'
		},
		items: [
		{
			xtype:'splitbutton',
			text: 'Equipements',
			icon: 'imgs/share_32x32.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				equipements.func.panelList();
			},
			menu: [{
				text: 'Liste des équipements',
				icon: 'imgs/share_32x32.png',
				clickEvent: 'mousedown',
				handler: function() {
					equipements.func.panelList();
				}
			},{
				text: 'Ajouter un équipement',
				icon: 'imgs/plus_alt_32x32.png',
				clickEvent: 'mousedown',
				handler: function() {
					equipements.win.add();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Commande',
			icon: 'imgs/bolt_32x32.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				createCommande('send');
			},
			menu: [{
				text: 'Exécuter une commande',
				clickEvent: 'mousedown',
				handler: function() {
					createCommande('send');
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Statut',
			icon: 'imgs/magnifying_glass_32x32.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openStatus();
			},
			menu: [{
				text: 'Vérifier le statut',
				clickEvent: 'mousedown',
				handler: function() {
					openStatus();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Favoris',
			icon: 'imgs/heart_stroke_32x28.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				favoris.func.panelList();
			},
			menu: [{
				text: 'Voir les favoris',
				icon: 'imgs/heart_stroke_32x28.png',
				clickEvent: 'mousedown',
				handler: function() {
					favoris.func.panelList();
				}
			},{
				text: 'Ajouter un favoris',
				icon: 'imgs/heart_fill_32x28.png',
				clickEvent: 'mousedown',
				handler: function() {
					favoris.win.add();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Macros',
			icon: 'imgs/list_32x28.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				macros.func.panelList();
			},
			menu: [{
				text: 'Voir les macros',
				icon: 'imgs/list_32x28.png',
				clickEvent: 'mousedown',
				handler: function() {
					macros.func.panelList();
				}
			},{
				text: 'Ajouter une macro',
				icon: 'imgs/calendar_alt_fill_32x32.png',
				clickEvent: 'mousedown',
				handler: function() {
					macros.win.add();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Jalons',
			icon: 'imgs/clock_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				cron.func.panelList();
			},
			menu: [{
				text: 'Voir les jalons',
				icon: 'imgs/clock_32x32.png',
				handler: function() {
					cron.func.panelList();
				}
			},{
				text: 'Ajouter un jalon',
				icon: 'imgs/clock_alt_fill_32x32.png',
				clickEvent: 'mousedown',
				handler: function() {
					cron.win.add();
				}
			}]
		}]
	},{
		xtype: 'buttongroup',
		title: 'Programmation',
		defaults: {
			scale: 'large',
			iconAlign:'top'
		},
		items: [{
			xtype:'splitbutton',
			text: 'Références',
			icon: 'imgs/plus_alt_32x32.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openReferences();
			},
			menu: [{
				text: 'Ajouter une référence',
				clickEvent: 'mousedown',
				handler: function() {
					openReferences();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Scénarios',
			icon: 'imgs/movie_32x32.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openScenarios();
			},
			menu: [{
				text: 'Gérer les scénarios',
				clickEvent: 'mousedown',
				handler: function() {
					openScenarios();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Déclencheurs',
			icon: 'imgs/target_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openTrigger();
			},
			menu: [{
				text: 'Créer un déclencheur',
				handler: function() {
					openTrigger();
				}
			}]
		}]
	},{
		xtype: 'buttongroup',
		title: 'Paramétrage',
		defaults: {
			scale: 'large',
			iconAlign:'top'
		},
		items: [{
			xtype:'splitbutton',
			text: 'Utilisateur',
			icon: 'imgs/user_24x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openUser();
			},
			menu: [{
				text: 'Modifier l\'utilisateur',
				handler: function() {
					openUser();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Serveur',
			icon: 'imgs/box_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				server.func.panelList();
			},
			menu: [{
				text: 'Etat du serveur',
				icon: 'imgs/box_32x32.png',
				handler: function() {
					server.func.panelList();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Mise à jours',
			icon: 'imgs/cloud_download_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				update.func.panelList();
			},
			menu: [{
				text: 'Vérifier les mises à jours',
				icon: 'imgs/box_32x32.png',
				handler: function() {
					update.func.panelList();
				}
			}]
		}]
	},{
		xtype: 'buttongroup',
		title: 'Outils',
		defaults: {
			scale: 'large',
			iconAlign:'top'
		},
		items: [{
			xtype:'splitbutton',
			text: 'Etat du Bus',
			icon: 'imgs/eye_32x24.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openTrame();
			},
			menu: [{
				text: 'Lecture du Bus',
				clickEvent: 'mousedown',
				handler: function() {
					openTrame();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Générateur de Commande',
			icon: 'imgs/cog_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				createCommande('generate');
			},
			menu: [{
				text: 'Générer une commande',
				clickEvent: 'mousedown',
				handler: function() {
					createCommande('generate');
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Documentations',
			icon: 'imgs/book_alt2_32x28.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openDoc();
			},
			menu: [{
				text: 'Boxio',
				handler: function() {
					openDoc();
				}
			}]
		}]
	},{
		xtype: 'buttongroup',
		title: 'A propo de...',
		defaults: {
			scale: 'large',
			iconAlign:'top'
		},
		items: [{
			xtype:'splitbutton',
			id: 'menuVersion',
			text: 'Version',
			icon: 'imgs/ampersand_19x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openVersion();
			},
			menu: [{
				text: 'Version',
				handler: function() {
					openVersion();
				}
			}]
		},{
			xtype:'splitbutton',
			id: 'menuAuteur',
			text: 'L\'Auteur',
			icon: 'imgs/question_mark_16x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openAuthor();
			},
			menu: [{
				text: 'L\'Auteur',
				handler: function() {
					openAuthor();
				}
			}]
		}]
	}]
});
