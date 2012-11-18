/**
* Gestion des requetes au Client
*/

var sendCommand = function(type, trame, dateFormat) {
	Ext.Ajax.request({
		url: '../back/client.php',
		method: 'GET',
		success: function(response) {
			Ext.myMsg.msg('Information', 'Ok : Trame envoyé !<br />'+response.responseText);
		},
		failure: function(response) {
			Ext.myMsg.msg('Information', 'Erreur : La trame n\'a pas été envoyé !');
		},
		params: { type: type, send_command: trame, date: dateFormat }
	});
};

var requestCall = function(func, params) {
	Ext.Ajax.request({
		url: '../back/client.php',
		method: 'GET',
		success: function(response) {
			Ext.myMsg.msg('Information', 'Ok : Action effectuée !<br />'+response.responseText);
		},
		failure: function(response) {
			Ext.myMsg.msg('Information', 'Erreur : L\'action n\'a pas été envoyé !');
		},
		params: { call: func, params: params}
	});
};