module.exports = function () {
	'use strict';
	var eCp = {};

	/*
	 *	Parser
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
		var fatBuffer = (Math.floor(page / 30) * 32) + 31;
		var fatBufferOffset = (page % 30);
		var nextPage = data[fatBuffer][fatBufferOffset];
		var dataPage = data[page];

		var rep = {};
		rep.time = bytesToTime(dataPage[0], dataPage[1], dataPage[2], dataPage[3]);
		rep.resistance = byteToWord(dataPage[4], dataPage[5]);
		rep.reps = dataPage[6];
		rep.model = parseInt(byteToString(dataPage[7], dataPage[8]));
		rep.version = byteToLongString(dataPage[12], dataPage[11], dataPage[10], dataPage[9]);

		if (rep.reps == 254) {
			parseRepTest(dataPage, rep);
		} else {
			parseRepNormal(dataPage, rep);
		}

		if (!machineObject.reps) {
			machineObject.reps = [];
		}
		machineObject.reps.push(rep);
		if (nextPage != 254 && nextPage != 31 && nextPage != 32) {
			parseMachineRep(data, machineObject, nextPage);
		}
	};

	var parseRepTest = function (dataPage, repObject) {
		rep.reps = null;
	};

	var parseRepNormal = function (dataPage, repObject) {};

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
