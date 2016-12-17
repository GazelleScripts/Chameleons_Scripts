// ==UserScript==
// @name         PTH Freeze Avatars
// @version      0.1
// @description  Freeze the animated avatars on PTH
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var avatars=document.getElementsByClassName('avatar');
  for(var i=0; i<avatars.length; i++)
  {
    var av=avatars[i];
    var avatar=av.getElementsByTagName('img')[0];
    if(avatar.src.match(/.gif$/))
    {
      var c = document.createElement('canvas');
      var w = c.width = 150;
      var h = c.height = 150;
      avatar.parentNode.replaceChild(c, avatar);
      var img=document.createElement('img');
      img.src=avatar.src;
      img.setAttribute('style', 'max-height: 400px;');
      img.onload=draw.bind(undefined, c, img, w, h);
    }
  }
})();

function draw(canvas, img, w, h)
{
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
}