// ==UserScript==
// @name         PTH Skip upload warning
// @version      0.6
// @description  Skip the warning page generated when uploading a torrent without the 'source' option set
// @author       Chameleon
// @include      http*://passtheheadphones.me/upload.php*
// @include      http*://passtheheadphones.me/torrents.php?id=*
// @include      http*://passtheheadphones.me/forums.php?*threadid=3743*
// @grant        none
// ==/UserScript==

var debugOn=false;

(function() {
  'use strict';

  debug("Start debug");
  var settings=getSettings();

  var wH=window.location.href;
  if(wH.indexOf('upload.php') != -1)
  {
    var h1s=document.getElementsByTagName('h1');
    debug("h1 count: "+h1s.length);
    debug("h1[1] text: "+h1s[1].innerHTML);
    debug("h1[1] == 'Warning': "+(h1s[1].innerHTML=='Warning'));
    if(h1s.length > 1 && h1s[1].innerHTML == 'Warning')
    {
      var link=document.getElementById('content').getElementsByTagName('a')[0].href;
      debug("link: "+link);
      if(settings.downloadTorrents)
      {
        var id=link.split('?id=')[1];
        window.localStorage.bypassWarning=JSON.stringify({id:id, downloaded:false});
      }
      window.location = link;
    }
  }
  else if(wH.indexOf('torrents.php') != -1)
  {
    var bypass=window.localStorage.bypassWarning;
    if(!bypass)
      return;
    bypass=JSON.parse(bypass);
    if(bypass.downloaded)
      return;
    if(window.location.href.indexOf(bypass.id) == -1)
      return;

    var username=document.getElementById('nav_userinfo').textContent.trim();

    var download=[];
    var torrentDetails=document.getElementsByClassName('torrentdetails');
    for(var i=0; i<torrentDetails.length; i++)
    {
      var t=torrentDetails[i];
      var user=t.getElementsByTagName('a')[0].innerHTML.trim();
      if(user != username)
        continue;
      var time=t.getElementsByTagName('span')[0].innerHTML;
      if(time.indexOf('Just now') == -1)
        continue;
      var id=parseInt(t.getAttribute('id').split('_')[1]);
      download.push(id);
    }
    /*var largestId=0;
    for(var i=0; i<torrentDetails.length; i++)
    {
      var t=torrentDetails[i];
      var id=parseInt(t.getAttribute('id').split('_')[1]);
      if(id > largestId)
        largestId=id;
    }
    document.getElementById('torrent'+largestId).getElementsByTagName('a')[0].click();*/
    
    for(var i=0; i<download.length; i++)
    {
      document.getElementById('torrent'+download[i]).getElementsByTagName('a')[0].click();
    }

    bypass.downloaded=true;
    window.localStorage.bypassWarning=JSON.stringify(bypass);
  }
  else if(wH.indexOf('threadid=3743') != -1)
    showSettings();
})();

function showSettings()
{
  var div=document.getElementById('skipUploadWarningSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'skipUploadWarningSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Skip upload warning Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Download torrents: '+(settings.downloadTorrents ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function debug(text)
{
  if(!debugOn)
    return;
  
  var debugDiv=document.getElementById('ChameleonDebug');
  if(!debugDiv)
  {
    debugDiv=document.createElement('div');
    document.body.appendChild(debugDiv);
    debugDiv.setAttribute('id', 'ChameleonDebug');
    debugDiv.setAttribute('style', 'position: absolute; top: 50px; left: 50px; width: '+(document.body.clientWidth-100)+'px; background: rgba(0,0,0,0.7); text-align: center; font-size: 2em;');
  }
  var d=document.createElement('div');
  d.innerHTML=text;
  debugDiv.appendChild(d);
}

function changeSettings(a, div)
{
  var settings=getSettings();
  var as=div.getElementsByTagName('a');
  if(as[0].innerHTML.indexOf('Off') != -1) 
  {
    settings.downloadTorrents = true;
  }
  else
    settings.downloadTorrents = false;
  
  window.localStorage.skipUploadWarningSettings = JSON.stringify(settings);
}

function getSettings()
{
  var settings = window.localStorage.skipUploadWarningSettings;
  if(!settings)
  {
    settings = {downloadTorrents:true};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}