function cron() {
	this.panel = {
		macros: function() {
			var content = {
				title : 'Liste des macros enregistrées', 
				store: Ext.data.StoreManager.lookup('DataMacros'),
				disableSelection: false,
				loadMask: true,
				width: '100%',
				icon: 'imgs/list_32x28.png',
				autoScroll: true,
				closable: false,
				features: [{
			        ftype: 'filters',
			        encode: true,
			        local: false,
					phpMode: true
			    },{
			        ftype: 'groupingsummary',
			        groupHeaderTpl: [
			        	'{columnName}: {name} ({rows.length} commande{[values.rows.length > 1 ? "s" : ""]})'+
		        	    '<span> - <a href="#" class="buttonTpl" onclick="{rows:this.formatClick}"><span class="accept">Sélectionner</span></a></span>',
		        	    {
			        		formatClick: function (rows) {
			        			var id_macro = rows[0].data.id_macro;
			        			var nom = rows[0].data.nom;
			        			return "\
			        			var form=Ext.getCmp('formAddCron').getForm();\
			        			var values=form.getValues();\
			        			var apply=true;\
			        			if (values.favoris != ''){\
			        				Ext.MessageBox.confirm('Confirmation','Vous avez déjà inscrit un Favoris, voulez-vous le remplacer par cette Macro ?', function(res) {\
			        					if (res == 'yes') {\
					        				form.setValues({macros:"+id_macro+",favoris:'',trame:''});\
					        				Ext.getCmp('formCronFavorisNom').update('&nbsp;');\
					        				Ext.getCmp('formCronMacrosNom').update('<span><i>"+nom+"</i></span>');\
					        			}\
			        				});\
			        			} else if (values.trame != ''){\
			        				Ext.MessageBox.confirm('Confirmation','Vous avez déjà inscrit une Trame, voulez-vous la remplacer par cette Macro ?', function(res) {\
			        					if (res == 'yes') {\
					        				form.setValues({macros:"+id_macro+",favoris:'',trame:''});\
					        				Ext.getCmp('formCronFavorisNom').update('&nbsp;');\
					        				Ext.getCmp('formCronMacrosNom').update('<span><i>"+nom+"</i></span>');\
					        			}\
			        				});\
			        			} else {\
			        				form.setValues({macros:"+id_macro+",favoris:'',trame:''});\
			        				Ext.getCmp('formCronFavorisNom').update('&nbsp;');\
			        				Ext.getCmp('formCronMacrosNom').update('<span><i>"+nom+"</i></span>');\
			        			}\
			        			";
			        		}
			        	}
		        	],
			        hideGroupedHeader: false,
			        startCollapsed: true,
			        enableGroupingMenu: true
			    }],
				columns: [
					{text: 'Id de la Commande', dataIndex: 'id_command', width: 131, hidden: true, filter: {type: 'string'}},
					{text: 'Id de la Macro', dataIndex: 'id_macro', width: 131, hidden: true, filter: {type: 'string'}}, 
					{text: 'Nom de la Macro', dataIndex: 'nom', width: 350, hidden: true, filter: {type: 'string'}},
					{text: 'Id du Favoris', dataIndex: 'id_favoris', hidden: true, width: 131, filter: {type: 'string'}}, 
					{text: 'Nom de la Commande', dataIndex: 'nom_command', width: 200, filter: {type: 'string'}},
					{text: 'Trame executée', dataIndex: 'trame', width: 131, hidden: true, filter: {type: 'string'}}, 
					{text: 'Temporisation', dataIndex: 'timing', width: 200, filter: {type: 'numeric'}, renderer: function(val) {
						if (val == 0) {
							return '<span style="font-style:italic;">Immédiat</span>';
						} else if (val == 1) {
							return '<span style="font-style:italic;">'+val+'<sup>ère</sup> seconde</span>';
						} else {
							return '<span style="font-style:italic;">'+val+'<sup>ème</sup> secondes</span>';
						}
					}}
				],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataMacros'),
					displayInfo: true,
					displayMsg: 'Liste des macros {0} - {1} de {2}',
					emptyMsg: "Aucune macros"
				})
			};
			return new Ext.grid.Panel(content);
		},
		
		favoris: function() {
			var content = {
				id: 'winCronPanelFavoris',
				title : 'Liste des favoris enregistrés', 
				store: Ext.data.StoreManager.lookup('DataFavoris'),
				disableSelection: false,
				loadMask: true,
				width: '100%',
				icon: 'imgs/heart_stroke_32x28.png',
				autoScroll: true,
				closable: false,
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
					{
						text: 'Nom', 
						dataIndex: 'nom', 
						width: 390,
						filter: {
							type: 'string'
						}
					},{
						text: 'Référence', dataIndex: 'id', width: 75, hidden: true,
						filter: {
							type: 'string'
						}
					},{
					    xtype:'actioncolumn',
						text: 'Séléction',
						align: 'right',
						width: 80,
					    items: [{
					        icon: 'imgs/accept.png',
					        tooltip: 'Séléctionner',
					        handler: function(grid, rowIndex, colIndex) {
					        	var rec = grid.getStore().getAt(rowIndex);
					        	var form = Ext.getCmp('formAddCron').getForm();
			        			var values = form.getValues();
			        			if (values.macros != '') {
			        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit une Macro, voulez-vous la remplacer par ce Favoris ?', function(res) {
			        					if (res == 'yes') { 
			    				            form.setValues({favoris:rec.get('id'),macros:'',trame:''});
			    				            Ext.getCmp('formCronFavorisNom').update('<span style="font-style:italic;">'+rec.get('nom')+'</span>');
			    							Ext.getCmp('formCronMacrosNom').update('&nbsp;');
			        					}
			        				});
			        			} else if (values.trame != '') {
			        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit une Trame, voulez-vous la remplacer par ce Favoris ?', function(res) {
			        					if (res == 'yes') { 
			    				            form.setValues({favoris:rec.get('id'),macros:'',trame:''});
			    				            Ext.getCmp('formCronFavorisNom').update('<span style="font-style:italic;">'+rec.get('nom')+'</span>');
			    							Ext.getCmp('formCronMacrosNom').update('&nbsp;');
			    						}
			        				});
			        			} else {
						            form.setValues({favoris:rec.get('id'),macros:'',trame:''});
						            Ext.getCmp('formCronFavorisNom').update('<span style="font-style:italic;">'+rec.get('nom')+'</span>');
									Ext.getCmp('formCronMacrosNom').update('&nbsp;');
			        			}
					        }
					    }]
					},{
						text: 'trame', 
						dataIndex: 'trame', 
						width: 200,
						hidden: true
					}
				],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataFavoris'),
					displayInfo: true,
					displayMsg: 'Liste des favoris {0} - {1} de {2}',
					emptyMsg: "Aucun favoris"
				})
			};
			return new Ext.grid.Panel(content);
		},
		
		cron: function() {
			var content = {
				id: 'panelCron',
				title : 'Liste des jalons enregistrés', 
				icon: 'imgs/clock_32x32.png',
				emptyText: 'Aucun jalon trouvé',
				store: Ext.data.StoreManager.lookup('DataCron'),
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
				                Ext.getCmp('cronsToolbarBtnDel').enable();
				                Ext.getCmp('cronsToolbarBtnMod').enable();
				            } else {
				                Ext.getCmp('cronsToolbarBtnDel').disable();
				                Ext.getCmp('cronsToolbarBtnMod').disable();
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
			        groupHeaderTpl: '{columnName}: {name} ({rows.length} jalon{[values.rows.length > 1 ? "s" : ""]})',
			        hideGroupedHeader: false,
			        enableGroupingMenu: true
			    }],
				columns: [
					{text: 'Id Cron', dataIndex: 'id_cron', width: 131, hidden: true, filter: {type: 'string'},
						tooltip:'Identifiant du Jalon'},
					{text: 'Nom', dataIndex: 'nom', width: 131, filter: {type: 'string'},
						tooltip:'Nom du Jalon'},
					{text: 'Horodatage', dataIndex: 'readCron', width: 500,
							tooltip:'Horodatage complet des executions'},
					{text: 'Minutes', dataIndex: 'minutes', width: 131, hidden: true, filter: {type: 'string'},
							tooltip:'Selection des minutes'}, 
					{text: 'Heures', dataIndex: 'heures', width: 131, hidden: true, filter: {type: 'string'},
							tooltip:'Selection des heures'},
					{text: 'Jours du mois', dataIndex: 'jour', width: 131, hidden: true, filter: {type: 'string'},
							tooltip:'Selection des jours du mois'}, 
					{text: 'Jours de la Semaine', dataIndex: 'jourSemaine', width: 131, hidden: true, filter: {type: 'string'},
							tooltip:'Selection des jours de la semaine'},
					{text: 'Mois', dataIndex: 'mois', width: 131, hidden: true, filter: {type: 'string'},
							tooltip:'Selection des mois'},
					{text: 'Id du favoris', dataIndex: 'id_favoris', width: 131, hidden: true, filter: {type: 'string'}, 
							renderer: function(val) {
								if (val == 0) {
									return 'Aucun';
								}
								return val;
							},
							tooltip:'Identifiant du Favoris'}, 
					{text: 'Nom du favoris', dataIndex: 'nom_favoris', width: 131, hidden: false, filter: {type: 'string'}, 
							renderer: function(val) {
								if (val == 0) {
									return 'Aucun';
								}
								return val;
							},
							tooltip:'Nom du Favoris'}, 
					{text: 'Id de la Macro', dataIndex: 'id_macro', width: 131, hidden: true, filter: {type: 'string'},
							renderer: function(val) {
								if (val == 0) {
									return 'Aucun';
								}
								return val;
							},
							tooltip:'Identifiant de la Macro'},
					{text: 'Nom de la Macro', dataIndex: 'nom_macro', width: 131, hidden: false, filter: {type: 'string'},
						renderer: function(val) {
							if (val == 0) {
								return 'Aucun';
							}
							return val;
						},
						tooltip:'Nom de la Macro'},
					{text: 'Trame', dataIndex: 'trame', width: 131, hidden: false, filter: {type: 'string'},
							tooltip:'Trame à éxecuter'}, 
					{text: 'Actif', dataIndex: 'active', width: 65, filter: {type: 'boolean'}, 
							renderer: function(val) {
								if (val == 1) {
									return '<span style="color:green;"><b>OUI</b></span>';
								} else {
									return '<span style="color:red;"><b>NON</b></span>';					
								}
							},
							tooltip:'Si le Jalon est actif ou non'},
					{
					    xtype:'actioncolumn', tooltip:'Opération sur le jalon',
						text: 'Action', width: 70,
					    items: [{
					        icon: 'imgs/edit.png',
					        tooltip: 'Editer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            cron.win.upd(rec);
					        }
					    },{
					        icon: 'imgs/delete.png',
					        tooltip: 'Effacer',
					        handler: function(grid, rowIndex, colIndex) {
					            var rec = grid.getStore().getAt(rowIndex);
					            cron.func.del(rec);
					        }
					    }]
					}
				],
				dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
		                    	id:'cronsToolbarBtnAdd',
		                    	icon: 'imgs/add.png',
		                        text: 'Ajouter',
		                        tooltip:'Ajouter un jalon',
		                        disabled: false,
		                        handler: function(widget, event) {
		                        	cron.win.add();
		                        }
		                    },{
		                    	id:'cronsToolbarBtnMod',
		                    	icon: 'imgs/edit.png',
		                        text: 'Editer',
		                        tooltip:'Editer le jalon',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelCron').getSelectionModel().getSelection()[0];
		                        	cron.win.upd(rec);
		                        }
		                    },{
		                    	id:'cronsToolbarBtnDel',
		                    	icon: 'imgs/delete.png',
		                        text: 'Effacer',
		                        tooltip:'Effacer le jalon',
		                        disabled: true,
		                        handler: function(widget, event) {
		                        	var rec = Ext.getCmp('panelCron').getSelectionModel().getSelection()[0];
		                        	cron.func.del(rec);
		                        }
		                    }]
		        }],
				bbar: Ext.create('Ext.PagingToolbar', {
					store: Ext.data.StoreManager.lookup('DataCron'),
					displayInfo: true,
					displayMsg: 'Liste des jalons {0} - {1} de {2}',
					emptyMsg: "Aucun jalon"
				})
			};
			return new Ext.grid.Panel(content);
		}
	},

	this.win = {
		add: function() {
			var winCron = Ext.getCmp('winCron');
			if (!winCron) {
				winCron = Ext.create('Ext.window.Window', {
					xtype: 'form',
					id: 'winCron',
					icon: 'imgs/clock_alt_fill_32x32.png',
				    items: [{
				            xtype: 'form',
				            id: 'formAddCron',
						    items: [cron.form.ref, cron.form.date, cron.form.action()]
				    }],
				    buttons: [{
						text: 'Effacer',
						id: 'winCronBtnClear',
						handler: function() {
				            Ext.getCmp('formCronFavorisNom').update('&nbsp;');
							Ext.getCmp('formCronMacrosNom').update('&nbsp;');
							Ext.getCmp('formAddCron').getForm().reset();
						}
					},{
						text: 'Annuler',
						handler: function() {
							Ext.getCmp('winCron').close();
						}
					},{
						text: 'Enregistrer',
						id: 'winCronBtnSave',
						handler: function() {
							cron.func.validateAdd();
						}
					}]
				});
			}
			winCron.show();
			Ext.data.StoreManager.lookup('DataFavoris').reload();
			Ext.data.StoreManager.lookup('DataMacros').reload();
			Ext.getCmp('formAddCron').getForm().reset();
			winCron.setTitle('Ajout d\'un jalon');
			Ext.getCmp('winCronBtnClear').show();
	        Ext.getCmp('formRefNomaddCron').enable(true);
			Ext.getCmp('formCronFavorisNom').update('&nbsp;');
			Ext.getCmp('formCronMacrosNom').update('&nbsp;');
			Ext.getCmp('winCronBtnSave').setHandler(function() {
				cron.func.validateAdd();
			});
		},

		upd: function(rec) {
			cron.win.add();
			var winCron = Ext.getCmp('winCron');
			winCron.setTitle('Modification d\'un jalon');
	        var form = Ext.getCmp('formAddCron').getForm();
	    	Ext.getCmp('formCronFavorisNom').update('&nbsp;');
	    	Ext.getCmp('formCronMacrosNom').update('&nbsp;');
	        if (rec.get('id_favoris')!='0') {
	        	Ext.getCmp('formCronFavorisNom').update('<span><i>'+rec.get('nom_favoris')+'</i></span>');
	        }
	        if (rec.get('id_macro')!='0') {
	        	Ext.getCmp('formCronMacrosNom').update('<span><i>'+rec.get('nom_macro')+'</i></span>');
	        }
	        Ext.getCmp('formRefNomaddCron').disable(true);
			Ext.getCmp('winCronBtnClear').hide();
			Ext.getCmp('winCronBtnSave').setHandler(function() {
				cron.func.validateUpd();
			});
	        var active = rec.get('active')=='0'?'non':'oui';
	        var favoris = rec.get('id_favoris')=='0'?'':rec.get('id_favoris');
	        var macro = rec.get('id_macro')=='0'?'':rec.get('id_macro');
	        form.setValues({
	        	nom:rec.get('nom'),
	        	minutes:rec.get('minutes'),
	        	heures:rec.get('heures'),
	        	jour:rec.get('jour'),
	        	jourSemaine:rec.get('jourSemaine'),
	        	mois:rec.get('mois'),
	        	favoris:favoris,
	        	macros:macro,
	        	trame:rec.get('trame'),
	        	active:active
	        });
		},
		
		dayOfMonth: function() {
			var selectDayOfMonth = Ext.getCmp('selectDayOfMonth');
			if (!selectDayOfMonth) {
				selectDayOfMonth = Ext.create('Ext.window.Window', {
					id: 'selectDayOfMonth',
				    title: 'Selection des jours du mois',
				    closeAction: 'destroy',
					listeners: {
						afterrender: {
							fn: function() {
								Ext.get(Ext.query('.select_day_of_month td')).on('mousedown', function(e, t, o) {
									Ext.get(t).toggleCls('selected_day_of_month');
								});
							}
						},			
						afterlayout: {
							fn: function() {
					        	Ext.get(Ext.query('.select_day_of_month td')).removeCls('selected_day_of_month');
							}
						}
			
					},
				    items: [{
				        html : "<table class='select_day_of_month'><thead><tr><th colspan='7'>Cliquer pour choisir un jour</th></tr></thead><tbody>" +
				        		"<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>" +
				        		"<tr><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>" +
				        		"<tr><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td></tr>" +
				        		"<tr><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td></tr>" +
				        		"<tr><td>29</td><td>30</td><td>31</td></tr>" +
				        		"</tbody></table>"    
				    }],
				    buttons: [{
				        text: 'Tous les jours',
				        handler: function() {
				        	Ext.get(Ext.query('.select_day_of_month td')).addCls('selected_day_of_month');
				        }
					},{
				        text: 'Effacer la selection',
				        handler: function() {
				        	Ext.get(Ext.query('.select_day_of_month td')).removeCls('selected_day_of_month');
				        }
					},{
				        text: 'Valider',
				        handler: function() {
				        	var elems = Ext.select('.selected_day_of_month');
				        	var res = [];
				        	for (var elem in elems.elements) {
				            	res.push(elems.elements[elem].firstChild.data);
				        	}
				        	var ret = '';
				        	if (res.length == 0) {
				        		Ext.Msg.show({
				        			icon: Ext.Msg.ERROR,
				        			title: 'Erreur',
				        			buttons: Ext.Msg.OK,
				        			msg: 'Séléctionner au moins un jour !'
					            });
				            	return;
				        	}
				        	if (res.length == 31) {
				            	ret = '*';
				        	} else {
				            	for (var i=0; res[i]; i++) {
				                	if (ret != '') {
				                    	ret += ',';
				                	}
				                	if (res[i+1] == parseInt(res[i])+1 && res[i+2] == parseInt(res[i])+2) {
				                		ret += res[i]+'-';
				                		while (res[i+1] == parseInt(res[i])+1) {
				                    		i++;
				                		}
				                	}
				            		ret += res[i];
				            	}
				        	}
				            var form = Ext.getCmp('formAddCron').getForm();
				            form.setValues({jour:ret});
				            Ext.getCmp('selectDayOfMonth').close();
				        }
				    }]
				});
			}
			selectDayOfMonth.show();		
		},
		
		minutes: function() {
			var selectMinutes = Ext.getCmp('selectMinutes');
			if (!selectMinutes) {
				selectMinutes = Ext.create('Ext.window.Window', {
					id: 'selectMinutes',
				    title: 'Selection des minutes',
				    closeAction: 'destroy',
					listeners: {
						afterrender: {
							fn: function() {
								Ext.get(Ext.query('.select_minutes td')).on('mousedown', function(e, t, o) {
									Ext.get(t).toggleCls('selected_minutes');
								});
							}
						},			
						afterlayout: {
							fn: function() {
					        	Ext.get(Ext.query('.select_minutes td')).removeCls('selected_minutes');
							}
						}
			
					},
				    items: [{
				        html : "<table class='select_minutes'><thead><tr><th colspan='10'>Cliquer pour choisir une minute</th></tr></thead><tbody>" +
				        		"<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td></tr>" +
				        		"<tr><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr>" +
				        		"<tr><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td></tr>" +
				        		"<tr><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td><td>36</td><td>37</td><td>38</td><td>39</td><td>40</td></tr>" +
				        		"<tr><td>41</td><td>42</td><td>43</td><td>44</td><td>45</td><td>46</td><td>47</td><td>48</td><td>49</td><td>50</td></tr>" +
				        		"<tr><td>51</td><td>52</td><td>53</td><td>54</td><td>55</td><td>56</td><td>57</td><td>58</td><td>59</td><td>0</td></tr>" +
				        		"</tbody></table>"
				    }],
				    buttons: [{
				        text: 'Toutes les minutes',
				        handler: function() {
				        	Ext.get(Ext.query('.select_minutes td')).addCls('selected_minutes');
				        }
					},{
				        text: 'Effacer la selection',
				        handler: function() {
				        	Ext.get(Ext.query('.select_minutes td')).removeCls('selected_minutes');
				        }
					},{
				        text: 'Valider',
				        handler: function() {
				        	var elems = Ext.select('.selected_minutes');
				        	var res = [];
				        	for (var elem in elems.elements) {
				            	res.push(elems.elements[elem].firstChild.data);
				        	}
				        	var ret = '';
				        	if (res.length == 0) {
				        		Ext.Msg.show({
				        			icon: Ext.Msg.ERROR,
				        			title: 'Erreur',
				        			buttons: Ext.Msg.OK,
				        			msg: 'Séléctionner au moins une minute !'
					            });
				            	return;
				        	}
				        	if (res.length == 60) {
				            	ret = '*';
				        	} else {
				            	for (var i=0; res[i]; i++) {
				                	if (ret != '') {
				                    	ret += ',';
				                	}
				                	if (res[i+1] == parseInt(res[i])+1 && res[i+2] == parseInt(res[i])+2) {
				                		ret += res[i]+'-';
				                		while (res[i+1] == parseInt(res[i])+1) {
				                    		i++;
				                		}
				                	}
				            		ret += res[i];
				            	}
				        	}
				            var form = Ext.getCmp('formAddCron').getForm();
				            form.setValues({minutes:ret});
				            Ext.getCmp('selectMinutes').close();
				        }
				    }]
				});
			}
			selectMinutes.show();
		},
		
		hours: function() {
			var selectHours = Ext.getCmp('selectHours');
			if (!selectHours) {
				selectHours = Ext.create('Ext.window.Window', {
					id: 'selectHours',
				    title: 'Selection des heures',
				    closeAction: 'destroy',
					listeners: {
						afterrender: {
							fn: function() {
								Ext.get(Ext.query('.select_hours td')).on('mousedown', function(e, t, o) {
									Ext.get(t).toggleCls('selected_hours');
								});
							}
						},			
						afterlayout: {
							fn: function() {
					        	Ext.get(Ext.query('.select_hours td')).removeCls('selected_hours');
							}
						}
			
					},
				    items: [{
				        html : "<table class='select_hours'><thead><tr><th colspan='12'>Cliquer pour choisir une heure</th></tr></thead><tbody>" +
				        		"<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td></tr>" +
				        		"<tr><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>0</td></tr>" +
				        		"</tbody></table>"
				    }],
				    buttons: [{
				        text: 'Toutes les heures',
				        handler: function() {
				        	Ext.get(Ext.query('.select_hours td')).addCls('selected_hours');
				        }
					},{
				        text: 'Effacer la selection',
				        handler: function() {
				        	Ext.get(Ext.query('.select_hours td')).removeCls('selected_hours');
				        }
					},{
				        text: 'Valider',
				        handler: function() {
				        	var elems = Ext.select('.selected_hours');
				        	var res = [];
				        	for (var elem in elems.elements) {
				            	res.push(elems.elements[elem].firstChild.data);
				        	}
				        	var ret = '';
				        	if (res.length == 0) {
				        		Ext.Msg.show({
				        			icon: Ext.Msg.ERROR,
				        			title: 'Erreur',
				        			buttons: Ext.Msg.OK,
				        			msg: 'Séléctionner au moins une heure !'
					            });
				            	return;
				        	}
				        	if (res.length == 24) {
				            	ret = '*';
				        	} else {
				            	for (var i=0; res[i]; i++) {
				                	if (ret != '') {
				                    	ret += ',';
				                	}
				                	if (res[i+1] == parseInt(res[i])+1 && res[i+2] == parseInt(res[i])+2) {
				                		ret += res[i]+'-';
				                		while (res[i+1] == parseInt(res[i])+1) {
				                    		i++;
				                		}
				                	}
				            		ret += res[i];
				            	}
				        	}
				            var form = Ext.getCmp('formAddCron').getForm();
				            form.setValues({heures:ret});
				            Ext.getCmp('selectHours').close();
				        }
				    }]
				});
			} 
			selectHours.show();
		},
		
		dayOfWeek: function() {
			var dayToNumber = {
					'Lundi':1,
					'Mardi':2,
					'Mercredi':3,
					'Jeudi':4,
					'Vendredi':5,
					'Samedi':6,
					'Dimanche':7
			};
			var selectDayOfWeek = Ext.getCmp('selectDayOfWeek');
			if (!selectDayOfWeek) {
				selectDayOfWeek = Ext.create('Ext.window.Window', {
					id: 'selectDayOfWeek',
				    title: 'Selection des jours de la semaine',
				    closeAction: 'destroy',
					listeners: {
						afterrender: {
							fn: function() {
								Ext.get(Ext.query('.select_day_of_week td')).on('mousedown', function(e, t, o) {
									Ext.get(t).toggleCls('selected_day_of_week');
								});
							}
						},			
						afterlayout: {
							fn: function() {
					        	Ext.get(Ext.query('.select_day_of_week td')).removeCls('selected_day_of_week');
							}
						}
			
					},
				    items: [{
				        html : "<table class='select_day_of_week'><thead><tr><th colspan='5'>Cliquer pour choisir le jour</th></tr></thead><tbody>" +
				        		"<tr><td>Lundi</td><td>Mardi</td><td>Mercredi</td><td>Jeudi</td><td>Vendredi</td></tr>" +
				        		"<tr><td>Samedi</td><td>Dimanche</td></tr>" +
				        		"</tbody></table>"
				    }],
				    buttons: [{
				        text: 'Toutes les jours',
				        handler: function() {
				        	Ext.get(Ext.query('.select_day_of_week td')).addCls('selected_day_of_week');
				        }
					},{
				        text: 'Effacer la selection',
				        handler: function() {
				        	Ext.get(Ext.query('.select_day_of_week td')).removeCls('selected_day_of_week');
				        }
					},{
				        text: 'Valider',
				        handler: function() {
				        	var elems = Ext.select('.selected_day_of_week');
				        	var res = [];
				        	for (var elem in elems.elements) {
				        		var dayNum = dayToNumber[elems.elements[elem].firstChild.data];
				            	res.push(dayNum);
				        	}
				        	var ret = '';
				        	if (res.length == 0) {
				        		Ext.Msg.show({
				        			icon: Ext.Msg.ERROR,
				        			title: 'Erreur',
				        			buttons: Ext.Msg.OK,
				        			msg: 'Séléctionner au moins un jour !'
					            });
				            	return;
				        	}
				        	if (res.length == 7) {
				            	ret = '*';
				        	} else {
				            	for (var i=0; res[i]; i++) {
				                	if (ret != '') {
				                    	ret += ',';
				                	}
				                	if (res[i+1] == parseInt(res[i])+1 && res[i+2] == parseInt(res[i])+2) {
				                		ret += res[i]+'-';
				                		while (res[i+1] == parseInt(res[i])+1) {
				                    		i++;
				                		}
				                	}
				            		ret += res[i];
				            	}
				        	}
				            var form = Ext.getCmp('formAddCron').getForm();
				            form.setValues({jourSemaine:ret});
				            Ext.getCmp('selectDayOfWeek').close();
				        }
				    }]
				});
			}
			selectDayOfWeek.show();
		},
		
		month: function() {
			var monthToNumber = {
					'Janvier':1,
					'Février':2,
					'Mars':3,
					'Avril':4,
					'Mai':5,
					'Juin':6,
					'Juillet':7,
					'Août':8,
					'Septembre':9,
					'Octobre':10,
					'Novembre':11,
					'Décembre':12
			};
			var selectMonth = Ext.getCmp('selectMonth');
			if (!selectMonth) {
				selectMonth = Ext.create('Ext.window.Window', {
					id: 'selectMonth',
				    title: 'Selection des mois',
				    closeAction: 'destroy',
					listeners: {
						afterrender: {
							fn: function() {
								Ext.get(Ext.query('.select_month td')).on('mousedown', function(e, t, o) {
									Ext.get(t).toggleCls('selected_month');
								});
							}
						},			
						afterlayout: {
							fn: function() {
					        	Ext.get(Ext.query('.select_month td')).removeCls('selected_month');
							}
						}
			
					},
				    items: [{
				        html : "<table class='select_month'><thead><tr><th colspan='6'>Cliquer pour choisir un mois</th></tr></thead><tbody>" +
				        		"<tr><td>Janvier</td><td>Février</td><td>Mars</td><td>Avril</td><td>Mai</td><td>Juin</td></tr>" +
				        		"<tr><td>Juillet</td><td>Août</td><td>Septembre</td><td>Octobre</td><td>Novembre</td><td>Décembre</td></tr>" +
				        		"</tbody></table>"
				    }],
				    buttons: [{
				        text: 'Tous les mois',
				        handler: function() {
				        	Ext.get(Ext.query('.select_month td')).addCls('selected_month');
				        }
					},{
				        text: 'Effacer la selection',
				        handler: function() {
				        	Ext.get(Ext.query('.select_month td')).removeCls('selected_month');
				        }
					},{
				        text: 'Valider',
				        handler: function() {
				        	var elems = Ext.select('.selected_month');
				        	var res = [];
				        	for (var elem in elems.elements) {
				        		var monthNum = monthToNumber[elems.elements[elem].firstChild.data];
				            	res.push(monthNum);
				        	}
				        	var ret = '';
				        	if (res.length == 0) {
				        		Ext.Msg.show({
				        			icon: Ext.Msg.ERROR,
				        			title: 'Erreur',
				        			buttons: Ext.Msg.OK,
				        			msg: 'Séléctionner au moins un mois !'
					            });
				            	return;
				        	}
				        	if (res.length == 12) {
				            	ret = '*';
				        	} else {
				            	for (var i=0; res[i]; i++) {
				                	if (ret != '') {
				                    	ret += ',';
				                	}
				                	if (res[i+1] == parseInt(res[i])+1 && res[i+2] == parseInt(res[i])+2) {
				                		ret += res[i]+'-';
				                		while (res[i+1] == parseInt(res[i])+1) {
				                    		i++;
				                		}
				                	}
				            		ret += res[i];
				            	}
				        	}
				            var form = Ext.getCmp('formAddCron').getForm();
				            form.setValues({mois:ret});
				            Ext.getCmp('selectMonth').close();
				        }
				    }]
				});
			}
			selectMonth.show();
		}
	};

	this.form = {
		ref: {
			xtype: 'fieldset',
			title: 'Référence du Jalon',
			collapsible: true,
			defaults: {
				width: 500,
				columns: 4
			},
			items: [{
				xtype: 'textfield',
				id: 'formRefNomaddCron',
				name: 'nom',
				fieldLabel: 'Nom',
				msgTarget: 'side',
				allowBlank: false
			},{
				xtype: 'radiogroup',
				fieldLabel: 'Activation',
				items: [{
					xtype: 'radiofield',
					name: 'active',
					inputValue: 'oui',
					checked: true,
					boxLabel: 'oui'
				},{
					xtype: 'radiofield',
					name: 'active',
					inputValue: 'false',
					boxLabel: 'non'
				}]
			}]
		},
		date: {
			xtype: 'fieldset',
			title: 'Horodatage du Jalon',
			collapsible: true,
			defaults: {
				width: 500,
				layout: {
					type: 'hbox',
					defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
				}
			},
			items: [{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					flex: 4,
					name: 'minutes',
					fieldLabel: 'Minutes',
					msgTarget: 'side',
					labelWidth: 120,
					allowBlank: false
				},{
					xtype: 'button',
					flex: 1,
					text: 'Séléction',
			        icon: 'imgs/accept.png',
			        iconAlign: 'left',
					tooltip: 'Selection des minutes',
					handler: function() {
						cron.win.minutes();
				    }
				}]
			},{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					flex: 4,
					name: 'heures',
					fieldLabel: 'Heures',
					msgTarget: 'side',
					labelWidth: 120,
					allowBlank: false
				},{
					xtype: 'button',
					flex: 1,
					text: 'Séléction',
			        icon: 'imgs/accept.png',
			        iconAlign: 'left',
					tooltip: 'Selection des heures',
					handler: function() {
						cron.win.hours();
				    }
				}]
			},{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					flex: 4,
					name: 'jour',
					fieldLabel: 'Jours du mois',
					msgTarget: 'side',
					labelWidth: 120,
					allowBlank: false
				},{
					xtype: 'button',
					flex: 1,
					text: 'Séléction',
			        icon: 'imgs/accept.png',
			        iconAlign: 'left',
					tooltip: 'Selection des jours du mois',
					handler: function() {
						cron.win.dayOfMonth();
				    }
				}]
			},{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					flex: 4,
					name: 'jourSemaine',
					fieldLabel: 'Jours de la semaine',
					labelWidth: 120,
					msgTarget: 'side',
					allowBlank: false
				},{
					xtype: 'button',
					flex: 1,
					text: 'Séléction',
			        icon: 'imgs/accept.png',
			        iconAlign: 'left',
					tooltip: 'Selection des jours de la semaine',
					handler: function() {
						cron.win.dayOfWeek();
				    }
				}]
			},{
				xtype: 'fieldcontainer',
				items: [{
					xtype: 'textfield',
					flex: 4,
					name: 'mois',
					fieldLabel: 'Mois',
					msgTarget: 'side',
					labelWidth: 120,
					allowBlank: false
				},{
					xtype: 'button',
					flex: 1,
					text: 'Séléction',
			        icon: 'imgs/accept.png',
			        iconAlign: 'left',
					tooltip: 'Selection des mois',
					handler: function() {
						cron.win.month();
				    }
				}]
			}]
		},
		
		action: function() {
			var content = {
				title: 'Action du Jalon',
				collapsible: true,
				items: [{
					xtype: 'tabpanel',
					plain:true,
					width:500,
			        items: [{
						title: 'Favoris',
						id: 'formAddCronTabFavoris',
						items: [{
							xtype: 'fieldset',
							padding: 0,
							margin: 0,
							border: 0,
							defaults: {
								layout: 'hbox',
								padding: 0,
								margin: 0
							},
							items: [
							{
								xtype: 'fieldcontainer',
								margin: 5,
								items: [{
									xtype: 'textfield',
									flex: 2,
									fieldLabel: 'Référence du Favoris',
									msgTarget: 'side',
									labelWidth : 120,
									name: 'favoris',
									allowBlank: true
								},{
									xtype: 'box',
									id: 'formCronFavorisNom',
									flex: 2,
									border: 0,
									margin: 2,
									html: ''
								},{
									xtype: 'button',
									margin: '0 0 0 5',
									flex: 1,
							        icon: 'imgs/delete.png',
							        iconAlign: 'left',
									text: 'Effacer',
									tooltip: 'Efface la selection du favoris en cours',
									handler: function() {
										Ext.getCmp('formAddCron').getForm().setValues({favoris:null});
										Ext.getCmp('formCronFavorisNom').update('&nbsp;');
									}
								}]
							},{
								xtype: 'fieldcontainer',
								items: [
								        cron.panel.favoris()
								        ]
							}
							]
						}
						]
					},{
						title: 'Macros',
						id: 'formAddCronTabMacros',
						items: [{
							xtype: 'fieldset',
							padding: 0,
							margin: 0,
							border: 0,
							defaults: {
								layout: 'hbox',
								padding: 0,
								margin: 0
							},
							items: [
							{
								xtype: 'fieldcontainer',
								margin: 5,
								items: [{
									xtype: 'textfield',
									flex: 2,
									fieldLabel: 'Référence de la Macros',
									msgTarget: 'side',
									labelWidth : 140,
									name: 'macros',
									allowBlank: true
								},{
									xtype: 'box',
									id: 'formCronMacrosNom',
									flex: 2,
									border: 0,
									margin: 2,
									html: ''
								},{
									xtype: 'button',
									margin: '0 0 0 5',
									flex: 1,
							        icon: 'imgs/delete.png',
							        iconAlign: 'left',
									text: 'Effacer',
									tooltip: 'Efface la selection de la Macro en cours',
									handler: function() {
										Ext.getCmp('formAddCron').getForm().setValues({macros:null});
										Ext.getCmp('formCronMacrosNom').update('&nbsp;');
									}
								}]
							},{
								xtype: 'fieldcontainer',
								items: [
								        cron.panel.macros()
								        ]
							}
							]
						}
						]
					},{
						title: 'Trame',
						id: 'formAddCronTabTrame',
						items: [{
							xtype: 'textfield',
							width: 450,
							labelWidth: 50,
				            padding: 10,
							name: 'trame',
							fieldLabel: 'Trame',
							msgTarget: 'side',
							allowBlank: true,
							listeners: {
								change: {
						            fn: function(elem, new_value, old_vlaue, opts) { 
							        	var form = Ext.getCmp('formAddCron').getForm();
					        			var values = form.getValues();
					        			if (new_value == '') {
					        				return;
					        			}
					        			if (values.macros != '') {
					        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit une Macro, voulez-vous la remplacer par une Trame ?', function(res) {
					        					if (res == 'yes') { 
					    				            form.setValues({macros:'',favoris:''});
					    				            Ext.getCmp('formCronFavorisNom').update('&nbsp;');
					    							Ext.getCmp('formCronMacrosNom').update('&nbsp;');
					        					} else {
					        						form.setValues({trame:''});
					        					}
					        				});
					        			} else if (values.favoris != '') {
					        				Ext.MessageBox.confirm('Confirmation', 'Vous avez déjà inscrit un Favoris, voulez-vous le remplacer par une Trame ?', function(res) {
					        					if (res == 'yes') { 
					    				            form.setValues({macros:'',favoris:''});
					    				            Ext.getCmp('formCronFavorisNom').update('&nbsp;');
					    							Ext.getCmp('formCronMacrosNom').update('&nbsp;');
					        					} else {
					        						form.setValues({trame:''});
					    						}
					        				});
					        			}
						            }
						        }
							}
						}]
					}]
				}]
			};
			return new Ext.form.FieldSet(content);
		}
	};
	
	this.func = {
		validateAdd: function() {
			var form = Ext.getCmp('formAddCron').getForm(),
			encode = Ext.String.htmlEncode;
			var error = false;
			if (form.isValid()) {
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var minutes = encode(formValues.minutes);
				var heures = encode(formValues.heures);
				var jour = encode(formValues.jour);
				var jourSemaine = encode(formValues.jourSemaine);
				var mois = encode(formValues.mois);
				var favoris = formValues.favoris||'null';
				var macros = formValues.macros||'null';
				var trame = formValues.trame!=''?"'"+encode(formValues.trame)+"'":'null';
				var active = formValues.active=='oui'?'true':'false';
				if (favoris == 'null' && macros == 'null' && trame == 'null') {
					error = true;
				} else {
					var params = "'"+nom+"','"+minutes+"','"+heures+"','"+jour+"','"+jourSemaine+"','"+mois+"',"+favoris+","+macros+","+trame+","+active;
					requestCall('add_cron', params, {ok:'jalon ajouté !', error:'impossible d\'ajouter le jalon !'}, {
						onsuccess:function(response){
							Ext.getCmp('formAddCron').getForm().reset();
							Ext.getCmp('winCron').close();
							Ext.data.StoreManager.lookup('DataCron').reload();
		            	},
		            	onfailure:function(response){
							Ext.MessageBox.show({
								title: 'Erreur',
								msg: 'Le jalon "'+formValues.nom+'" na pas pu être ajouté ! Erreur de communication, réessayez plus tard.',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
		            	}
		            });
				}
			} else {
				error = true;
			}
			if (error) {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Les champs ne sont pas valides ou vous n\'avez pas choisi d\'action !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		},

		validateUpd: function() {
			var form = Ext.getCmp('formAddCron').getForm(),
			encode = Ext.String.htmlEncode;
			var error = false;
			if (form.isValid()) {
		        Ext.getCmp('formRefNomaddCron').enable(true);
				var formValues = form.getValues();
				var nom = encode(formValues.nom);
				var minutes = encode(formValues.minutes);
				var heures = encode(formValues.heures);
				var jour = encode(formValues.jour);
				var jourSemaine = encode(formValues.jourSemaine);
				var mois = encode(formValues.mois);
				var favoris = formValues.favoris||'null';
				var macros = formValues.macros||'null';
				var trame = formValues.trame!=''?"'"+encode(formValues.trame)+"'":'null';
				var active = formValues.active=='oui'?'true':'false';
				if (favoris == 'null' && macros == 'null' && trame == 'null') {
					error = true;
				} else {
					var params = "'"+nom+"','"+minutes+"','"+heures+"','"+jour+"','"+jourSemaine+"','"+mois+"',"+favoris+","+macros+","+trame+","+active;
					requestCall('add_cron', params, {ok:'jalon modifié !', error:'impossible de modifier le jalon !'}, {
						onsuccess:function(response){
							Ext.getCmp('formAddCron').getForm().reset();
							Ext.getCmp('winCron').close();
							Ext.data.StoreManager.lookup('DataCron').reload();
		            	},
		            	onfailure:function(response){
							Ext.MessageBox.show({
								title: 'Erreur',
								msg: 'Le jalon "'+formValues.nom+'" na pas pu être modifié ! Erreur de communication, réessayez plus tard.',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
		            	}
		            });
				}
			} else {
				error = true;
			}
			if (error) {
	        	Ext.MessageBox.show({
					title: 'Erreur',
					msg: 'Les champs ne sont pas valides ou vous n\'avez pas choisi d\'action !',
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.ERROR
				});
			}
		},
		
		del: function(rec) {
			if (rec) {
			    var id = rec.get('id_cron');
			    Ext.MessageBox.confirm('Confirm', 'Voulez vous vraiment supprimer le jalon <b>"'+rec.get('nom')+'"</b> ?', function(btn) {
			    	if (btn == 'yes') {
			            requestCall('del_cron', id, {ok:'jalon éffacé !', error:'impossible d\'éffacer le jalon !'}, {
			            	onsuccess:function(response){
		    					Ext.data.StoreManager.lookup('DataCron').reload();		            			
		            		},
			            	onfailure:function(response){
								Ext.MessageBox.show({
									title: 'Erreur',
									msg: 'Le jalon "'+formValues.nom+'" na pas pu être effacé ! Erreur de communication, réessayez plus tard.',
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
			if (Ext.getCmp('panelCron')) {
				Ext.data.StoreManager.lookup('DataCron').reload();
			} else {
				layout.func.clear();
				layout.func.add(cron.panel.cron());
				Ext.data.StoreManager.lookup('DataCron').reload();
			};
		}
		
	};
	
};

var cron = new cron();
