(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
	var keu = require('keiser-echip-utilities');
	var testData = require('./test-data.js');
	var output = document.getElementById("output");

	keu
		.messenger
		.enable(function(data, success) {
			success(testData.test1);
		}, function(data, success) {
			output.innerHTML = syntaxHighlight(data);
			success();
		});

	function syntaxHighlight(json) {
		if (typeof json != 'string') {
			json = JSON.stringify(json, undefined, 2);
		}
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
	}
})();

},{"./test-data.js":2,"keiser-echip-utilities":4}],2:[function(require,module,exports){
module.exports = function() {
	'use strict';
	var data = {};

	data.test1 = {
		"1335": {
			"position": {
				"chest": null,
				"rom2": 3,
				"rom1": null,
				"seat": 3,
			},
			"sets": [
				{
					"model": "1335",
					"version": "3EC8495A",
					"serial": "0124 2013 0858 4743",
					"time": "2016-03-30T13:49:03-08:00",
					"resistance": 84,
					"precision": "int",
					"units": "lb",
					"repetitions": 6,
					"test": {
						"type": "power6r",
						"low": {
							"power": 485,
							"velocity": 226,
							"force": 6384,
							"position": 2006,
						},
						"high": {
							"power": 626,
							"velocity": 170,
							"force": 10880,
							"position": 1822,
						},
					},
				}, {
					"model": "1335",
					"version": "3EC8495A",
					"serial": "0124 2013 0858 4743",
					"time": "2016-03-30T13:53:34-08:00",
					"resistance": 58,
					"precision": "int",
					"units": "lb",
					"repetitions": 5,
					"peak": 497,
					"work": 602,
				}, {
					"model": "1335",
					"version": "3EC8495A",
					"serial": "0124 2013 0858 4743",
					"time": "2016-03-30T13:53:56-08:00",
					"resistance": 58,
					"precision": "int",
					"units": "lb",
					"repetitions": 4,
					"peak": 492,
					"work": 441,
				},
			],
		},
		"1338": {
			"position": {
				"chest": null,
				"rom2": null,
				"rom1": null,
				"seat": 2,
			},
			"sets": [
				{
					"model": "1338",
					"version": "0465B73E",
					"serial": "0128 2016 1222 4900",
					"time": "2016-03-30T13:22:57-08:00",
					"resistance": 35,
					"precision": "int",
					"units": null,
					"repetitions": 7,
				}, {
					"model": "1338",
					"version": "0465B73E",
					"serial": "0128 2016 1222 4900",
					"time": "2016-03-30T13:23:25-08:00",
					"resistance": 41,
					"precision": "int",
					"units": null,
					"repetitions": 5,
				}, {
					"model": "1338",
					"version": "0465B73E",
					"serial": "0128 2016 1222 4900",
					"time": "2016-03-30T13:23:45-08:00",
					"resistance": 161,
					"precision": "int",
					"units": null,
					"repetitions": 252,
				}, {
					"model": "1338",
					"version": "0465B73E",
					"serial": "0128 2016 1222 4900",
					"time": "2016-03-30T13:28:46-08:00",
					"resistance": 51,
					"precision": "int",
					"units": null,
					"repetitions": 253,
				},
			],
		},
		"2121": {
			"position": {
				"chest": null,
				"rom2": 4,
				"rom1": null,
				"seat": 6,
			},
			"sets": [
				{
					"model": "2121",
					"version": "3EC8495A",
					"serial": "0121 2013 1632 1946",
					"time": "2016-03-30T13:50:10-08:00",
					"resistance": 15,
					"precision": "int",
					"units": "lb",
					"repetitions": 10,
					"peak": 429,
					"work": 889,
				}, {
					"model": "2121",
					"version": "3EC8495A",
					"serial": "0121 2013 1632 1946",
					"time": "2016-03-30T13:50:52-08:00",
					"resistance": 37,
					"precision": "int",
					"units": "lb",
					"repetitions": 11,
					"peak": 657,
					"work": 981,
				},
			],
		},
		"2621": {
			"position": {
				"chest": 3,
				"rom2": null,
				"rom1": 2,
				"seat": null,
			},
			"sets": [
				{
					"model": "2621",
					"version": "3EC8495A",
					"serial": "0124 2013 0858 4733",
					"time": "2016-03-30T13:55:19-08:00",
					"resistance": 8,
					"precision": "int",
					"units": "lb",
					"repetitions": 8,
					"peak": 67,
					"work": 158,
				}
			],
		},
		"3010": {
			"position": {
				"chest": null,
				"rom2": 1,
				"rom1": 0,
				"seat": null,
			},
			"sets": [
				{
					"model": "3010",
					"version": "3EC8495A",
					"serial": "0121 2013 1632 1936",
					"time": "2016-03-30T13:47:51-08:00",
					"resistance": 20.6,
					"precision": "dec",
					"units": "lb",
					"repetitions": 6,
					"peak": 381,
					"work": 219,
				}, {
					"model": "3010",
					"version": "3EC8495A",
					"serial": "0121 2013 1632 1936",
					"time": "2016-03-30T13:48:17-08:00",
					"resistance": 33.5,
					"precision": "dec",
					"units": "lb",
					"repetitions": 6,
					"test": {
						"type": "power6r",
						"low": {
							"power": 246,
							"velocity": 168,
							"force": 5360,
							"position": 785,
						},
						"high": {
							"power": 455,
							"velocity": 130,
							"force": 12848,
							"position": 700,
						},
					},
				},
			],
		},
		"3020": {
			"position": {
				"chest": 8,
				"rom2": 8,
				"rom1": 0,
				"seat": 2,
			},
			"sets": [
				{
					"model": "3020",
					"version": "3EC8495A",
					"serial": "0124 2013 0742 0540",
					"time": "2016-03-30T13:48:47-08:00",
					"resistance": 8.5,
					"precision": "dec",
					"units": "lb",
					"repetitions": 5,
					"peak": 162,
					"work": 119,
				}, {
					"model": "3020",
					"version": "3EC8495A",
					"serial": "0124 2013 0742 0540",
					"time": "2016-03-30T13:49:11-08:00",
					"resistance": 8.5,
					"precision": "dec",
					"units": "lb",
					"repetitions": 5,
					"peak": 193,
					"work": 174,
				}, {
					"model": "3020",
					"version": "3EC8495A",
					"serial": "0124 2013 0742 0540",
					"time": "2016-03-30T13:49:18-08:00",
					"resistance": 8.4,
					"precision": "dec",
					"units": "lb",
					"repetitions": 6,
					"test": {
						"type": "power6r",
						"low": {
							"power": 165,
							"velocity": 133,
							"force": 4560,
							"position": 864,
						},
						"high": {
							"power": 621,
							"velocity": 117,
							"force": 19488,
							"position": 634,
						},
					},
				}, {
					"model": "3020",
					"version": "3EC8495A",
					"serial": "0124 2013 0742 0540",
					"time": "2016-03-30T13:49:50-08:00",
					"resistance": 26.1,
					"precision": "dec",
					"units": "lb",
					"repetitions": 6,
					"test": {
						"type": "power6r",
						"low": {
							"power": 264,
							"velocity": 149,
							"force": 6496,
							"position": 935,
						},
						"high": {
							"power": 616,
							"velocity": 116,
							"force": 19504,
							"position": 594,
						},
					},
				},
			],
		},
		"3232": {
			"position": {
				"chest": 2,
				"rom2": null,
				"rom1": null,
				"seat": null,
			},
			"sets": [
				{
					"model": "3232",
					"version": "47656C39",
					"serial": "0125 2013 0710 5633",
					"time": "2016-03-30T13:54:17-08:00",
					"resistance": 160,
					"precision": "int",
					"units": "lb",
					"repetitions": 8,
					"peak": 386,
					"work": 956,
					"distance": 7,
				}, {
					"model": "3232",
					"version": "47656C39",
					"serial": "0125 2013 0710 5633",
					"time": "2016-03-30T13:54:54-08:00",
					"resistance": 139,
					"precision": "int",
					"units": "lb",
					"repetitions": 4,
					"peak": 364,
					"work": 563,
					"distance": 6,
				},
			],
		},
	}

	return data;
}();

},{}],3:[function(require,module,exports){
module.exports = function () {
	'use strict';
	var machine = {};

	/*****************************************
	 *	Machine Definitions
	 *****************************************/
	const MACHINES = [{
		models: [0x1121, 0x112A],
		name: 'Leg Extension',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1122, 0x112B],
		name: 'Leg Extension',
		line: 'A250',
		extra: 'Range Limiter',
	}, {
		models: [0x1131, 0x113A],
		name: 'Leg Extension',
		line: 'A300',
		extra: '120 Degree',
	}, {
		models: [0x1132, 0x113B],
		name: 'Leg Extension',
		line: 'A300',
		extra: '90 Degree',
	}, {
		models: [0x1221, 0x122A],
		name: 'Leg Curl',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1222, 0x122B],
		name: 'Leg Curl',
		line: 'A250',
		extra: 'Range Limiter',
	}, {
		models: [0x1231, 0x123A],
		name: 'Leg Curl',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1321, 0x132A],
		name: 'Chest Press',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1331, 0x133A],
		name: 'Chest Press',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1335, 0x133B],
		name: 'Biaxial Chest Press',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1336, 0x133C],
		name: 'Straight Push Chest Press',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1337],
		name: 'Straight Push Chest Press',
		line: 'A300',
		extra: '2010-3-1',
	}, {
		models: [0x1338],
		name: 'Straight Push Chest Press',
		line: 'A300',
		extra: '2010-9-1',
	}, {
		models: [0x1431, 0x143A],
		name: 'Shoulder Raise',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1531, 0x153A],
		name: 'Squat',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1532, 0x153B],
		name: 'Squat',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1621, 0x162A],
		name: 'Military Press',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1631, 0x163A],
		name: 'Military Press',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1721, 0x172A],
		name: 'Arm Curl',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1736, 0x173B],
		name: 'Arm Curl',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1831, 0x183A],
		name: 'Shrug',
		line: 'A300',
		extra: '',
	}, {
		models: [0x1921, 0x192A],
		name: 'Tricep',
		line: 'A250',
		extra: '',
	}, {
		models: [0x1931, 0x193A],
		name: 'Tricep',
		line: 'A300',
		extra: '',
	},  {
		models: [0x2021, 0x202A],
		name: 'Upper Back',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2031, 0x2035, 0x203A, 0x203B],
		name: 'Upper Back',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2121, 0x212A],
		name: 'Lat Pulldown',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2131, 0x213A],
		name: 'Lat Pulldown',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2221, 0x222A],
		name: 'Seated Butterfly',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2231, 0x223A],
		name: 'Seated Butterfly',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2235, 0x223B],
		name: 'Seated Butterfly',
		line: 'A350',
		extra: '',
	}, {
		models: [0x2331, 0x233A],
		name: 'Abductor',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2431, 0x243A],
		name: 'Adductor',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2521, 0x252A],
		name: 'Leg Press',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2531, 0x253A],
		name: 'Leg Press',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2621, 0x262A],
		name: 'Standing Hip',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2631, 0x263A],
		name: 'Standing Hip',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2721, 0x272A],
		name: 'Abdominal',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2731, 0x273A],
		name: 'Abdominal',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2821, 0x282A],
		name: 'Lower Back',
		line: 'A250',
		extra: '',
	}, {
		models: [0x2822, 0x282B],
		name: 'Lower Back',
		line: 'A250',
		extra: 'Range Limiter',
	}, {
		models: [0x2831, 0x2836, 0x283A, 0x283B],
		name: 'Lower Back',
		line: 'A300',
		extra: '',
	}, {
		models: [0x2936, 0x293A],
		name: 'Seated Calf',
		line: 'A300',
		extra: '',
	}, {
		models: [0x3000, 0x300A],
		name: 'Performance Zone',
		line: 'Infinity',
		extra: '',
	}, {
		models: [0x3010, 0x301A],
		name: 'Performance Trainer',
		line: 'Infinity',
		extra: '',
	}, {
		models: [0x3020, 0x302A],
		name: 'Functional Trainer',
		line: 'Infinity',
		extra: '',
	}, {
		models: [0x3030, 0x303A],
		name: 'Triple Trainer',
		line: 'Infinity',
		extra: '',
	}, {
		models: [0x3040, 0x304A],
		name: 'Functional Wall Trainer',
		line: 'Infinity',
		extra: '',
	}, {
		models: [0x3100],
		name: 'Rack',
		line: 'Power Rack',
		extra: 'Seat Settings',
	}, {
		models: [0x3103, 0x3104, 0x3105, 0x3106, 0x3110, 0x3111, 0x3120],
		name: 'Rack',
		line: 'Power Rack',
		extra: 'Iron Weight',
	}, {
		models: [0x3231],
		name: 'Single Runner',
		line: 'A300',
		extra: '',
	}, {
		models: [0x3232, 0x323A],
		name: 'Dual Runner',
		line: 'A300',
		extra: '',
	},];

	/*****************************************
	 *	Machine Search
	 *
	 *	Note: Not the most efficient method
	 *	but it will on any browser.
	 *****************************************/

	machine.getMachineDetails = function (model) {
		for (var i = 0; i < MACHINES.length; i++) {
			for (var x = 0; x < MACHINES[i].models.length; x++) {
				if (MACHINES[i].models[x] == model) {
					return MACHINES[i];
				}
			}
		}
	};

	return machine;
}();

},{}],4:[function(require,module,exports){
module.exports = function () {
	'use strict';
	var keu = {};
	keu.machine = require('./machine');
	keu.messenger = require('./messenger');

	return keu;
}();

},{"./machine":3,"./messenger":5}],5:[function(require,module,exports){
module.exports = function () {
	'use strict';
	var messenger = {};

	/*****************************************
	 *	Constants
	 *****************************************/
	const MESSENGER_CONST = {
		TYPE: {
			RESPONSE: 'response',
			REQUEST: 'request'
		},
		ACTION: {
			CONNECT: 'connect',
			ECHIP_SET: 'echip-set',
			ECHIP_GET: 'echip-get'
		}
	}

	/*****************************************
	 *	Messenger Variables
	 *****************************************/
	var appWindow;
	var appOrigin;
	var status = {
		initialized: false,
		connected: false,
		enabled: false,
		actions: {
			eChipSet: false,
			eChipGet: false
		}
	};

	// Connection request message for reference
	var connectionRequestID;

	// Callback methods for portal requests
	var onGetRequestCallback;
	var onSetRequestCallback;

	/*****************************************
	 *	Receive Message
	 *****************************************/
	var receiveMessage = function (messageEvent) {
		if (!status.initialized) {
			initialize(messageEvent);
		} else {
			dispatch(messageEvent.data);
		}
	};

	/*****************************************
	 *	Send Message
	 *****************************************/
	var sendMessage = function (messageObject) {
		if (appWindow && appOrigin) {
			appWindow.postMessage(JSON.stringify(messageObject), appOrigin);
		}
	};

	/*****************************************
	 *	Compose Message
	 *****************************************/
	var composeMessage = function (id, type, action, data) {
		var messageObject = {
			id: id,
			type: type,
			action: action,
			data: data
		};
		sendMessage(messageObject);
	};

	/*****************************************
	 *	Messenger Initialization
	 *****************************************/
	var initialize = function (messageEvent) {
		var messageObject = JSON.parse(messageEvent.data);
		if ((messageObject || {})
			.action && messageObject.action === MESSENGER_CONST.ACTION.CONNECT) {
			appWindow = messageEvent.source;
			appOrigin = messageEvent.origin;
			connectionRequestID = messageObject.id;
			status.initialized = true;
			if (status.enabled) {
				connect();
			}
		}
	};

	/*****************************************
	 *	Messenger Dispatch
	 *****************************************/
	var dispatch = function (messageData) {
		if (status.enabled) {
			var messageObject = JSON.parse(messageData);
			if ((messageObject || {})
				.id) {
				switch (messageObject.action) {
				case MESSENGER_CONST.ACTION.ECHIP_SET:
					onSetRequestCallback(messageObject.data, function () {
						setRequestResponse(messageObject.id);
					});
					break;
				case MESSENGER_CONST.ACTION.ECHIP_GET:
					onGetRequestCallback(messageObject.data, function (data) {
						getRequestResponse(messageObject.id, data);
					});
					break;
				}
			}
		}
	};

	/*****************************************
	 *	Messenger Actions
	 *****************************************/
	var connect = function () {
		if (connectionRequestID) {
			var data = {
				actions: []
			};
			if (status.actions.eChipSet) {
				data.actions.push(MESSENGER_CONST.ACTION.ECHIP_SET);
			}
			if (status.actions.eChipGet) {
				data.actions.push(MESSENGER_CONST.ACTION.ECHIP_GET);
			}
			composeMessage(connectionRequestID, MESSENGER_CONST.TYPE.RESPONSE, MESSENGER_CONST.ACTION.CONNECT, data);
		}
	};

	var getRequestResponse = function (id, data) {
		composeMessage(id, MESSENGER_CONST.TYPE.RESPONSE, MESSENGER_CONST.ACTION.ECHIP_GET, data);
	};

	var setRequestResponse = function (id) {
		var data = {
			success: true
		};
		composeMessage(id, MESSENGER_CONST.TYPE.RESPONSE, MESSENGER_CONST.ACTION.ECHIP_SET, data);
	};

	/*****************************************
	 *	Messenger Enabled
	 *****************************************/
	messenger.enable = function (onGetRequest, onSetRequest) {
		if (typeof onGetRequest === 'function') {
			status.actions.eChipGet = true;
			onGetRequestCallback = onGetRequest;
		}
		if (typeof onSetRequest === 'function') {
			status.actions.eChipSet = true;
			onSetRequestCallback = onSetRequest;
		}
		status.enabled = true;
		if (status.initialized) {
			connect();
		}
	};

	/*****************************************
	 *	Messenger Disable
	 *****************************************/
	messenger.disable = function () {
		status.enabled = false;
		status.actions.eChipGet = false;
		status.actions.eChipSet = false;
		onGetRequestCallback = null;
		onSetRequestCallback = null;
		if (status.initialized) {
			connect();
		}
	};

	window.addEventListener('message', receiveMessage);
	return messenger;
}();

},{}]},{},[1]);
