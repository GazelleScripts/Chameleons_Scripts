// ==UserScript==
// @name         PTH Copy last read link to icon
// @version      0.2
// @description  Copy the last read link to the read/unread/pinned/locked icon
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var lastreads=document.getElementsByClassName('last_read');
  for(var i=0; i<lastreads.length; i++)
  {
    var l=lastreads[i];
    
    var a=document.createElement('a');
    a.href=l.getElementsByTagName('a')[0].href;
    a.setAttribute('style', 'display: block; width: 10px; height: 15px;');
    l.parentNode.previousElementSibling.appendChild(a);
  }

})();
