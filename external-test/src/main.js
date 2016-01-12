(function () {
	var keu = require('keiser-echip-utilities');
	var output = document.getElementById("output");
	var appWindow;
	var appOrigin;

	function onMessage(messageEvent) {
		appWindow = messageEvent.source;
		appOrigin = messageEvent.origin;
		var messageObject = JSON.parse(messageEvent.data);

		if (messageObject.type == 'request' && messageObject.action == 'connect') {
			var responseMessageObject = {
				id : messageObject.id,
				type : 'response',
				action : 'connect',
				data : {
					actions : ['echip-set']
				}
			};
			sendMessage(responseMessageObject);
		}

		if (messageObject.type == 'request' && messageObject.action == 'echip-set') {
			var responseMessageObject = {
				id : messageObject.id,
				type : 'response',
				action : 'echip-set',
				data : {
					success : true
				}
			};
			sendMessage(responseMessageObject);
		}

		addMachineNames(messageObject);
		output.innerHTML = syntaxHighlight(messageObject);
	}

	function sendMessage(messageObject) {
		if (appWindow && appOrigin) {
			appWindow.postMessage(JSON.stringify(messageObject), appOrigin)
		}
	}

	function addMachineNames(messageObject) {
		if (messageObject.action == 'echip-set') {
			console.log(messageObject.data.machines);
			Object.keys(messageObject.data.machines).forEach(function (model) {  
				messageObject.data.machines[model].name = keu.machines.getMachine(parseInt(model, 16)).name;
			});
		}
	}

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

	window.addEventListener('message', onMessage);
})();
