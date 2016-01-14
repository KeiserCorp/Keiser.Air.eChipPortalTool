/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
var ow = require('1-wire-js');
chrome.app.runtime.onLaunched.addListener(function (launchData) {
	chrome.app.window.create(
		'index.html', {
		id : 'mainWindow',
		state : 'maximized'
	}, function (appWindow) {
		appWindow.contentWindow.ow = ow;
		appWindow.onClosed.addListener(function () {
			ow.deviceClose();
		});
	});
});
