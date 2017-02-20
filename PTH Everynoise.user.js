// ==UserScript==
// @name         PTH Everynoise
// @version      0.3
// @description  Add everynoise.com overload (ctrl+click) to every tag link
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var as=document.getElementsByTagName('a');
  for(var i=0; i<as.length; i++)
  {
    var a=as[i];
    if(a.href.indexOf('torrents.php?taglist=') == -1)
      continue;
    a.addEventListener('click', everynoise.bind(undefined, a), false);
  }
})();

function everynoise(a, event)
{
  if(event.ctrlKey || event.cmdKey)
  {
    event.preventDefault();
    var href="http://everynoise.com/engenremap-"+(a.innerHTML.replace(/\./g, ''))+'.html';
    window.open(href, '_blank');
  }
}
