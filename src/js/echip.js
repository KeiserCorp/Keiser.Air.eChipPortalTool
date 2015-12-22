module.exports = function () {
	'use strict';
	var $ = require('jquery');
	var ow = require('1-wire-js');
	var eChip = {};

	/*
	 *	External Properties
	 */
	eChip.status = {
		permissionGranted : false,
		deviceConnected : false,
		keyConnected : false,
		keyAction : ''
	};

	/*
	 *	Initialization
	 */
	eChip.initialize = function () {
		ow.checkPermission().then(gotPermission);
		ow.onDeviceAdded.addListener(deviceConnected);
		ow.onDeviceRemoved.addListener(deviceRemoved)
	};

	/*
	 *	Permission
	 */
	var gotPermission = function () {
		eChip.status.permissionGranted = true;
		awaitDevice();
	};

	var failedPermission = function () {
		/* For now do nothing */
	};

	eChip.requestPermission = function () {
		ow.requestPermission().then(gotPermission, failedPermission);
	};

	/*
	 *	Device
	 */
	var awaitDevice = function () {
		deviceRemoved();
		ow.deviceOpen().then(deviceOpened);
	};

	var deviceConnected = function (device) {
		ow.deviceOpen().then(deviceOpened);
	};

	var deviceRemoved = function () {
		eChip.status.deviceConnected = false;
		eChip.status.keyConnected = false;
		eChip.status.keyAction = '';
		keyStateClear();
	};

	var deviceOpened = function () {
		eChip.status.deviceConnected = true;
		ow.deviceReset().then(keyGetRom);
	};

	/*
	 *	Key State
	 */
	const keyStateDefault = {
		rom : null,
		data : null
	};

	eChip.keyState = $.extend({}, keyStateDefault);

	var keyStateClear = function () {
		$.extend(eChip.keyState, keyStateDefault);
	};

	/*
	 *	Key Monitoring
	 */
	var keyAwait = function () {
		var interruptTimeout = function (result) {
			if (result.ResultRegisters && result.ResultRegisters.DetectKey) {
				keyGetRom()
				.fail(function () {
					keyAwait();
				});
			} else {
				eChip.status.keyConnected = false;
				eChip.status.keyAction = '';
				keyStateClear();
				keyAwait();
			}
		};
		setTimeout(function () {
			ow.deviceInterruptTransfer()
			.then(interruptTimeout);
		}, 500);
	};

	var keyMonitorQueue = function () {
		var km = {};
		var commands = [];
		km.add = function (fn) {
			commands.push(fn);
		};
		km.runNext = function (nextCommand) {
			var fn = commands.shift();
			if (fn) {
				return fn.call().then(nextCommand);
			}
			return nextCommand.call();
		};
		return km;
	}
	();

	var keyMonitor = function () {
		setTimeout(function () {
			ow.keySearchFirst().then(function (rom) {
				if (romsAreEqual(rom, eChip.keyState.rom)) {
					keyMonitorQueue.runNext(keyMonitor);
				} else {
					keyAwait();
				}
			}, keyAwait);
		}, 500);
	};

	var romsAreEqual = function (rom1, rom2) {
		return $(rom1).not(rom2).length === 0 && $(rom2).not(rom1).length === 0;
	};

	var keyGetRom = function () {
		return ow.keySearchFirst()
		.then(function (rom) {
			if (rom[0] === 0x0C) {
				eChip.keyState.rom = rom;
				eChip.status.keyConnected = true;
				keyMonitor();
			} else {
				keyAwait();
			}
		}, keyAwait);
	};

	/*
	 *	Key Data Methods
	 */

	var keyGetData = function (retry) {
		eChip.status.keyAction = 'get';
		return ow.keyReadAll(eChip.keyState.rom, true)
		.then(function (data) {
			eChip.keyState.data = data;
			eChip.status.keyAction = '';
		}).fail(function (error) {
			if (retry) {
				console.log('Memory Read Error: ' + error.message + ' [Cancelled]');
			} else {
				console.log('Memory Read Error: ' + error.message + ' [Retrying]');
				return ow.deviceReset()
				.then(function () {
					return keyGetData(true);
				});
			}
		});
	};

	var keyClearData = function (retry) {
		eChip.status.keyAction = 'clear';
		var data = new Array(256);
		for (var x = 0; x < data.length; x++) {
			data[x] = new Uint8Array(32);
			for (var y = 0; y < data[x].length; y++) {
				data[x][y] = 0x55;
			}
		}
		return ow.keyWriteDiff(eChip.keyState.rom, data, eChip.keyState.data, true)
		.then(function () {
			eChip.status.keyAction = '';
			eChip.keyRead();
		})
		.fail(function (error) {
			if (retry) {
				console.log('Memory Clear Error: ' + error.message + ' [Cancelled]');
			} else {
				console.log('Memory Clear Error: ' + error.message + ' [Retrying]');
				return ow.deviceReset()
				.then(function () {
					return keyClearData(true);
				});
			}
		});
	};

	/*
	 *	Key Monitor Action Queue Methods
	 */
	eChip.keyRead = function () {
		keyMonitorQueue.add(function () {
			return keyGetData();
		});
	};

	eChip.keyClear = function () {
		keyMonitorQueue.add(function () {
			return keyClearData();
		});
	};

	return eChip;
}
();
