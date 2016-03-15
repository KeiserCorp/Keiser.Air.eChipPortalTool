(function() {
	'use strict';
	var $ = window.jQuery = require('jquery');
	require('uikit');
	var Vue = require('vue');
	var eChip = require('./echip.js');

	/*
	 *	Constants
	 */
	const DEFAULT_HOME = 'http://devx.keiser.com/echip';
	const SETTINGS_KEY = 'settings';
	const MESSENGER_CONST = {
		TYPE: {
			RESPONSE: 'response',
			REQUEST: 'request',
		},
		ACTION: {
			CONNECT: 'connect',
			ECHIP_SET: 'echip-set',
			ECHIP_GET: 'echip-get',
		},
	};

	/*
	 *	Initialization
	 */
	var windowInitialize = function() {
		setBodyAttributes();
		settingsLoad(true);
		eChip.initialize();
	};

	window.onload = windowInitialize;

	/*
	 *	Vue Configure
	 */
	Vue.config.delimiters = ['{%', '%}',];
	Vue.config.unsafeDelimiters = ['{%!', '!%}',];

	/*
	 *	Sets Body Attributes
	 */
	var setBodyAttributes = function() {
		$(document.links)
			.filter(function() {
				return this.hostname != window.location.hostname;
			})
			.attr('target', '_blank');
	};

	/*
	 *	Web Portal Handlers
	 */
	var webPortal = document.getElementById('web-portal');
	var webPortalState = {
		connected: false,
		initialized: false,
		target: '',
		actions: [],
	};

	var webPortalTargetDomain = function() {
		var domain;
		var url = settings.homePage;
		if (url.indexOf("://") > -1) {
			domain = url.split('/')[2];
		} else {
			domain = url.split('/')[0];
		}
		domain = domain.split(':')[0];
		return '*://*.' + domain + '/*';
	}

	var webPortalInitialize = function() {
		window.addEventListener('message', webPortalMessageDispatch.receive);
		webPortal
			.request
			.onCompleted
			.addListener(webPortalRequestEvent, {
				urls: [webPortalTargetDomain()]
			});
		webPortalGoHome();
	};

	var webPortalRequestEvent = function(requestDetails) {
		if (requestDetails.type === "main_frame") {
			webPortalState.connected = false;
			webPortalState.initialized = false;
			webPortalState.target = requestDetails.url;
			webPortalState.actions = [];
			setTimeout(webPortalConnect, 250);
		}
	};

	var webPortalConnect = function() {
		var message = webPortalMessageSendRequest(MESSENGER_CONST.ACTION.CONNECT, null, webPortalConnectionAccepted);
		webPortalState.initialized = true;
	};

	var webPortalConnectionAccepted = function(messageObject) {
		if ((messageObject || {}).action && messageObject.action == MESSENGER_CONST.ACTION.CONNECT) {
			webPortalState.connected = true;
			webPortalState.actions = (messageObject.data.actions || []);
		}
	};

	var webPortalGoHome = function() {
		webPortal.src = settings.homePage;
	};

	/*
	 *	Web Portal Message Handlers
	 */
	var webPortalMessageCounter = 1;
	var webPortalMessageGetID = function() {
		return webPortalMessageCounter++;
	}

	var webPortalMessageGenerator = function() {
		return {id: null, type: null, action: null, data: null,}
	};

	var webPortalMessageRequestGenerator = function(action, data) {
		var message = webPortalMessageGenerator();
		message.id = webPortalMessageGetID();
		message.type = MESSENGER_CONST.TYPE.REQUEST;
		message.action = action;
		message.data = data;
		return message;
	};

	var webPortalMessageResponseGenerator = function(requestMessage, action, data) {
		var message = webPortalMessageGenerator();
		message.id = requestMessage.id;
		message.type = MESSENGER_CONST.TYPE.RESPONSE;
		message.action = action;
		message.data = data;
		return message;
	};

	var webPortalMessageDispatchGenerator = function(requestReceiver) {
		var mt = {};
		var messages = {};

		mt.send = function(messageObject, callback) {
			if (messageObject.type == MESSENGER_CONST.TYPE.REQUEST && callback) {
				messages[messageObject.id] = callback;
			}
			webPortal
				.contentWindow
				.postMessage(JSON.stringify(messageObject), webPortalState.target);
		};

		mt.receive = function(messageEvent) {
			var messageObject = JSON.parse(messageEvent.data);
			if (!messageObject.id || !messageObject.type) {
				return;
			}
			if (messageObject.type == MESSENGER_CONST.TYPE.RESPONSE && messages[messageObject.id]) {
				messages[messageObject.id](messageObject);
			} else if (messageObject.type == MESSENGER_CONST.TYPE.REQUEST) {
				requestReceiver(messageObject);
			}
		}

		mt.clear = function() {
			messages = {};
		};
		return mt;
	};

	var webPortalMessageSendRequest = function(action, data, callback) {
		var messageObject = webPortalMessageRequestGenerator(action, data);
		webPortalMessageDispatch.send(messageObject, callback);
	};

	var webPortalMessageSendResponse = function(requestMessage, action, data, callback) {
		var messageObject = webPortalMessageResponseGenerator(requestMessage, action, data);
		webPortalMessageDispatch.send(messageObject, callback);
	};

	var webPortalMessageRequestReceiver = function(messageObject) {
		console.log(messageObject);
	};

	var webPortalMessageDispatch = webPortalMessageDispatchGenerator(webPortalMessageRequestReceiver);

	/*
	 *	Settings
	 */
	const settingsDefaults = {
		homePage: DEFAULT_HOME,
		eraseOnUpload: false
	};

	var settings = $.extend({}, settingsDefaults);
	var lastHomePage;

	var settingsLoad = function(hardLoad) {
		chrome
			.storage
			.local
			.get(SETTINGS_KEY, function(savedSettings) {
				$.extend(settings, savedSettings.settings);
				hardLoad = hardLoad || (lastHomePage != settings.homePage);
				lastHomePage = settings.homePage;
				if (hardLoad) {
					webPortalInitialize();
				}
			});
	};

	var settingsSave = function() {
		if (validSettings(settings)) {
			var settingsObject = {};
			settingsObject[SETTINGS_KEY] = settings;
			chrome
				.storage
				.local
				.remove(SETTINGS_KEY, function() {
					chrome
						.storage
						.local
						.set(settingsObject, settingsLoad());
				});
		}
	};

	var validUrl = function(url) {
		return /^(http|https):\/\/[^ "]+$/.test(url);
	};

	var validSettings = function(settings) {
		return validUrl(settings.homePage);
	};

	/*
	 *	Tool Bar UI Binding
	 */
	var requestStates = {
		upload: false,
		upload_init: false,
		upload_timeout: null,
		download: false,
		download_init: false,
		clear: false,
		clear_init: false
	};

	var toolBarVue = new Vue({
		el: '#tool-bar',
		data: {
			'eChipKeyState': eChip.keyState,
			'eChipStatus': eChip.status,
			'webPortalState': webPortalState,
			'requestStates': requestStates,
		},
		computed: {
			uploadReady: function() {
				return (this.webPortalState.actions.indexOf(MESSENGER_CONST.ACTION.ECHIP_SET) > -1);
			},
			downloadReady: function() {
				return (this.webPortalState.actions.indexOf(MESSENGER_CONST.ACTION.ECHIP_GET) > -1);
			},
			doingUpload: function() {
				if ((this.requestStates.upload || this.requestStates.upload_init) && (this.eChipStatus.keyAction == 'get' || this.eChipStatus.keyAction == 'clear')) {
					if (this.requestStates.upload_timeout) {
						clearTimeout(this.requestStates.upload_timeout);
					}
					this.requestStates.upload = false;
					this.requestStates.upload_init = true;
					return true;
				}
				if (this.requestStates.upload && !this.requestStates.upload_init) {
					if (!this.requestStates.upload_timeout) {
						this.requestStates.upload_timeout = setTimeout(function() {
							requestStates.upload = false;
						}, 2000);
					}
					return true;
				}
				this.requestStates.upload_timeout = null;
				this.requestStates.upload_init = false;
				return false;
			},
			doingDownload: function() {
				if (this.requestStates.download_init && this.eChipStatus.keyAction == 'set') {
					return true;
				}
				if (this.requestStates.download && this.eChipStatus.keyAction == 'set') {
					this.requestStates.download_init = true;
					this.requestStates.download = false;
					return true;
				}
				if (this.requestStates.download) {
					return false;
				}
				this.requestStates.download_init = false;
				return false;
			},
			doingClear: function() {
				if (this.requestStates.clear_init && this.eChipStatus.keyAction == 'clear') {
					return true;
				}
				if (this.requestStates.clear && this.eChipStatus.keyAction == 'clear') {
					this.requestStates.clear_init = true;
					this.requestStates.clear = false;
					return true;
				}
				if (this.requestStates.clear) {
					return false;
				}
				this.requestStates.clear_init = false;
				return false;
			},
		},
		methods: {
			goHome: function() {
				webPortalGoHome();
			},
			getPermission: function() {
				eChip.requestPermission();
			},
			keyUpload: function() {
				this.requestStates.upload = true;
				webPortalSendEChip();
			},
			keyDownload: function() {
				this.requestStates.download = true;
				webPortalGetEChip();
			},
		},
	});

	/*
	 *	Confirm Erase Modal Binding
	 */
	var confirmEraseModal = new Vue({
		el: '#confirm-erase-modal',
		data: {
			'eChipKeyState': eChip.keyState
		},
		computed: {
			keyID: function() {
				if (this.eChipKeyState.rom) {
					return this
						.eChipKeyState
						.rom
						.toHexString();
				}
			}
		},
		methods: {
			keyClear: function() {
				requestStates.clear = true;
				eChip.keyClear();
			}
		},
	});

	/*
	 *	Settings UI Binding
	 */
	var settingsVueSettings = $.extend({}, settings);

	$('#settings-modal').on({
		'show.uk.modal': function() {
			settingsVueCloneSettings();
		}
	});

	var settingsVue = new Vue({
		el: '#settings-modal',
		data: {
			settings: settingsVueSettings,
			fullscreen: chrome
				.app
				.window
				.current()
				.isFullscreen()
		},
		computed: {
			homePageValid: function() {
				return validUrl(this.settings.homePage);
			},
			settingsValid: function() {
				return validSettings(this.settings);
			}
		},
		methods: {
			save: function() {
				settingsVueSaveSettings();
			},
			setDefault: function() {
				settingsVueCloneDefaultSettings();
			},
			toggleFullscreen: function() {
				if (!chrome.app.window.current().isFullscreen()) {
					chrome
						.app
						.window
						.current()
						.fullscreen();
					this.fullscreen = true;
				} else {
					chrome
						.app
						.window
						.current()
						.restore();
					this.fullscreen = false;
				}
			}
		},
	});

	var settingsVueSaveSettings = function() {
		$.extend(settings, settingsVueSettings);
		settingsSave();
	};

	var settingsVueCloneSettings = function() {
		$.extend(settingsVueSettings, settings);
	};

	var settingsVueCloneDefaultSettings = function() {
		$.extend(settingsVueSettings, settingsDefaults);
	};

	/*
	 *	eChip Modal Binding
	 */
	var eChipModalVue = new Vue({
		el: '#echip-modal',
		data: {
			'eChipKeyState': eChip.keyState,
			'eChipStatus': eChip.status,
			'modalDataDisplay': 1,
		},
		computed: {
			keyID: function() {
				if (this.eChipKeyState.rom) {
					return this
						.eChipKeyState
						.rom
						.toHexString();
				}
			},
			keyData: function() {
				if (this.eChipKeyState.data) {
					return eChipModalDataHighlight(this.eChipKeyState.data);
				}
			},
			keyParsedData: function() {
				if (this.eChipKeyState.parsedData) {
					return eChipModalSyntaxHighlight(this.eChipKeyState.parsedData);
				}
			},
		},
		methods: {
			keyRefresh: function() {
				eChip.keyRefresh();
			}
		},
	});

	var eChipModalDataHighlight = function(data) {
		var output = '';
		var page = 0;
		data.forEach(function(row) {
			output += '[<span class="key">' + ('000' + (page++)).substr(-3) + '</span>] <span class="string">';
			row.forEach(function(column) {
				output += ('00' + column.toString(16))
					.substr(-2)
					.toUpperCase();
			});
			output += '</span>\n';
		});
		return output;
	};

	var eChipModalSyntaxHighlight = function(parsedData) {
		var json = JSON.stringify(parsedData, undefined, 2);
		json = json
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	};

	/*
	 *	eChip to Web Portal Actions
	 */
	var webPortalSendEChip = function() {
		eChip
			.keyRead(function(eChipData) {
				var messageData = {
					id: eChipData
						.rom
						.toHexString(),
					machines: eChipData.parsedData,
				};
				webPortalMessageSendRequest(MESSENGER_CONST.ACTION.ECHIP_SET, messageData, webPortalSendEChipResponse);
			});
	};

	var webPortalSendEChipResponse = function(messageObject) {
		if ((messageObject || {}).data && messageObject.data.success) {
			if (settings.eraseOnUpload) {
				requestStates.upload = true;
				eChip.keyClear();
			}
		}
	};

	var webPortalGetEChip = function() {
		eChip
			.keyRead(function(eChipData) {
				var messageData = {
					id: eChipData
						.rom
						.toHexString()
				};
				webPortalMessageSendRequest(MESSENGER_CONST.ACTION.ECHIP_GET, messageData, webPortalGetEChipResponse);
			});
	};

	var webPortalGetEChipResponse = function(messageObject) {
		if ((messageObject || {}).data) {
			eChip.keyWrite(messageObject.data);
		}
	};

})();
