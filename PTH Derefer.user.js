// ==UserScript==
// @name         PTH Derefer
// @version      0.1
// @description  Derefer external links on PTH
// @author       Chameleon
// @include      http*://*passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var as=document.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.href.indexOf(window.location.host) == -1 && a.href.indexOf('javascript') !== 0)
    {
      a.href = "https://anonym.to/?"+encodeURIComponent(a.href);
    }
  }
})();