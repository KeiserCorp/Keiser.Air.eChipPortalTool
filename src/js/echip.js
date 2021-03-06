module.exports = function() {
	'use strict';
	var development = process.env.NODE_ENV !== 'production';
	var $ = require('jquery');
	var ow = window.ow;
	var eChipParser = require('./echip-parser.js');
	var eChip = {};

	/*
	 *	External Properties
	 */
	eChip.status = {
		permissionGranted: false,
		deviceConnected: false,
		keyConnected: false,
		keyAction: '',
		error: ''
	};

	/*
	 *	Initialization
	 */
	eChip.initialize = function() {
		ow
			.permission
			.check()
			.then(gotPermission);
		ow
			.device
			.onDeviceAdded
			.addListener(deviceConnected);
		ow
			.device
			.onDeviceRemoved
			.addListener(deviceRemoved);
	};

	/*
	 *	Permission
	 */
	var gotPermission = function() {
		eChip.status.permissionGranted = true;
		awaitDevice();
	};

	var failedPermission = function() {
		/* For now do nothing */
	};

	eChip.requestPermission = function() {
		ow
			.permission
			.request()
			.then(gotPermission, failedPermission);
	};

	/*
	 *	Device
	 */
	var awaitDevice = function() {
		deviceRemoved();
		ow
			.device
			.open()
			.then(deviceOpened);
	};

	var deviceConnected = function(device) {
		ow
			.device
			.open()
			.then(deviceOpened);
	};

	var deviceRemoved = function() {
		eChip.status.deviceConnected = false;
		eChip.status.keyConnected = false;
		eChip.status.keyAction = '';
		eChip.status.error = '';
		keyStateClear();
	};

	var deviceOpened = function() {
		if (development) {
			console.log("Reader Connected");
		}
		eChip.status.deviceConnected = true;
		ow
			.device
			.reset()
			.then(keyGetRom);
	};

	/*
	 *	Key State
	 */
	const keyStateDefault = {
		rom: null,
		data: null,
		parsedData: null,
		read: false,
		empty: true
	};

	eChip.keyState = $.extend({}, keyStateDefault);

	var keyStateClear = function() {
		$.extend(eChip.keyState, keyStateDefault);
	};

	var keyStateDataClear = function() {
		$.extend(eChip.keyState, {
			data: null,
			parsedData: null,
			read: false,
			empty: true
		});
	};

	/*
	 *	Key Monitoring
	 */
	var keyAwait = function() {
		var interruptTimeout = function(result) {
			if (development) {
				console.log("eChip Detected: " + ((result.ResultRegisters || {}).DetectKey || false));
			}
			if (result.ResultRegisters && result.ResultRegisters.DetectKey) {
				keyGetRom()
					.fail(function() {
						keyAwait();
					});
			} else {
				eChip.status.keyConnected = false;
				eChip.status.keyAction = '';
				eChip.status.error = '';
				keyStateClear();
				var timer = setTimeout(function() {
					keyAwait();
				}, 50);
				//keyAwait();
			}
		};
		ow
			.device
			.interruptTransfer()
			.then(interruptTimeout);
	};

	var keyMonitorQueue = function() {
		var km = {};
		var commands = [];
		km.add = function(fn) {
			commands.push(fn);
		};
		km.runNext = function(nextCommand) {
			var fn = commands.shift();
			if (fn) {
				var fnReturn = fn.call();
				if ((fnReturn || {}).then && fnReturn.fail) {
					return fnReturn
						.then(nextCommand)
						.fail(function(e) {
							console.log(e);
						});
				}
			}
			return nextCommand.call();
		};
		km.hasNext = function() {
			return commands.length > 0;
		};
		km.clear = function() {
			commands = [];
		};
		return km;
	}();

	var keyMonitor = function() {
		setTimeout(function() {
			if (development) {
				console.log("eChip Action Queued: " + keyMonitorQueue.hasNext());
			}
			ow
				.key
				.searchFirst()
				.then(function(rom) {
					if (romsAreEqual(rom, eChip.keyState.rom)) {
						keyMonitorQueue.runNext(keyMonitor);
					} else {
						keyAwait();
					}
				}, keyAwait);
		}, 500);
	};

	var romsAreEqual = function(rom1, rom2) {
		return $(rom1)
			.not(rom2)
			.length === 0 && $(rom2)
			.not(rom1)
			.length === 0;
	};

	var keyGetRom = function() {
		return ow
			.key
			.searchFirst()
			.then(function(rom) {
				if (development) {
					console.log("eChip ID: " + JSON.stringify(rom));
				}
				if (rom[0] === 0x0C) {
					eChip.keyState.rom = rom;
					eChip.status.keyConnected = true;
					keyMonitorQueue.clear();
					eChip.keyRefresh();
					keyMonitor();
				} else {
					keyAwait();
				}
			}, keyAwait);
	};

	/*
	 *	Key Data Methods
	 */
	var keyGetData = function(retryCount) {
		eChip.status.keyAction = 'get';
		keyStateDataClear();
		return ow
			.key
			.readAll(eChip.keyState.rom, true)
			.then(function(data) {
				return keySetData(data);
			})
			.fail(function(error) {
				if (retryCount > 3) {
					console.log('Memory Read Error: ' + error.message + ' [Cancelled]');
					eChip.status.error = 'Memory Read Error';
				} else {
					console.log('Memory Read Error: ' + error.message + ' [Retrying]');
					return ow
						.device
						.reset()
						.then(function() {
							if (!retryCount) {
								retryCount = 0;
							}
							return keyGetData(++retryCount);
						});
				}
			});
	};

	var keyWriteData = function(data, retry) {
		eChip.status.keyAction = 'set';
		keyStateDataClear();
		return ow
			.key
			.writeDiff(eChip.keyState.rom, data, eChip.keyState.data, true)
			.then(function() {
				return keySetData(data);
			})
			.fail(function(error) {
				if (retry) {
					console.log('Memory Write Error: ' + error.message + ' [Cancelled]');
					eChip.status.error = 'Memory Write Error';
				} else {
					console.log('Memory Write Error: ' + error.message + ' [Retrying]');
					return ow
						.device
						.reset()
						.then(function() {
							return keyWriteData(data, true);
						});
				}
			});
	};

	var keyClearData = function(retry) {
		eChip.status.keyAction = 'clear';
		keyStateDataClear();
		var data = eChipParser.buildEmpty();
		return ow
			.key
			.writeDiff(eChip.keyState.rom, data, eChip.keyState.data, true)
			.then(function() {
				return keySetData(data);
			})
			.fail(function(error) {
				if (retry) {
					console.log('Memory Clear Error: ' + error.message + ' [Cancelled]');
					eChip.status.error = 'Memory Clear Error';
				} else {
					console.log('Memory Clear Error: ' + error.message + ' [Retrying]');
					return ow
						.device
						.reset()
						.then(function() {
							return keyClearData(true);
						});
				}
			});
	};

	var keySetData = function(data) {
		eChip.keyState.data = data;
		eChip.keyState.read = true;
		eChip.status.keyAction = '';
		eChip.status.error = '';
		keyParseData();
		eChip.keyState.empty = (Object.keys(eChip.keyState.parsedData).length == 0);
		return eChip.keyState;
	};

	/*
	 *	eChip Parser
	 */
	var keyParseData = function() {
		eChip.keyState.parsedData = eChipParser.parse(eChip.keyState.data);
	};

	/*
	 *	Key Monitor Action Queue Methods
	 */
	eChip.keyRefresh = function(callback) {
		keyMonitorQueue
			.add(function() {
				return keyGetData().then(callback);
			});
	};

	eChip.keyRead = function(callback) {
		if (!eChip.keyState.data) {
			keyMonitorQueue
				.add(function() {
					if (!eChip.keyState.data) {
						return keyGetData().then(callback);
					} else {
						return callback(eChip.keyState);
					}
				});
		} else {
			callback(eChip.keyState);
		}
	};

	eChip.keyWrite = function(dataObject) {
		var data = eChipParser.build(dataObject);
		keyMonitorQueue.add(function() {
			return keyWriteData(data);
		});
	};

	eChip.keyClear = function() {
		keyMonitorQueue
			.add(function() {
				return keyClearData();
			});
	};

	return eChip;
}();
