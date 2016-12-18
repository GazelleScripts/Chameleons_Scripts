// ==UserScript==
// @name         PTH search link on discogs
// @version      0.1
// @description  Link to a search from discogs pages to PTH
// @author       Chameleon
// @include      http*://*discogs.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var pTitle=document.getElementById('profile_title');
  if(pTitle)
  {
    var span=pTitle.getElementsByTagName('a')[0].parentNode;
    var artist=span.getAttribute('title');
    
    var a=document.createElement('a');
    a.href="https://passtheheadphones.me/artist.php?artistname="+artist;
    a.innerHTML = "pth";
    span.appendChild(document.createTextNode(' ('));
    span.appendChild(a);
    span.appendChild(document.createTextNode(')'));
  }
})();