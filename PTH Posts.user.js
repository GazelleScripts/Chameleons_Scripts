// ==UserScript==
// @name         PTH Posts
// @version      0.2
// @description  Show a Posts link that takes you to your grouped post history
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==
var userid=document.getElementById('nav_userinfo').getElementsByTagName('a')[0].href.split('?id=')[1];

var links = 
    [['Posts', '/userhistory.php?action=posts&userid='+userid],
     //['Comments-II', '/comments.php?action=torrents&type=uploaded'],
      ];     

(function() {
  'use strict';
  for(var i=0; i<links.length; i++)
  {
    var l=links[i];
    addHeaderLink(l[0], l[1]);
  }
})();

function addHeaderLink(text, link)
{
  var a=document.createElement('a');
  a.href=link;
  a.innerHTML = text;
  var li=document.createElement('li');
  li.appendChild(a);
  li.setAttribute('id', 'nav_posts');
  var before=document.getElementById('nav_comments');
  before.parentNode.insertBefore(li, before);
}