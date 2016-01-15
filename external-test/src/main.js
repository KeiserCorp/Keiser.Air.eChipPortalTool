(function () {
	var keu = require('keiser-echip-utilities');
	/*var keu = require('D:/Development/Keiser/Keiser.Air/Keiser.Air.eChipUtilities/');*/
	var testData = require('./test-data.js');
	var output = document.getElementById("output");

	keu.messenger.enable(function () {
		return testData.test1;
	}, function (data, success) {
		output.innerHTML = syntaxHighlight(data);
		success();
	});

	function syntaxHighlight(json) {
		if (typeof json != 'string') {
			json = JSON.stringify(json, undefined, 2);
		}
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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
