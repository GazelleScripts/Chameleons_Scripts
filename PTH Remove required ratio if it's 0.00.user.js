// ==UserScript==
// @name         PTH Remove required ratio if it's 0.00
// @version      0.3
// @description  Remove required ratio either when it's 0.00 or always
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  debug('start debug');
  debug('threadid: '+window.location.href.indexOf('threadid=2646'));
  var headerRatio = document.getElementById('stats_required');
  if(headerRatio.textContent.replace(/[\t,\n]/g, "") == "Required:0.00" || settings.hideAlways)
    headerRatio.style.display = 'none';
  if(window.location.href.indexOf("user.php?id=") != -1)
  {
    var stats=document.getElementsByClassName('stats')[0].getElementsByTagName('li')[5];
    if(stats.textContent == "Required Ratio: 0.00" || settings.hideAlways)
      stats.style.display = 'none';
  }
  else if(window.location.href.indexOf('threadid=2646') != -1)
    showSettings();
})();

function showSettings()
{
  debug('in settings');
  var div=document.getElementById('chameleonSettings');
  debug('div exists: '+(!(!div)));
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'chameleonSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Remove Required Ratio Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Always hide: '+(settings.hideAlways ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function changeSettings(a, div)
{
  var settings=getSettings();
  var as=div.getElementsByTagName('a');
  if(a == as[0])
  {
    if(as[0].innerHTML.indexOf('Off') != -1) 
    {
      settings.hideAlways = true;
    }
    else
      settings.hideAlways = false;
  }

  window.localStorage.removeRequiredRatioSettings = JSON.stringify(settings);
  showSettings();
}

function debug(text)
{
  var settings=getSettings();
  if(!settings.debug)
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

function getSettings()
{
  var settings = window.localStorage.removeRequiredRatioSettings;
  if(!settings)
  {
    settings = {hideAlways:false, debug:false};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}