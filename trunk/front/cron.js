var createCron = function() {
	
	var formRef = Ext.create('Ext.form.FieldSet', {
		title: 'Référence du Jalon',
		collapsible: true,
		defaults: {
			width: 500,
			columns: 4
		},
		items: [{
			xtype     : 'textfield',
			name      : 'nom',
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
	});

	var selectDayOfMonth = Ext.getCmp('selectDayOfMonth');
	if (!selectDayOfMonth) {
		selectDayOfMonth = Ext.create('Ext.window.Window', {
			id: 'selectDayOfMonth',
		    title: 'Selection des jours du mois',
		    closeAction: 'hide',
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
		            var form = Ext.getCmp('formSendCron').getForm();
		            form.setValues({jour:ret});
		            Ext.getCmp('selectDayOfMonth').hide();
		        }
		    }]
		});
	} 

	var selectMinutes = Ext.getCmp('selectMinutes');
	if (!selectMinutes) {
		selectMinutes = Ext.create('Ext.window.Window', {
			id: 'selectMinutes',
		    title: 'Selection des minutes',
		    closeAction: 'hide',
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
		            var form = Ext.getCmp('formSendCron').getForm();
		            form.setValues({minutes:ret});
		            Ext.getCmp('selectMinutes').hide();
		        }
		    }]
		});
	}

	var selectHours = Ext.getCmp('selectHours');
	if (!selectHours) {
		selectHours = Ext.create('Ext.window.Window', {
			id: 'selectHours',
		    title: 'Selection des heures',
		    closeAction: 'hide',
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
		            var form = Ext.getCmp('formSendCron').getForm();
		            form.setValues({heures:ret});
		            Ext.getCmp('selectHours').hide();
		        }
		    }]
		});
	} 

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
		    closeAction: 'hide',
		    modal: true,
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
		            var form = Ext.getCmp('formSendCron').getForm();
		            form.setValues({jourSemaine:ret});
		            Ext.getCmp('selectDayOfWeek').hide();
		        }
		    }]
		});
	}

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
		    closeAction: 'hide',
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
		            var form = Ext.getCmp('formSendCron').getForm();
		            form.setValues({mois:ret});
		            Ext.getCmp('selectMonth').hide();
		        }
		    }]
		});
	}

	var formDate = Ext.create('Ext.form.FieldSet', {
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
				handler: function() {
			        selectMinutes.show();
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
				handler: function() {
			        selectHours.show();
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
				handler: function() {
			        selectDayOfMonth.show();
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
				handler: function() {
			        selectDayOfWeek.show();
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
				handler: function() {
					selectMonth.show();
			    }
			}]
		}]
	});

	//Affichage du favoris
	Ext.define('favoris',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'id', type: 'int'}, 
			{name: 'nom', type: 'string'}, 
			{name: 'trame', type: 'string'}
		]
	});
	
	// Creation des Data
	var DataFavoris = new Ext.data.Store({
		storeId: 'DataFavoris',
		model: 'favoris',
		pageSize: 20,
		remoteSort: true,
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../back/client.php?view=view_favoris',
			reader: {
				type: 'xml',
				record: 'module',
				root: 'content',
				totalRecords: 'total'
			},
			simpleSortMode: true
		}
	});
	
	var filter = {
        ftype: 'filters',
        encode: true,
        local: false,
		phpMode: true,
        filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
    };

	// Creation du tableau
	var panelFavoris = Ext.create('Ext.grid.Panel', {
		title : 'Liste des favoris enregistrés', 
		store: DataFavoris,
		disableSelection: false,
		loadMask: true,
		width: '100%',
		autoScroll: true,
		closable: false,
		features: [filter],
		columns: [
			{
				text: 'Nom', 
				dataIndex: 'nom', 
				width: 320,
				filter: {
					type: 'string'
				}
			},{
				text: 'Référence', dataIndex: 'id', width: 75,
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
			            var form = this.up('form').getForm();
			            form.setValues({favoris:rec.get('id')});
			        }
			    }]
			},{
				text: 'trame', 
				dataIndex: 'trame', 
				width: 200,
				hidden: true
			}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataFavoris'),
			displayInfo: true,
			displayMsg: 'Liste des favoris {0} - {1} of {2}',
			emptyMsg: "Aucun favoris"
		})
	});

	var formAction = Ext.create('Ext.form.FieldSet', {
		title: 'Action du Jalon',
		collapsible: true,
		items: [{
			xtype: 'tabpanel',
			plain:true,
			width:500,
	        items: [{
				title: 'Favoris',
				items: [{
					xtype: 'textfield',
		            padding: 10,
					name: 'favoris',
					width:370,
					labelWidth:120,
					fieldLabel: 'Référence du Favoris',
					msgTarget: 'side',
					allowBlank: true
				},
					panelFavoris
				]
			},{
				title: 'Macros',
				html:'test content'
			},{
				title: 'Trame',
				items: [{
					xtype: 'textfield',
		            padding: 10,
					name: 'trame',
					fieldLabel: 'Trame',
					msgTarget: 'side',
					allowBlank: true
				}]
			}]
		}]
	});

	var winSendCron = Ext.getCmp('winSendCron');
	if (!winSendCron) {
		winSendCron = Ext.create('Ext.window.Window', {
			xtype: 'form',
			id: 'winSendCron',
		    title: 'Ajout du jalon',
		    closeAction: 'hide',
		    items: [{
		            xtype: 'form',
		            id: 'formSendCron',
				    items: [formRef,formDate,formAction]
		    }],
		    buttons: [{
				text: 'Effacer',
				handler: function() {
					Ext.getCmp('formSendCron').getForm().reset();
				}
			},{
				text: 'Annuler',
				handler: function() {
					Ext.getCmp('winSendCron').hide();
				}
			},{
				text: 'Enregistrer',
				handler: function() {
					var form = Ext.getCmp('formSendCron').getForm(),
						encode = Ext.String.htmlEncode,
						s='';
					if (form.isValid()) {
						var formValues = form.getValues();
						Ext.iterate(formValues, function(key, value) {
							value = encode(value);
							s += Ext.util.Format.format("{0} = {1}<br />", key, value);
						}, this);
						var params = "'"+encode(formValues.nom)+"','"+encode(formValues.trame)+"'";
						Ext.Ajax.request({
							url: '../back/client.php',
							method: 'GET',
							success: function(response) {
								Ext.myMsg.msg('Information', 'Ok : Favoris enregistré !<br />'+response.responseText);
							},
							failure: function(response) {
								Ext.myMsg.msg('Information', 'Erreur : Le jalon n\'a pas été envoyé pour enregistrement !');
							},
							params: { call: 'add_cron', params: params }
						});
					}
				}
			}]
		});
	}
	winSendCron.show();
};




var openCron = function() {
	Ext.define('cron',{
		extend: 'Ext.data.Model',
		fields: [
			{name: 'id', type: 'int'}, 
			{name: 'nom', type: 'string'}, 
			{name: 'minutes', type: 'string'}, 
			{name: 'heures', type: 'string'}, 
			{name: 'jour', type: 'string'},
			{name: 'jourSemaine', type: 'string'},
			{name: 'mois', type: 'string'} ,
			{name: 'id_favoris', type: 'int'}, 
			{name: 'id_macro', type: 'int'}, 
			{name: 'trame', type: 'string'}, 
			{name: 'active', type: 'int'}
		]
	});
	
	// Creation des Data
	var DataCron = new Ext.data.Store({
		storeId: 'DataCron',
		model: 'cron',
		pageSize: 20,
		remoteSort: true,
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url: '../back/client.php?view=view_cron',
			reader: {
				type: 'xml',
				record: 'module',
				root: 'content',
				totalRecords: 'total'
			},
			simpleSortMode: true
		}
	});
	
	var filter = {
        ftype: 'filters',
        encode: true,
        local: false,
		phpMode: true,
        filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
    };

	// Creation du tableau
	var panelCron = new Ext.grid.Panel({
		title : 'Liste des jalons enregistrés', 
		store: DataCron,
		disableSelection: false,
		loadMask: true,
		width: '100%',
		height: 500,
		autoScroll: true,
		closable: true,
		features: [filter],
		columns: [
			{text: 'id', dataIndex: 'id', width: 131,
				filter: {
					type: 'string'
				}
			},
			{text: 'nom', dataIndex: 'nom', width: 131},
			{text: 'minutes', dataIndex: 'minutes', width: 131}, 
			{text: 'heures', dataIndex: 'heures', width: 131},
			{text: 'jour', dataIndex: 'jour', width: 131}, 
			{text: 'jourSemaine', dataIndex: 'jourSemaine', width: 131},
			{text: 'mois', dataIndex: 'mois', width: 131},
			{text: 'id_favoris', dataIndex: 'id_favoris', width: 131}, 
			{text: 'id_macro', dataIndex: 'id_macro', width: 131},
			{text: 'trame', dataIndex: 'trame', width: 131}, 
			{text: 'active', dataIndex: 'active', width: 131}
		],
		// Creation de la bar de defilement des pages
		bbar: Ext.create('Ext.PagingToolbar', {
			store: Ext.data.StoreManager.lookup('DataCron'),
			displayInfo: true,
			displayMsg: 'Liste des jalons {0} - {1} of {2}',
			emptyMsg: "Aucun jalons"
		})
	});

	clearContent();
	var region = Ext.getCmp('Content');
	region.add(panelCron);
	panelCron.show();
};