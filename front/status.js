/**
 * Gestion du status des equipements
 */

function status() {
	this.panel = {
		status: function() {
			var content = {
				id: 'panelStatus',
				title : 'Liste du statut des équipements', 
				icon: 'imgs/magnifying_glass_32x32.png',
				emptyText: 'Aucun équipement trouvé',
				store: Ext.data.StoreManager.lookup('DataEquipementsStatus'),
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
				                Ext.getCmp('statusToolbarBtnMod').enable();
				            } else {
				                Ext.getCmp('statusToolbarBtnMod').disable();
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
					{text: 'Nom', dataIndex: 'equipement', width: 240, filter: {type: 'string'}, hidden: false,
						tooltip:'Nom de l\'équipement'}, 
					{text: 'Référence', dataIndex: 'reference', width: 240, filter: {type: 'string'}, hidden: false,
						tooltip:'Nom Référence Legrand'}, 
					{text: 'Bouton', dataIndex: 'Btn', width: 240, filter: {type: 'string'}, hidden: false,
						tooltip:'Nom du Bouton'}, 
					{text: 'Etat', dataIndex: 'status', width: 131, filter: {type: 'string'}, hidden: false,
						tooltip:'Etat actuel de l\'équipement'}, 
					{text: 'Mise à jour', dataIndex: 'Date', width: 150, filter: {type: 'string'}, hidden: false,
						tooltip:'Date de la dernière mise à jour'},
					{text: 'Zone', dataIndex: 'zone', width: 200, filter: {type: 'string'}, hidden: true,
						tooltip:'Zone de l\'équipement'}, 
					{text: 'Id Legrand', dataIndex: 'id_legrand', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Id de l\'équipement'},
					{text: 'Unité', dataIndex: 'unit', width: 131, filter: {type: 'numeric'}, hidden: true,
						tooltip:'Id de l\'unité'}, 
					{text: 'Id Unit Legrand', dataIndex: 'idunit', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'IdUnit Legrand'}, 
					{text: 'Id Référence', dataIndex: 'ref_legrand', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Id Référence Legrand'}, 
					{text: 'Nom Unité', dataIndex: 'nom_interne', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Nom de l\'unité'}, 
					{text: 'Possibilités', dataIndex: 'possibility', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Possibilités de l\'unité'}, 
					{text: 'Options', dataIndex: 'server_opt', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Liste des options pour la gestion des statuts'}, 
					{text: 'Unité du Statut', dataIndex: 'unit_status', width: 131, filter: {type: 'string'}, hidden: true,
						tooltip:'Référence de l\'unité qui gère le Statut'}, 
					{
					    xtype:'actioncolumn', tooltip:'Modification des paramètres',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            status.win.upd(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'statusToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer les paramètres du Statut',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelStatus').getSelectionModel().getSelection()[0];
		                        	status.win.upd(rec);
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataEquipementsStatus'),
					displayInfo: true,
					displayMsg: 'Liste des équipements {0} - {1} de {2}',
					emptyMsg: "Aucun équipement"
				})
			};
			return new Ext.grid.Panel(content);
		}
	
	};
	
	this.win = {
		upd: function(rec) {
			var winStatus = Ext.getCmp('winStatus');
			if (!winStatus) {
				winStatus = Ext.create('Ext.window.Window', {
					xtype: 'form',
					title: 'Modification des options de l\'unité',
					id: 'winStatus',
					icon: 'imgs/magnifying_glass_32x32.png',
				    closeAction: 'close',
				    items: [{
				            xtype: 'form',
				            id: 'formUpdStatus',
						    items: [status.form.opt]
				    }],
				    buttons: [{
						text: 'Annuler',
						handler: function() {
							Ext.getCmp('winStatus').close();
						}
					},{
						text: 'Enregistrer',
						id: 'winStatusBtnSave',
					}]
				});
			}
			winStatus.show();
	        var form = Ext.getCmp('formUpdStatus').getForm();
			form.reset();
	        form.setValues({
	        	server_opt:rec.get('server_opt')
	        });
			Ext.getCmp('winStatusBtnSave').setHandler(function() {
				status.func.validateUpd(rec);
			});
		}
	};
	
	this.form = {
		opt: {
			xtype: 'fieldset',
			title: 'Options de l\'unité',
			collapsible: true,
			defaults: {
				width: 500
			},
			items: [{
				xtype: 'textfield',
				name: 'server_opt',
				fieldLabel: 'Options',
				msgTarget: 'side',
				allowBlank: true
			},{
				xtype: 'panel',
				html: '<i>Le format d\'un paramêtre est "nom_parametre=valeur1,valeur2,etc"<br>\
					Les paramêtres doivent être séparés par des ";"</i><br><br>\
					<u><b>Liste des paramètres possibles :</b></u> <br>\
					<ul>\
					<li>Pour les Volets CPL et RF => "move_time=x" ou x respresente le temps en secondes pour l\'ouverture complète d\'un volet</li>\
					<li>Pour l\'interface SOMFY => "grp_opt=x,x,x" ou x représente la liste des unités regroupés sur l\'unité en cours</li>\
					<li>Pour toutes les unités CPL avec en possibiliy le mode STATUS => "upd_time=x" ou x représente l\'interval en secondes pour chaque mise à jour</li>\
					<li>Pour les inters CPL et RF => "mode=x" ou x est un des modes suivants poussoir ou inter</li>\
					<li>Pour les inters CPL et RF => "timer=x" ou x représente le nombre de secondes pour le changement d\'état du timer</li>\
					</ul>'
			}]
		}	
	};
	
	this.func = {
		panelList: function() {
			if (Ext.getCmp('panelStatus')) {
				Ext.data.StoreManager.lookup('DataEquipementsStatus').reload();
			} else {
				layout.func.clear();
				layout.func.add(status.panel.status());
				Ext.data.StoreManager.lookup('DataEquipementsStatus').reload();
			};
		},
		
		validateUpd: function(rec) {
			var form = Ext.getCmp('formUpdStatus').getForm(),
			encode = Ext.String.htmlEncode;
			if (form.isValid()) {
				var formValues = form.getValues();
				//Creation de l'envoie
				var id_legrand = rec.get('id_legrand');
				var unit = rec.get('unit');
				var server_opt = 'NULL';
				if (formValues.server_opt != '') {
					server_opt = "'"+encode(formValues.server_opt)+"'";
				}
				var params = id_legrand+","+unit+","+server_opt+"";
				requestCall('upd_equipements_status', params, {ok:'équipement modifié !', error:'impossible de modifier l\'équipement !'}, {
					onsuccess:function(response){
						Ext.getCmp('formUpdStatus').getForm().reset();
						Ext.getCmp('winStatus').close();
						Ext.data.StoreManager.lookup('DataEquipementsStatus').reload();
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
		}
	};
};

var status = new status();
