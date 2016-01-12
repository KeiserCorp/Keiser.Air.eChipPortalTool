module.exports = function () {
	'use strict';
	var moment = require('moment');
	var eCp = {};

	/*
	 *	Parser
	 *
	 *	Machine Parser:	Parses most new machines.  Does not handle Heavy Negative Machines or
	 *					Special Runners.  Extra Data seat positions are not being included.
	 */
	eCp.parse = function (data) {
		var eChipObject = {};
		if (validData(data)) {
			parseDirectory(data, eChipObject);
		} else {
			throw new Error('Invalid Data Structure');
		}
		return eChipObject;
	};

	var validData = function (data) {
		var valid = true;
		data.forEach(function (page) {
			if (!emptyPage(page)) {
				var crc = 0;
				for (var x = 0; x < 32; x++) {
					crc = crc16(page[x], crc);
				}
				if (crc != 0xB001) {
					valid = false;
				}
			}
		});
		return valid;
	};

	var parseDirectory = function (data, eChipObject) {
		for (var y = 1; y <= 8; y++) {
			for (var x = 0; x < 3; x++) {
				var pageOffset = (y * 32) - 2;
				var bufferOffset = x * 10;
				if (data[pageOffset][bufferOffset] === 1) {
					var model = byteToString(data[pageOffset][bufferOffset + 1], data[pageOffset][bufferOffset + 2]);
					eChipObject[model] = {
						position : {
							chest : valueOrNull(data[pageOffset][bufferOffset + 3]),
							rom2 : valueOrNull(data[pageOffset][bufferOffset + 4]),
							rom1 : valueOrNull(data[pageOffset][bufferOffset + 5]),
							seat : valueOrNull(data[pageOffset][bufferOffset + 6]),
						}
					};
					var firstPage = data[pageOffset][bufferOffset + 7];
					parseMachineRep(data, eChipObject[model], firstPage);
				}
			}
		}
	};

	var parseMachineRep = function (data, machineObject, page) {
		const POWER_TEST = 'Power';
		const A420_6R_TEST = 'A420 6-Rep';
		const A420_10R_TEST = 'A420 10-Rep';

		var fatBuffer = (Math.floor(page / 30) * 32) + 31;
		var fatBufferOffset = (page % 30);
		var nextPage = data[fatBuffer][fatBufferOffset];
		var dataPage = data[page];

		var rep = {};
		rep.model = byteToString(dataPage[7], dataPage[8]);
		rep.version = byteToLongString(dataPage[12], dataPage[11], dataPage[10], dataPage[9]);
		rep.serial = byteToSerialString(dataPage[13], dataPage[14], dataPage[15], dataPage[16], dataPage[17], rep.version);
		rep.time = bytesToTime(dataPage[0], dataPage[1], dataPage[2], dataPage[3]);
		rep.resistance = byteToWord(dataPage[4], dataPage[5]);
		rep.units = null;
		rep.reps = dataPage[6];

		if (unitVersion(rep.version)) {
			if ((dataPage[17] & 0x80) == 0x80) {
				rep.resistance = rep.resistance / 10;
			}

			switch (dataPage[17] & 0x60) {
			case 0x00:
				rep.units = 'lb';
				break;
			case 0x20:
				rep.units = 'kg';
				break;
			case 0x40:
				rep.units = 'ne';
				break;
			case 0x60:
				rep.units = 'er';
				break;
			}
		}

		if (testVersion(rep.version)) {
			if (rep.reps <= 254 && rep.reps >= 252) {
				rep.test = {};
				switch (rep.reps) {
				case 254:
					rep.test.type = POWER_TEST;
					rep.test = {
						low : decodePackData(dataPage, 18),
						high : decodePackData(dataPage, 24)
					};
					break;
				case 253:
					rep.test.type = A420_6R_TEST;
					break;
				case 252:
					rep.test.type = A420_10R_TEST;
					break;
				}
				rep.reps = null;
			} else {
				if (peakPowerVersion(rep.version)) {

					rep.peak = byteToWord(dataPage[20], dataPage[21]);
					rep.work = Math.round(byteToLongWord(dataPage[22], dataPage[23], dataPage[24], dataPage[25]) / 64);

					if ((parseInt(rep.model, 16) & 0xFF00) == 0x3200) {
						rep.distance = byteToWord(dataPage[18], dataPage[19]);
					}
				}
			}
		}

		if (!machineObject.reps) {
			machineObject.reps = [];
		}
		machineObject.reps.push(rep);

		if (nextPage != 254 && nextPage != 31 && nextPage != 32) {
			parseMachineRep(data, machineObject, nextPage);
		}
	};

	var decodePackData = function (dataPage, pageOffset) {
		var testObject = {};
		testObject.Power = dataPage[pageOffset] + ((dataPage[pageOffset + 2] & 0x1F) << 8);
		testObject.Velocity = dataPage[pageOffset + 1] + ((dataPage[pageOffset + 2] & 0xE0) << 3) + (((dataPage[pageOffset + 2] & 0x80) >> 7) * 0xF8);
		testObject.Force = (dataPage[pageOffset + 3] + ((dataPage[pageOffset + 5] & 0xF0) << 4)) << 4;
		testObject.Position = dataPage[pageOffset + 4] + ((dataPage[pageOffset + 5] & 0x0F) << 8);
		return testObject;
	};

	/*
	 *	Version Tests
	 */
	/* 	var heavyNegativeVersion = function (version) {
	var versionValue = parseInt(version, 16);
	return (versionValue > 0x3D81A828) ||
	(versionValue == 0x3CFD7AEF) ||
	(versionValue == 0x3D047497) ||
	(versionValue == 0x3D276E40) ||
	(versionValue == 0x3D3E72CE);
	}; */

	var testVersion = function (version) {
		var versionValue = parseInt(version, 16);
		return (versionValue > 0x2F6579F0);
	};

	var peakPowerVersion = function (version) {
		var versionValue = parseInt(version, 16);
		return (versionValue > 0x32BA5C89);
	};

	/* 	var seatPositionVersion = function (version) {
	var versionValue = parseInt(version, 16);
	return (versionValue > 0x3B555162);
	}; */

	/* 	var timeZoneVersion = function (version) {
	var versionValue = parseInt(version, 16);
	return (versionValue > 0x2B9D6AF9);
	}; */

	var unitVersion = function (version) {
		var versionValue = parseInt(version, 16);
		return (versionValue > 0x318E4F00);
	};

	/*
	 *	Builder
	 */
	eCp.build = function (eChipObject) {
		var data = eCp.buildEmpty();

		return data;
	};

	/*
	 *	Build Empty Chip
	 */
	eCp.buildEmpty = function () {
		var data = new Array(256);
		for (var y = 0; y < data.length; y++) {
			data[y] = new Uint8Array(32);
			for (var x = 0; x < data[y].length; x++) {
				if (y > 0 && (y % 32 === 30 || y % 32 === 31)) {
					if (x == data[y].length - 1) {
						data[y][x] = 0xCF;
					} else {
						data[y][x] = 0xFF;
					}
				} else {
					data[y][x] = 0x55;
				}
			}
		}

		return data;
	};

	/*
	 *	Helper Methods
	 */
	var byteToWord = function (lsb, msb) {
		return ((msb & 0xff) << 8) | (lsb & 0xff);
	};

	var byteToLongWord = function (lsb, byte2, byte3, msb) {
		return ((msb & 0xff) << 24) | ((byte3 & 0xff) << 16) | ((byte2 & 0xff) << 8) | (lsb & 0xff);
	};

	var byteToString = function (lsb, msb) {
		return ('0000' + (msb.toString(16) + lsb.toString(16))).substr(-4).toUpperCase();
	};

	var byteToLongString = function (lsb, byte2, byte3, msb) {
		return ('00000000' + (msb.toString(16) + byte3.toString(16) + byte2.toString(16) + lsb.toString(16))).substr(-8).toUpperCase();
	};

	var bytesToTime = function (lsb, byte2, byte3, msb) {
		return new Date(byteToLongWord(lsb, byte2, byte3, msb) * 1000);
	};

	var byteToSerialString = function (lsb, byte2, byte3, msb, channel, version) {
		var time = bytesToTime(lsb, byte2, byte3, msb);
		var serial = moment(time).utc().format('MMDD YYYY HHmm ss');
		if (unitVersion(version)) {
			serial += ('00' + ((channel & 0x1F) + 0x20).toString()).substr(-2);
		} else {
			serial += ((channel & 0xF0) / 0x10).toString(16);
			serial += (channel & 0x1f).toString(16);
		}
		return serial;
	};

	var valueOrNull = function (value) {
		return (value === 255) ? null : value;
	};

	var emptyPage = function (page) {
		var empty = true;
		page.forEach(function (tuple) {
			if (tuple != 0x55) {
				empty = false;
			}
		});
		return empty;
	};

	var crc16 = function (data, crc) {
		var value = data;
		for (var x = 1; x <= 8; x++) {
			var odd = (value^crc) % 2;
			crc = crc >> 1;
			value = value >> 1;
			if (odd) {
				crc = crc^0xA001;
			}
		}
		return crc;
	};

	return eCp;
}
();
