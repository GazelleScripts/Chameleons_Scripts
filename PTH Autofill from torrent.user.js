// ==UserScript==
// @name         PTH Autofill from torrent
// @version      0.3
// @description  Attempt to read the .torrent file and fill in the artist and album
// @author       Chameleon
// @include      http*://passtheheadphones.me/upload.php*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  document.getElementById('file').addEventListener('change', fileAdded, false);
})();

function fileAdded(event)
{
  var file=event.target.files[0];
  if(!file)
    return;
  
  var spl=file.name.split(' - ');
  var artist=spl[0];
  document.getElementById('artist').value=artist;
  var album=spl[1].split(' (')[0].split(' [')[0];
  document.getElementById('title').value=album;
  
  var yadg=document.getElementById('yadg_input');
  if(yadg)
  {
    yadg.value=artist+' '+album;
    document.getElementById('yadg_submit').click();
  }
  
  return;
  
  var r=new FileReader();
  r.onload=readFile;
  r.readAsText(file);
}

function readFile(event)
{
  var contents=event.target.result;
  console.log(contents);
}