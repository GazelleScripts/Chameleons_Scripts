// ==UserScript==
// @name         PTH embed youtube
// @version      0.1
// @description  Embed youtube videos on PTH forums
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
    if(a.href.indexOf("youtube.com") != -1 || a.href.indexOf("youtu.be") != -1)
    {
      var id='';
      if(a.href.indexOf('youtu.be') != -1)
      {
        id=a.href.split('/')[1];
      }
      else
      {
        id=a.href.split('v=')[1].substr(0, 11);
      }
      if(id.length != 11)
        return;
      var parent=a.parentNode;
      var iframe = document.createElement('iframe');
      //parent.appendChild(iframe);
      a.parentNode.insertBefore(iframe, a);
      a.innerHTML = '';
      iframe.width = parent.clientWidth-20;
      iframe.height = iframe.width/(16/9);
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.frameBorder='0';
      iframe.src='https://www.youtube.com/embed/'+id;
    }
  }

})();