// ==UserScript==
// @name         PTH Autofill from torrent
// @version      1.1
// @description  Attempt to read the .torrent file and fill in the artist and album
// @author       Chameleon
// @include      http*://passtheheadphones.me/upload.php*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  var a=document.createElement('a');
  a.innerHTML = 'Auto-fill from torrent: On';
  if(window.location.href.indexOf('groupid=') != -1)
    a.innerHTML = 'Auto-fill from torrent: Off';
  a.href='javascript:void(0);';
  a.addEventListener('click', toggle.bind(undefined, a), false);
  a.setAttribute('style', 'display: block; text-align: center;');
  var before=document.getElementById('upload_table');
  before.parentNode.insertBefore(a, before);

  var format=document.getElementById('format');
  var bitrate=document.getElementById('bitrate');

  document.getElementById('file').addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, true), false);

  addToExisting(a);

  // select the target node
  var target = document.getElementById('upload_table');

  // create an observer instance
  var observer = new MutationObserver(addedToTable.bind(undefined, a));

  // configuration of the observer:
  var config = { childList: true, subtree: true };

  // pass in the target node, as well as the observer options
  observer.observe(target, config);

})();

function addToExisting(a)
{
  var tr=document.getElementById('extra_format_row_1');
  var index=1;
  while(tr)
  {
    var input=tr.getElementsByTagName('input')[0];
    var format=tr.getElementsByTagName('select');
    var bitrate=format[1];
    format=format[0];

    input.addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, false), false);
    
    index++;
    tr=document.getElementById('extra_format_row_'+index);
  }
}

function addedToTable(a, mutations)
{
  for(var i=0; i<mutations.length; i++)
  {
    var m=mutations[i];
    if(m.addedNodes.length == 1)
    {
      var id=m.addedNodes[0].getAttribute('id');
      if(id && id.indexOf('extra_format_row') != -1)
      {
        var tr=m.addedNodes[0];
        var input=tr.getElementsByTagName('input')[0];
        var format=tr.getElementsByTagName('select');
        var bitrate=format[1];
        format=format[0];

        input.addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, false), false);
      }
    }
  }
}

function toggle(a)
{
  if(a.innerHTML.indexOf('On') != -1)
  {
    a.innerHTML=a.innerHTML.replace('On', 'Off');
  }
  else
  {
    a.innerHTML=a.innerHTML.replace('Off', 'On');
  }
}

function fileAdded(a, format, bitrate, full, event)
{
  if(a.innerHTML.indexOf('Off') != -1)
    return;
  var file=event.target.files[0];
  if(!file)
    return;

  if(full)
  {
    var spl=file.name.replace(/ - [0-9][0-9][0-9][0-9]/, '').split(' - ');
    if(spl.length == 1)
    {
      var fn=file.name;
      var length=4;
      var search=fn.search(/[0-9][0-9][0-9][0-9]/);
      if(search != -1)
      {
        if(fn[search-1] == '(')
        {
          search--;
          length=6;
        }
        spl=[];
        spl.push(fn.substring(0, search).trim());
        spl.push(fn.substring(search+length).trim());
      }
    }
    var artist=spl[0].split('] ');
    if(artist.length > 1)
      artist=artist[1];
    else
      artist=artist[0];
    document.getElementById('artist').value=artist;
    var album=spl[1].split(' (')[0].split(' [')[0].split(' {')[0].replace(/.torrent$/, '');
    document.getElementById('title').value=album;

    var yadg=document.getElementById('yadg_input');
    if(yadg)
    {
      yadg.value=artist+' '+album;
      document.getElementById('yadg_submit').click();
    }
  }

  var f=file.name.toLowerCase();

  if(f.indexOf('mp3') != -1)
  {
    format.selectedIndex=1;
  }
  else if(f.indexOf('flac') != -1)
  {
    format.selectedIndex=2;
    bitrate.selectedIndex=9;
  }
  else if(f.indexOf('aac') != -1)
  {
    format.selectedIndex=3;
  }
  else if(f.indexOf('ac3') != -1)
  {
    format.selectedIndex=4;
  }
  else if(f.indexOf('dts') != -1)
  {
    format.selectedIndex=5;
  }

  if(f.indexOf('v0') != -1)
  {
    bitrate.selectedIndex=7;
    format.selectedIndex=1;
  }
  else if(f.indexOf('v1') != -1)
  {
    bitrate.selectedIndex=4;
    format.selectedIndex=1;
  }
  else if(f.indexOf('v2') != -1)
  {
    bitrate.selectedIndex=3;
    format.selectedIndex=1;
  }
  else if(f.indexOf('192') != -1)
  {
    bitrate.selectedIndex=1;
    format.selectedIndex=1;
  }
  else if(f.indexOf('256') != -1)
  {
    bitrate.selectedIndex=5;
    format.selectedIndex=1;
  }
  else if(f.indexOf('320') != -1)
  {
    bitrate.selectedIndex=8;
    format.selectedIndex=1;
  }

  var media=document.getElementById('media');
  if(f.indexOf('dvd') != -1)
  {
    media.selectedIndex=2;
  }
  else if(f.indexOf('vinyl') != -1)
  {
    media.selectedIndex=3;
  }
  else if(f.indexOf('soundboard') != -1)
  {
    media.selectedIndex=4;
  }
  else if(f.indexOf('sacd') != -1)
  {
    media.selectedIndex=5;
  }
  else if(f.indexOf('dat') != -1)
  {
    media.selectedIndex=6;
  }
  else if(f.indexOf('cassette') != -1)
  {
    media.selectedIndex=7;
  }
  else if(f.indexOf('web') != -1)
  {
    media.selectedIndex=8;
  }
  else if(f.indexOf('blu-ray') != -1 || f.indexOf('bluray') != -1)
  {
    media.selectedIndex=9;
  }
  else
    media.selectedIndex=1;

  triggerChange(format);
  triggerChange(bitrate);
  triggerChange(media);

  var r=new FileReader();
  r.onload=readFile;
  r.readAsText(file);
}

function readFile(event)
{
  var contents=event.target.result;
  //console.log(contents);
  var paths=contents.split('piece length')[0].split('filesld')[1].split(':path');
  var desc=document.getElementById('album_desc');
  if(desc.value.length !== 0)
    return;
  var extensions=[];
  var tracks=[];
  for(var i=1; i<paths.length-1; i++)
  {
    var p=paths[i];
    p=p.substring(p.indexOf(':')+1).split('eed6:length')[0];
    var extension=p.substring(p.lastIndexOf('.'));
    var hasE=false;
    for(var j=0; j<extensions.length; j++)
    {
      if(extension == extensions[j].extension)
      {
        hasE=true;
        extensions[j].count++;
      }
    }
    if(!hasE)
    {
      extensions.push({extension:extension, count:1});
    }
    tracks.push({track:p, extension:extension});
    //p=p.substring(0, p.lastIndexOf('.'));
    //console.log(p);
    //desc.value+='\r'+p;
  }
  var highCount=0;
  var index=-1;
  for(var i=0; i<extensions.length; i++)
  {
    if(extensions[i].count > highCount)
    {
      highCount=extensions[i].count;
      index=i;
    }
  }
  var finalTracks=[];
  for(var i=0; i<tracks.length; i++)
  {
    var t=tracks[i];
    if(t.extension != extensions[index].extension)
      continue;
    finalTracks.push(t.track);
  }
  finalTracks.sort();

  desc.value='Track list:';
  for(var i=0; i<finalTracks.length; i++)
  {
    var f=finalTracks[i];
    f=f.replace(/^[0-9][0-9]?[0-9]?\.?[ -_]?[ -_]?[ -_]/, '');
    f=f.substring(0, f.lastIndexOf('.'));
    desc.value+='\r[#]'+f;
  }
}

function triggerChange(input)
{
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("change", false, true);
  input.dispatchEvent(evt);
}