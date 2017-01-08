// ==UserScript==
// @name         PTH Hide quote trains
// @version      0.1
// @description  Hide nested quotes with a link to show them
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var quotes=document.getElementsByTagName('blockquote');
  for(var i=0; i<quotes.length; i++)
  {
    var q=quotes[i];
    var e=q.firstElementChild;
    while(e)
    {
      if(e.tagName=="BLOCKQUOTE")
      {
        var a=document.createElement('a');
        a.href='javascript:void(0);';
        a.setAttribute('style', 'margin-right: 5px;');
        a.innerHTML='Show Quote';
        a.addEventListener('click', toggleQuote.bind(undefined, a, e), false);
        e.parentNode.insertBefore(a, e);
        e.parentNode.insertBefore(document.createElement('br'), e);
        e.style.display='none';
      }
      
      e=e.nextElementSibling;
    }
  }
})();

function toggleQuote(a, q)
{
  if(q.style.display=='none')
  {
    a.innerHTML='Hide Quote';
    q.style.display='';
  }
  else
  {
    a.innerHTML = 'Show Quote';
    q.style.display='none';
  }
}