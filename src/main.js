'use strict';
var ow = require('1-wire-js');
var Vue = require('vue');

var webPortal = document.getElementById('webPortal');

window.onload = function () {
	webPortal.src = 'https://ips.keiser.com/';
}

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
