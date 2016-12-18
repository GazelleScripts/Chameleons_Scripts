// ==UserScript==
// @name         PTH search link on discogs
// @version      0.3
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
    var album = pTitle.getElementsByTagName('span');
    album=album[album.length-1].textContent.trim();
    
    var span=pTitle.getElementsByTagName('a')[0].parentNode;
    var artist=span.getAttribute('title').replace(/\(.*\)/g, '');
    
    var a=document.createElement('a');
    a.href="https://passtheheadphones.me/artist.php?artistname="+artist;
    a.innerHTML = "pth";
    span.appendChild(document.createTextNode(' ('));
    span.appendChild(a);
    span.appendChild(document.createTextNode(')'));
        
    var a=document.createElement('a');
    a.href="https://passtheheadphones.me/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    a.innerHTML = "pth";
    pTitle.appendChild(document.createTextNode(' ('));
    pTitle.appendChild(a);
    pTitle.appendChild(document.createTextNode(')'));
  }
})();