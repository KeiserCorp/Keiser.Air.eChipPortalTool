'use strict';
window.jQuery = require('jquery');
var UIKit = require('uikit');
var Vue = require('vue');
var OW = require('1-wire-js');

var webPortal = document.getElementById('webPortal');

window.onload = function () {
	webPortal.src = 'https://ips.keiser.com/';
}

new Vue({
  el: 'body',
  data: {
    message: 'Hello Vue.js!'
  }
})
