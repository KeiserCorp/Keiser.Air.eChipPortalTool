'use strict';
var $ = window.jQuery = require('jquery');
var UIkit = require('uikit');
var Vue = require('vue');
var eChip = require('./echip.js');

const DEFAULT_HOME = 'http://devx.keiser.com/echip';
const ACTIONS = {
	ECHIP_SET : 'echip-set',
	ECHIP_GET : 'echip-get'
};

(function () {

	/*
	 *	Initialization
	 */
	var windowInitialize = function () {
		settingsLoad();
		webPortalInitialize();
		eChip.initialize();
	};

	window.onload = windowInitialize;

	/*
	 *	Web Portal Handlers
	 */
	var webPortal = document.getElementById('web-portal');
	var webPortalState = {
		connected : false,
		initialized : false,
		target : '',
		actions : []
	};

	var webPortalTargetDomain = function () {
		var domain,
		url = settings.homePage;
		if (url.indexOf("://") > -1) {
			domain = url.split('/')[2];
		} else {
			domain = url.split('/')[0];
		}
		domain = domain.split(':')[0];
		return '*://*.' + domain + '/*';
	}

	var webPortalInitialize = function () {
		window.addEventListener('message', webPortalMessageDispatch.receive);
		webPortal.request.onCompleted.addListener(webPortalRequestEvent, {
			urls : [webPortalTargetDomain()]
		});
		webPortalGoHome();
	};

	var webPortalRequestEvent = function (requestDetails) {
		if (requestDetails.type === "main_frame") {
			webPortalState.connected = false;
			webPortalState.initialized = false;
			webPortalState.target = requestDetails.url;
			webPortalState.actions = [];
			setTimeout(webPortalConnect, 250);
		}
	};

	var webPortalConnect = function () {
		var message = webPortalMessageSendRequest('connect', null, webPortalConnectionAccepted);
		webPortalState.initialized = true;
	};

	var webPortalConnectionAccepted = function (messageObject) {
		if (messageObject.action && webPortalState.action == 'connect') {
			webPortalState.connected = true;
			webPortalState.actions = (messageObject.data.actions || []);
		}
	};

	var webPortalGoHome = function () {
		webPortal.src = settings.homePage;
	};

	/*
	 *	Web Portal Message Handlers
	 */
	var webPortalMessageCounter = 1;
	var webPortalMessageGetID = function () {
		return webPortalMessageCounter++;
	}

	var webPortalMessageGenerator = function () {
		return {
			id : null,
			type : null,
			action : null,
			data : null
		}
	};

	var webPortalMessageRequestGenerator = function (action, data) {
		var message = webPortalMessageGenerator();
		message.id = webPortalMessageGetID();
		message.type = 'request';
		message.action = action;
		message.data = data;
		return message;
	};

	var webPortalMessageResponseGenerator = function (requestMessage, action, data) {
		var message = webPortalMessageGenerator();
		message.id = requestMessage.id;
		message.type = 'response';
		message.action = action;
		message.data = data;
		return message;
	};

	var webPortalMessageDispatchGenerator = function (requestReceiver) {
		var mt = {};
		var messages = {};

		mt.send = function (messageObject, callback) {
			if (messageObject.type == 'request' && callback) {
				messages[messageObject.id] = callback;
			}
			webPortal.contentWindow.postMessage(JSON.stringify(messageObject), webPortalState.target);
		};

		mt.receive = function (messageEvent) {
			var messageObject = JSON.parse(messageEvent.data);
			if (!messageObject.id || !messageObject.type) {
				return;
			}
			if (messageObject.type == 'response' && messages[messageObject.id]) {
				messages[messageObject.id](messageObject);
			} else if (messageObject.type == 'request') {
				requestReceiver(messageObject);
			}
		}

		mt.clear = function () {
			messages = {};
		};
		return mt;
	};

	var webPortalMessageSendRequest = function (action, data, callback) {
		var messageObject = webPortalMessageRequestGenerator(action, data);
		webPortalMessageDispatch.send(messageObject, callback);
	};

	var webPortalMessageSendResponse = function (requestMessage, action, data, callback) {
		var messageObject = webPortalMessageResponseGenerator(requestMessage, action, data);
		webPortalMessageDispatch.send(messageObject, callback);
	};

	var webPortalMessageRequestReceiver = function (messageObject) {
		console.log(messageObject);
	};

	var webPortalMessageDispatch = webPortalMessageDispatchGenerator(webPortalMessageRequestReceiver);

	/*
	 *	Settings
	 */
	const settingsDefaults = {
		homePage : DEFAULT_HOME
	};

	var settings = $.extend({}, settingsDefaults);

	var settingsLoad = function () {
		chrome.storage.local.get('settings', function (savedSettings) {
			$.extend(settings, savedSettings);
		});
	};

	var settingsSave = function () {
		if (validSettings(settings)) {
			chrome.storage.local.remove('settings');
			chrome.storage.local.set({
				'settings' : settings
			});
		}
		settingsLoad();
	};

	var validUrl = function (url) {
		return /^(http|https):\/\/[^ "]+$/.test(url);
	};

	var validSettings = function (settings) {
		return validUrl(settings.homePage);
	};

	/*
	 *	Tool Bar UI Binding
	 */
	var toolBarVue = new Vue({
			el : '#tool-bar',
			data : {
				'eChipStatus' : eChip.status,
				'webPortalState' : webPortalState
			},
			methods : {
				goHome : function () {
					webPortalGoHome();
				},
				getPermission : function () {
					eChip.requestPermission();
				},
				keyUpload : function () {
					webPortalSendEChip();
				},
				keyClear : function () {
					eChip.keyClear();
				}
			}
		});

	/*
	 *	Confirm Erase Modal Binding
	 */
	var confirmEraseModal = new Vue({
			el : '#confirm-erase-modal',
			data : {
				'eChipKeyState' : eChip.keyState
			},
			computed : {
				keyID : function () {
					if (this.eChipKeyState.rom) {
						return this.eChipKeyState.rom.toHexString();
					}
				}
			},
			methods : {
				keyClear : function () {
					eChip.keyClear();
				}
			}
		});

	/*
	 *	Settings UI Binding
	 */
	var settingsVueSettings = $.extend({}, settings);

	$('#settings-modal').on({
		'show.uk.modal' : function () {
			settingsVueCloneSettings();
		}
	});

	var settingsVue = new Vue({
			el : '#settings-modal',
			data : settingsVueSettings,
			computed : {
				homePageValid : function () {
					return validUrl(this.homePage);
				},
				settingsValid : function () {
					return validSettings(this);
				}
			},
			methods : {
				save : function () {
					settingsVueSaveSettings();
				},
				setDefault : function () {
					settingsVueCloneDefaultSettings();
				}
			}
		});

	var settingsVueSaveSettings = function () {
		$.extend(settings, settingsVueSettings);
		settingsSave();
	};

	var settingsVueCloneSettings = function () {
		$.extend(settingsVueSettings, settings);
	};

	var settingsVueCloneDefaultSettings = function () {
		$.extend(settingsVueSettings, settingsDefaults);
	};

	/*
	 *	eChip Modal Binding
	 */
	var eChipModalVue = new Vue({
			el : '#echip-modal',
			data : {
				'eChipKeyState' : eChip.keyState,
				'eChipStatus' : eChip.status
			},
			computed : {
				keyID : function () {
					if (this.eChipKeyState.rom) {
						return this.eChipKeyState.rom.toHexString();
					}
				},
				keyData : function () {
					if (this.eChipKeyState.data) {
						var output = '';
						var page = 0;
						this.eChipKeyState.data.forEach(function (row) {
							output += '[' + ('000' + (page++)).substr(-3) + '] ';
							row.forEach(function (column) {
								output += ('00' + column.toString(16)).substr(-2).toUpperCase();
							});
							output += '\n';
						});
						return output;
					}
				}
			},
			methods : {
				keyRefresh : function () {
					eChip.keyRefresh();
				}
			}
		});

	/*
	 *	eChip to Web Portal Actions
	 */
	var webPortalSendEChip = function () {
		eChip.keyRead(function (eChipData) {
			var messageData = {
				id : eChipData.rom.toHexString(),
				machines : eChipData.parsedData
			}
			webPortalMessageSendRequest(ACTIONS.ECHIP_SET, messageData);
		});
	};

})();
