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
				openEquipements();
			},
			menu: [{
				text: 'Liste des équipements',
				clickEvent: 'mousedown',
				handler: function() {
					openEquipements();
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
				openFavoris();
			},
			menu: [{
				text: 'Liste des favoris',
				clickEvent: 'mousedown',
				handler: function() {
					openFavoris();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Macros',
			icon: 'imgs/list_32x28.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				openMacros();
			},
			menu: [{
				text: 'Voir les macros',
				clickEvent: 'mousedown',
				handler: function() {
					openMacros();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Jalons',
			icon: 'imgs/clock_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openCron();
			},
			menu: [{
				text: 'Voir les jalons',
				handler: function() {
					openCron();
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
			text: 'Favoris',
			icon: 'imgs/heart_fill_32x28.png',
			arrowAlign:'bottom',
			clickEvent: 'mousedown',
			handler: function() {
				createFavoris();
			},
			menu: [{
				text: 'Créer un favoris',
					clickEvent: 'mousedown',
					handler: function() {
						createFavoris();
					}
			}]
		},{
			xtype:'splitbutton',
			text: 'Macros',
			icon: 'imgs/calendar_alt_fill_32x32.png',
			arrowAlign:'bottom',
			menu: [{text: 'Créer une macro'}]
		},{
			xtype:'splitbutton',
			text: 'Jalons',
			icon: 'imgs/clock_alt_fill_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				createCron();
			},
			menu: [{
				text: 'Ajouter un jalon',
				handler: function() {
					createCron();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Déclencheurs',
			icon: 'imgs/target_32x32.png',
			arrowAlign:'bottom',
			menu: [{text: 'Créer un déclencheur'}]
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
			menu: [{text: 'Modifier l\'utilisateur'}]
		},{
			xtype:'splitbutton',
			text: 'Serveur',
			icon: 'imgs/box_32x32.png',
			arrowAlign:'bottom',
			handler: function() {
				openServer();
			},
			menu: [{
				text: 'Etat du serveur',
				handler: function() {
					openServer();
				}
			}]
		},{
			xtype:'splitbutton',
			text: 'Mise à jours',
			icon: 'imgs/cloud_download_32x32.png',
			arrowAlign:'bottom',
			menu: [{text: 'Vérifier les mises à jours'}]
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
			menu: [{text: 'Legrand'}]
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
			clickEvent: 'mousedown',
			handler: function() {
				openVersion();
			},
			menu: [{
				text: 'Version',
				clickEvent: 'mousedown',
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
			clickEvent: 'mousedown',
			handler: function() {
				openAuthor();
			},
			menu: [{
				text: 'L\'Auteur',
				clickEvent: 'mousedown',
				handler: function() {
					openAuthor();
				}
			}]
		}]
	}]
});
