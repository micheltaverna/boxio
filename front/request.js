/**
* Gestion des requetes au Client
*/

var sendCommand = function(type, trame, dateFormat) {
	Ext.Ajax.request({
		url: '../back/client.php',
		method: 'GET',
		success: function(response) {
			Ext.myMsg.msg('Information', 'Ok : Trame envoyé !');
		},
		failure: function(response) {
			Ext.myMsg.msg('Information', 'Erreur : La trame n\'a pas été envoyé !');
		},
		params: { type: type, send_command: trame, date: dateFormat }
	});
};

var requestGET = function(url, params, msg, callback) {
	if (!msg && !msg.ok) {
		msg.ok = 'Action effectuée !';
	}
	if (!msg && !msg.error) {
		msg.ok = 'L\'action n\'a pas été envoyé !';
	}
	Ext.Ajax.request({
		url: url,
		method: 'GET',
		success: function(response) {
			Ext.myMsg.msg('Information', 'Ok : '+msg.ok);
			if (callback && callback.onsuccess) {
				callback.onsuccess(response);
			}
		},
		failure: function(response) {
			Ext.myMsg.msg('Information', 'Erreur : '+response.responseText);
			if (callback && callback.onfailure) {
				callback.onfailure(response);
			}
		},
		params: params
	});
};

var requestCall = function(func, params, msg, callback) {
	if (!msg && !msg.ok) {
		msg.ok = 'Action effectuée !';
	}
	if (!msg && !msg.error) {
		msg.ok = 'L\'action n\'a pas été envoyé !';
	}
	Ext.Ajax.request({
		url: '../back/client.php',
		method: 'GET',
		success: function(response) {
			Ext.myMsg.msg('Information', 'Ok : '+msg.ok);
			if (callback && callback.onsuccess) {
				callback.onsuccess(response);
			}
		},
		failure: function(response) {
			Ext.myMsg.msg('Information', 'Erreur : '+response.responseText);
			if (callback && callback.onfailure) {
				callback.onfailure(response);
			}
		},
		params: { call: func, params: params}
	});
};