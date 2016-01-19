var ow = require('1-wire-js');
chrome.app.runtime.onLaunched.addListener(function (launchData) {
	chrome.app.window.create(
		'index.html', {
			id: 'mainWindow',
			state: 'maximized'
		},
		function (appWindow) {
			appWindow.contentWindow.ow = ow;
			appWindow.onClosed.addListener(function () {
				ow.deviceClose();
			});
		});
});
