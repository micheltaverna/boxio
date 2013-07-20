/**
 * @author michel.taverna
 * Gestion des datas store
 */

/**
 * Gestion d'une Trame
 */
new Ext.data.Store({
	storeId: 'dataTrame',
	model: 'Trame',
	pageSize: 50,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_all_trame',
		timeout: 300000,
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion d'une trame local
 */
new Ext.data.Store({
	storeId: 'savedTrame',
	model: 'trameSaved',
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'localstorage',
	    id: 'cookiesTrameExt'
	}
});

/**
 * Gestion des références
 */
new Ext.data.Store({
	storeId: 'DataReferences',
	model: 'references',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_references',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'AllDataReferences',
	model: 'references',
	pageSize: 1000,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_references',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des Scenarios
 */
new Ext.data.Store({
	storeId: 'DataCheckScenarios',
	model: 'checkScenarios',
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?check_memory_db',
		timeout: 300000,
		reader: {
			type: 'xml',
			record: 'module',
			root: 'request'
		},
		simpleSortMode: true
	}
});

/**
 * Creation des macros
 */
new Ext.data.Store({
	storeId: 'DataMacros',
	model: 'macros',
	pageSize: 20,
	remoteSort: true,
	remoteGroup: true,
	autoLoad: false,
	groupField: 'nom',
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_macros',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Creation des commande de macros
 */
new Ext.data.Store({
	storeId: 'DataMacrosCommands',
	model: 'macros',
	pageSize: 20,
	remoteSort: true,
	remoteGroup: true,
	autoLoad: false,
	groupField: 'nom',
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_macros',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des users
 */
new Ext.data.Store({
	storeId: 'DataUsers',
	model: 'users',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_users',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des favoris
 */
new Ext.data.Store({
	storeId: 'DataFavoris',
	model: 'favoris',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
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

/**
 * Gestion des triggers
 */
new Ext.data.Store({
	storeId: 'DataTriggers',
	model: 'triggers',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_triggers',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des equipements inconnu
 */
new Ext.data.Store({
	storeId: 'DataUnknownEquipements',
	model: 'unknownEquipements',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_unknown_equipements',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des equipements
 */
new Ext.data.Store({
	storeId: 'DataEquipements',
	model: 'equipements',
	pageSize: 20,
	remoteSort: true,
	remoteGroup: true,
	autoLoad: false,
	groupField: 'zone',
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'AllDataEquipements',
	model: 'equipements',
	pageSize: 1000,
	remoteSort: true,
	remoteGroup: true,
	autoLoad: false,
	groupField: 'zone',
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'AllDataEquipementsStatus',
	model: 'equipementsStatus',
	pageSize: 1000,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements_status',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'unitDataEquipementsStatus',
	model: 'equipementsStatus',
	pageSize: 1000,
	remoteSort: true,
	remoteFilter: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements_status',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'ProgramableDataEquipementsStatus',
	model: 'equipementsUniqueStatus',
	pageSize: 1000,
	remoteSort: true,
	remoteFilter: true,
	autoLoad: false,
	filters: [{property: 'filter', value: '{type="string"},{field="possibility"},{value="COMMAND"}'}],
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements_status',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'ProgramableUnitDataEquipementsStatus',
	model: 'equipementsStatus',
	pageSize: 1000,
	remoteSort: true,
	remoteFilter: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements_status',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'DataReferencesMemory',
	model: 'referencesMemory',
	pageSize: 1000,
	remoteSort: true,
	remoteFilter: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_references_memory',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des zones
 */
new Ext.data.Store({
	storeId: 'DataZones',
	model: 'zones',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_zones',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});
new Ext.data.Store({
	storeId: 'AllDataZones',
	model: 'zones',
	pageSize: 1000,
	remoteSort: true,
	autoLoad: false,
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_zones',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Gestion des cron (jalons)
 */
new Ext.data.Store({
	storeId: 'DataCron',
	model: 'cron',
	pageSize: 20,
	remoteSort: true,
	autoLoad: false,
	remoteGroup: true,
	groupField: 'active',
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
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

/**
 * Gestion des status des equipements (status)
 */
new Ext.data.Store({
	storeId: 'DataEquipementsStatus',
	model: 'equipementsStatus',
	pageSize: 20,
	autoLoad: false,
	remoteSort: true,
	remoteFilter: true,
	remoteGroup: true,
	groupField: 'zone',
	filters: [{property: 'filter', value: '{type="list"},{field="possibility"},{value=["%STATUS%","%SERVER_STATUS%"]}'}],
	listeners: {
		load: function(t, data) {
			if (data[0] && data[0].get('login_status') === 'false') {
				callback = {
					onSucess : function () {
						t.reload();
					}
				};
				login.win.login(callback);
			}
		}
	},
	proxy: {
		type: 'ajax',
		url: '../back/client.php?view=view_equipements_status',
		reader: {
			type: 'xml',
			record: 'module',
			root: 'content',
			totalRecords: 'total'
		},
		simpleSortMode: true
	}
});

/**
 * Liste des action d'une Trame
 */
new Ext.data.Store({
	storeId: 'DataTrameAction',
    model: 'TrameAction',
    data: [
	    {"type": "Commande","name": "ON"},
	    {"type": "Commande","name": "OFF"},
	    {"type": "Commande","name": "DIM_STOP"},
	    {"type": "Commande","name": "DIM_STEP"},
	    {"type": "Commande","name": "GO_TO_LEVEL_TIME"},
	    {"type": "Commande","name": "MOVE_STOP"},
	    {"type": "Commande","name": "MOVE_UP"},
	    {"type": "Commande","name": "MOVE_DOWN"},
	    {"type": "Commande","name": "CONSIGNE"},
	    {"type": "Commande","name": "DEROGATION_CONSIGNE"},
	    {"type": "Commande","name": "FIN_DEROGATION"},
	    {"type": "Commande","name": "GO_TO_TEMPERATURE"},
	    {"type": "Commande","name": "ARRET"},
	    {"type": "Commande","name": "FIN_ARRET"},
	    {"type": "Commande","name": "STOP_FAN_SPEED"},
	    {"type": "Commande","name": "LOW_FAN_SPEED"},
	    {"type": "Commande","name": "HIGH_FAN_SPEED"},
	    {"type": "Commande","name": "CONFORT_JOUR_ROUGE"},
	    {"type": "Commande","name": "CONCIERGE_CALL"},
	    {"type": "Commande","name": "LOCKER_CONTROL"},
	    {"type": "Commande","name": "COMMANDE_ECS"},
	    {"type": "Commande","name": "INFORMATION_TARIF"},
	    {"type": "Commande","name": "QUEL_INDEX"},
	    {"type": "Commande","name": "INDEX_BASE"},
	    {"type": "Commande","name": "INDEX_HC"},
	    {"type": "Commande","name": "INDEX_BLEU"},
	    {"type": "Commande","name": "INDEX_BLANC"},
	    {"type": "Commande","name": "INDEX_ROUGE"},
	    {"type": "Commande","name": "SET_TEMP_CONFORT"},
	    {"type": "Commande","name": "READ_TEMP_CONFORT"},
	    {"type": "Commande","name": "INDICATION_TEMP_CONFORT"},
	    {"type": "Commande","name": "SET_TEMP_ECO"},
	    {"type": "Commande","name": "READ_TEMP_ECO"},
	    {"type": "Commande","name": "INDICATION_TEMP_ECO"},
	    {"type": "Commande","name": "SET_V3V_CONSIGNE"},
	    {"type": "Commande","name": "CONSIGN_V3V_REQUEST"},
	    {"type": "Commande","name": "ACTION"},
	    {"type": "Commande","name": "STOP_ACTION"},
	    {"type": "Commande","name": "ACTION_FOR_TIME"},
	    {"type": "Commande","name": "ACTION_IN_TIME"},
	    {"type": "Commande","name": "INFO_SCENE_OFF"},
	    {"type": "Commande","name": "CLOCK_SYNCHRONISATION"},
	    {"type": "Commande","name": "LOW_BATTERY"},
	    {"type": "Commande","name": "READ_CLOCK_TIME_PARAMETER"},
	    {"type": "Commande","name": "INDICATION_CLOCK_TIME_PARAMETER"},
	    {"type": "Commande","name": "SET_CLOCK_TIME_PARAMETER"},
	    {"type": "Commande","name": "OVERRIDE_FOR_TIME"},
	    {"type": "Commande","name": "END_OF_OVERRIDE"},
	    {"type": "Commande","name": "ANNOUNCE_ID"},
	    {"type": "Commande","name": "DEVICE_DESCRIPTION_REQUEST"},
	    {"type": "Commande","name": "DEVICE_DESCRIPTION_STATUS"},
	    {"type": "Commande","name": "REQUEST_ID"},
	    {"type": "Commande","name": "EXTENDED_MEMORY_DATA"},
	    {"type": "Commande","name": "MEMORY_DEPTH_INDICATION"},
	    {"type": "Commande","name": "MEMORY_DATA"},
	    {"type": "Commande","name": "UNIT_DESCRIPTION_REQUEST"},
	    {"type": "Commande","name": "UNIT_DESCRIPTION_STATUS"},
	    {"type": "Commande","name": "MEMORY_WRITE"},
	    {"type": "Commande","name": "SET_COMMUNICATION_PARAMETER"},
	    {"type": "Commande","name": "OPEN_LEARNING"},
	    {"type": "Commande","name": "CLOSE_LEARNING"},
	    {"type": "Commande","name": "ADDRESS_ERASE"},
	    {"type": "Commande","name": "MEMORY_RESET"},
	    {"type": "Commande","name": "MEMORY_FULL"},
	    {"type": "Commande","name": "MEMORY_READ"},
	    {"type": "Commande","name": "VALID_ACTION"},
	    {"type": "Commande","name": "INVALID_ACTION"},
	    {"type": "Commande","name": "CANCEL_ID"},
	    {"type": "Commande","name": "MANAGEMENT_CLOCK_SYNCHRONISATION"},
		{"type": "Commande","name": "OCCUPIED"},
	    {"type": "Commande","name": "UNOCCUPIED"}
	]}
);

