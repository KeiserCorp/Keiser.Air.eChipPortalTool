!function e(i,n,t){function r(o,a){if(!n[o]){if(!i[o]){var l="function"==typeof require&&require;if(!a&&l)return l(o,!0);if(s)return s(o,!0);var m=new Error("Cannot find module '"+o+"'");throw m.code="MODULE_NOT_FOUND",m}var c=n[o]={exports:{}};i[o][0].call(c.exports,function(e){var n=i[o][1][e];return r(n?n:e)},c,c.exports,e,i,n,t)}return n[o].exports}for(var s="function"==typeof require&&require,o=0;o<t.length;o++)r(t[o]);return r}({1:[function(e,i,n){!function(){function i(e){return"string"!=typeof e&&(e=JSON.stringify(e,void 0,2)),e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),e.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){var i="number";return/^"/.test(e)?i=/:$/.test(e)?"key":"string":/true|false/.test(e)?i="boolean":/null/.test(e)&&(i="null"),'<span class="'+i+'">'+e+"</span>"})}var n=e("keiser-echip-utilities"),t=e("./test-data.js"),r=document.getElementById("output");n.messenger.enable(function(){return t.test1},function(e,n){r.innerHTML=i(e),n()})}()},{"./test-data.js":2,"keiser-echip-utilities":4}],2:[function(e,i,n){i.exports=function(){"use strict";var e={};return e.test1={1335:{position:{chest:null,rom2:3,rom1:null,seat:3},reps:[{model:"1335",version:"3EC8495A",serial:"0124 2013 0858 4743",time:"2016-03-17T13:49:03-08:00",resistance:84,precision:"int",units:"lb",repetitions:6,test:{type:"power6r",low:{power:485,velocity:226,force:6384,position:2006},high:{power:626,velocity:170,force:10880,position:1822}}},{model:"1335",version:"3EC8495A",serial:"0124 2013 0858 4743",time:"2016-03-17T13:53:34-08:00",resistance:58,precision:"int",units:"lb",repetitions:5,peak:497,work:602},{model:"1335",version:"3EC8495A",serial:"0124 2013 0858 4743",time:"2016-03-17T13:53:56-08:00",resistance:58,precision:"int",units:"lb",repetitions:4,peak:492,work:441}]},1338:{position:{chest:null,rom2:null,rom1:null,seat:2},reps:[{model:"1338",version:"0465B73E",serial:"0128 2016 1222 4900",time:"2016-03-17T13:22:57-08:00",resistance:35,precision:"int",units:null,repetitions:7},{model:"1338",version:"0465B73E",serial:"0128 2016 1222 4900",time:"2016-03-17T13:23:25-08:00",resistance:41,precision:"int",units:null,repetitions:5},{model:"1338",version:"0465B73E",serial:"0128 2016 1222 4900",time:"2016-03-17T13:23:45-08:00",resistance:161,precision:"int",units:null,repetitions:252},{model:"1338",version:"0465B73E",serial:"0128 2016 1222 4900",time:"2016-03-17T13:28:46-08:00",resistance:51,precision:"int",units:null,repetitions:253}]},2121:{position:{chest:null,rom2:4,rom1:null,seat:6},reps:[{model:"2121",version:"3EC8495A",serial:"0121 2013 1632 1946",time:"2016-03-17T13:50:10-08:00",resistance:15,precision:"int",units:"lb",repetitions:10,peak:429,work:889},{model:"2121",version:"3EC8495A",serial:"0121 2013 1632 1946",time:"2016-03-17T13:50:52-08:00",resistance:37,precision:"int",units:"lb",repetitions:11,peak:657,work:981}]},2621:{position:{chest:3,rom2:null,rom1:2,seat:null},reps:[{model:"2621",version:"3EC8495A",serial:"0124 2013 0858 4733",time:"2016-03-17T13:55:19-08:00",resistance:8,precision:"int",units:"lb",repetitions:8,peak:67,work:158}]},3010:{position:{chest:null,rom2:1,rom1:0,seat:null},reps:[{model:"3010",version:"3EC8495A",serial:"0121 2013 1632 1936",time:"2016-03-17T13:47:51-08:00",resistance:20.6,precision:"dec",units:"lb",repetitions:6,peak:381,work:219},{model:"3010",version:"3EC8495A",serial:"0121 2013 1632 1936",time:"2016-03-17T13:48:17-08:00",resistance:33.5,precision:"dec",units:"lb",repetitions:6,test:{type:"power6r",low:{power:246,velocity:168,force:5360,position:785},high:{power:455,velocity:130,force:12848,position:700}}}]},3020:{position:{chest:8,rom2:8,rom1:0,seat:2},reps:[{model:"3020",version:"3EC8495A",serial:"0124 2013 0742 0540",time:"2016-03-17T13:48:47-08:00",resistance:8.5,precision:"dec",units:"lb",repetitions:5,peak:162,work:119},{model:"3020",version:"3EC8495A",serial:"0124 2013 0742 0540",time:"2016-03-17T13:49:11-08:00",resistance:8.5,precision:"dec",units:"lb",repetitions:5,peak:193,work:174},{model:"3020",version:"3EC8495A",serial:"0124 2013 0742 0540",time:"2016-03-17T13:49:18-08:00",resistance:8.4,precision:"dec",units:"lb",repetitions:6,test:{type:"power6r",low:{power:165,velocity:133,force:4560,position:864},high:{power:621,velocity:117,force:19488,position:634}}},{model:"3020",version:"3EC8495A",serial:"0124 2013 0742 0540",time:"2016-03-17T13:49:50-08:00",resistance:26.1,precision:"dec",units:"lb",repetitions:6,test:{type:"power6r",low:{power:264,velocity:149,force:6496,position:935},high:{power:616,velocity:116,force:19504,position:594}}}]},3232:{position:{chest:2,rom2:null,rom1:null,seat:null},reps:[{model:"3232",version:"47656C39",serial:"0125 2013 0710 5633",time:"2016-03-17T13:54:17-08:00",resistance:160,precision:"int",units:"lb",repetitions:8,peak:386,work:956,distance:7},{model:"3232",version:"47656C39",serial:"0125 2013 0710 5633",time:"2016-03-17T13:54:54-08:00",resistance:139,precision:"int",units:"lb",repetitions:4,peak:364,work:563,distance:6}]}},e}()},{}],3:[function(e,i,n){i.exports=function(){"use strict";var e={};const i=[{models:[4385,4394],name:"Leg Extension",line:"A250",extra:""},{models:[4386,4395],name:"Leg Extension",line:"A250",extra:"Range Limiter"},{models:[4401,4410],name:"Leg Extension",line:"A300",extra:"120 Degree"},{models:[4402,4411],name:"Leg Extension",line:"A300",extra:"90 Degree"},{models:[4641,4650],name:"Leg Curl",line:"A250",extra:""},{models:[4642,4651],name:"Leg Curl",line:"A250",extra:"Range Limiter"},{models:[4657,4666],name:"Leg Curl",line:"A300",extra:""},{models:[4897,4906],name:"Chest Press",line:"A250",extra:""},{models:[4913,4922],name:"Chest Press",line:"A300",extra:""},{models:[4917,4923],name:"Biaxial Chest Press",line:"A300",extra:""},{models:[4918,4924],name:"Straight Push Chest Press",line:"A300",extra:""},{models:[4919],name:"Straight Push Chest Press",line:"A300",extra:"2010-3-1"},{models:[4920],name:"Straight Push Chest Press",line:"A300",extra:"2010-9-1"},{models:[5169,5178],name:"Shoulder Raise",line:"A300",extra:""},{models:[5425,5434],name:"Squat",line:"A300",extra:""},{models:[5426,5435],name:"Squat",line:"A300",extra:""},{models:[5665,5674],name:"Military Press",line:"A250",extra:""},{models:[5681,5690],name:"Military Press",line:"A300",extra:""},{models:[5921,5930],name:"Arm Curl",line:"A250",extra:""},{models:[5942,5947],name:"Arm Curl",line:"A300",extra:""},{models:[6193,6202],name:"Shrug",line:"A300",extra:""},{models:[6433,6442],name:"Tricep",line:"A250",extra:""},{models:[6449,6458],name:"Tricep",line:"A300",extra:""},{models:[8225,8234],name:"Upper Back",line:"A250",extra:""},{models:[8241,8245,8250,8251],name:"Upper Back",line:"A300",extra:""},{models:[8481,8490],name:"Lat Pulldown",line:"A250",extra:""},{models:[8497,8506],name:"Lat Pulldown",line:"A300",extra:""},{models:[8737,8746],name:"Seated Butterfly",line:"A250",extra:""},{models:[8753,8762],name:"Seated Butterfly",line:"A300",extra:""},{models:[8757,8763],name:"Seated Butterfly",line:"A350",extra:""},{models:[9009,9018],name:"Abductor",line:"A300",extra:""},{models:[9265,9274],name:"Adductor",line:"A300",extra:""},{models:[9505,9514],name:"Leg Press",line:"A250",extra:""},{models:[9521,9530],name:"Leg Press",line:"A300",extra:""},{models:[9761,9770],name:"Standing Hip",line:"A250",extra:""},{models:[9777,9786],name:"Standing Hip",line:"A300",extra:""},{models:[10017,10026],name:"Abdominal",line:"A250",extra:""},{models:[10033,10042],name:"Abdominal",line:"A300",extra:""},{models:[10273,10282],name:"Lower Back",line:"A250",extra:""},{models:[10274,10283],name:"Lower Back",line:"A250",extra:"Range Limiter"},{models:[10289,10294,10298,10299],name:"Lower Back",line:"A300",extra:""},{models:[10550,10554],name:"Seated Calf",line:"A300",extra:""},{models:[12288,12298],name:"Performance Zone",line:"Infinity",extra:""},{models:[12304,12314],name:"Performance Trainer",line:"Infinity",extra:""},{models:[12320,12330],name:"Functional Trainer",line:"Infinity",extra:""},{models:[12336,12346],name:"Triple Trainer",line:"Infinity",extra:""},{models:[12352,12362],name:"Functional Wall Trainer",line:"Infinity",extra:""},{models:[12544],name:"Rack",line:"Power Rack",extra:"Seat Settings"},{models:[12547,12548,12549,12550,12560,12561,12576],name:"Rack",line:"Power Rack",extra:"Iron Weight"},{models:[12849],name:"Single Runner",line:"A300",extra:""},{models:[12850,12858],name:"Dual Runner",line:"A300",extra:""}];return e.getMachineDetails=function(e){for(var n=0;n<i.length;n++)for(var t=0;t<i[n].models.length;t++)if(i[n].models[t]==e)return i[n]},e}()},{}],4:[function(e,i,n){i.exports=function(){"use strict";var i={};return i.machine=e("./machine"),i.messenger=e("./messenger"),i}()},{"./machine":3,"./messenger":5}],5:[function(e,i,n){i.exports=function(){"use strict";var e={};const i={TYPE:{RESPONSE:"response",REQUEST:"request"},ACTION:{CONNECT:"connect",ECHIP_SET:"echip-set",ECHIP_GET:"echip-get"}};var n,t,r,s,o,a={initialized:!1,connected:!1,enabled:!1,actions:{eChipSet:!1,eChipGet:!1}},l=function(e){a.initialized?p(e.data):u(e)},m=function(e){n&&t&&n.postMessage(JSON.stringify(e),t)},c=function(e,i,n,t){var r={id:e,type:i,action:n,data:t};m(r)},u=function(e){var s=JSON.parse(e.data);(s||{}).action&&s.action===i.ACTION.CONNECT&&(n=e.source,t=e.origin,r=s.id,a.initialized=!0,a.enabled&&d())},p=function(e){if(a.enabled){var n=JSON.parse(e);if((n||{}).id)switch(n.action){case i.ACTION.ECHIP_SET:o(n.data,function(){A(n.id)});break;case i.ACTION.ECHIP_GET:s(n.data,function(e){f(n.id,e)})}}},d=function(){if(r){var e={actions:[]};a.actions.eChipSet&&e.actions.push(i.ACTION.ECHIP_SET),a.actions.eChipGet&&e.actions.push(i.ACTION.ECHIP_GET),c(r,i.TYPE.RESPONSE,i.ACTION.CONNECT,e)}},f=function(e,n){c(e,i.TYPE.RESPONSE,i.ACTION.ECHIP_GET,n)},A=function(e){var n={success:!0};c(e,i.TYPE.RESPONSE,i.ACTION.ECHIP_SET,n)};return e.enable=function(e,i){"function"==typeof e&&(a.actions.eChipGet=!0,s=e),"function"==typeof i&&(a.actions.eChipSet=!0,o=i),a.enabled=!0,a.initialized&&d()},e.disable=function(){a.enabled=!1,a.actions.eChipGet=!1,a.actions.eChipSet=!1,s=null,o=null,a.initialized&&d()},window.addEventListener("message",l),e}()},{}]},{},[1]);