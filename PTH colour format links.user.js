// ==UserScript==
// @name         PTH colour format links
// @version      0.1
// @description  Colour the links for torrents by format so they stand out
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var colours = [{format:'FLAC', colour:'#1AC8D8'},
                 {format:'FLAC / 24bit', colour:'#196FD8', source:'Web'},
                 {format:'FLAC / 24bit', colour:'#930DCC', source:'Vinyl'},
                 {format:'FLAC', colour:'#A9CC0E', source:'SACD'},
                 {format:'Surround', colour:'#D88B19'},
                 //{format:'<format here>', colour:'<colour here>'},
                 ];
  
  var torrents = document.getElementsByClassName('group_torrent');
  var edition;
  for(var k=0; k<torrents.length; k++)
  {
    var t=torrents[k];
    if(t.getAttribute('class').indexOf(' edition ') !== -1)
    {
      edition=t;
      continue;
    }
    else if(t.getAttribute('class').indexOf(' edition_') === -1)
      continue;
    
    var a=t.getElementsByTagName('a')[0].parentNode.parentNode.lastChild.previousElementSibling;
    for(var i=0; i<colours.length; i++)
    {
      var c=colours[i];
      if(a.textContent.indexOf(c.format) !== -1)
      {
        if(c.source)
        {
          if(edition.textContent.toLowerCase().indexOf(c.source.toLowerCase()) === -1)
            continue;
        }
        
        a.setAttribute('style', 'color: '+c.colour+'; text-shadow: 0px 0px 10px;');
      }
    }
  }
})();