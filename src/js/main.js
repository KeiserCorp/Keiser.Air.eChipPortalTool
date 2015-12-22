'use strict';
var $ = window.jQuery = require('jquery');
var UIKit = require('uikit');
var Vue = require('vue');
var eChip = require('./echip.js');

const DEFAULT_HOME = 'http://devxer.com/1w/index.html';

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
		target : ''
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
			setTimeout(webPortalConnect, 250);
		}
	};

	var webPortalConnect = function () {
		webPortal.contentWindow.postMessage("{action: 'connect'}", webPortalState.target);
		webPortalState.initialized = true;
	};

	var webPortalGoHome = function () {
		webPortal.src = settings.homePage;
	};

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
				'eChipStatus' : eChip.status
			},
			methods : {
				goHome : function () {
					webPortalGoHome();
				},
				getPermission : function () {
					eChip.requestPermission();
				},
				keyRead : function () {
					eChip.keyRead();
				},
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
				keyRead : function () {
					eChip.keyRead();
				}
			}
		});

})();
