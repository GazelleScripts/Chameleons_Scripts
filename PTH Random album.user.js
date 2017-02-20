// ==UserScript==
// @name         PTH Random album
// @version      0.2
// @description  Load a random album
// @author       Chameleon
// @include      http*://redacted.ch/torrents.php?id=*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var linkbox=document.getElementsByClassName('linkbox')[0];
  var a=document.createElement('a');
  linkbox.appendChild(a);
  a.innerHTML = 'Random album';
  a.setAttribute('class', 'brackets');
  a.href='/torrents.php?id='+Math.round(Math.random()*265246);
})();
