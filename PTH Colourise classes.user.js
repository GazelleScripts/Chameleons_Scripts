// ==UserScript==
// @name         PTH Colourise classes
// @version      0.1
// @description  Set the class titles unique colours
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  
  var classes=[['(User)', '#FFFFFF'],
               ['(Member)', '#AAFFFF'],
               ['(Power User)', '#AAAAFF'],
               ['(Elite)', '#FFAAFF'],
               ['(Torrent Master)', '#FFFFAA'],
               ['(Power TM)', '#FFFF66'],
               ['(Elite TM)', '#FFFF00'],
    ];

  var strongs=document.getElementsByTagName('strong');
  for(var i=0; i<strongs.length; i++)
  {
    var s=strongs[i];
    for(var j=0; j<classes.length; j++)
    {
      if(s.innerHTML == classes[j][0])
        s.style.color=classes[j][1];
    }
  }
})();