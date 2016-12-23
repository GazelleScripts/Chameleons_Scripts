// ==UserScript==
// @name         PTH Remove required ratio if it's 0.00
// @version      0.2
// @description  Remove required ratio either when it's 0.00 or always
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

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
  var div=document.getElementById('chameleonSettings');
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

function getSettings()
{
  var settings = window.localStorage.removeRequiredRatioSettings;
  if(!settings)
  {
    settings = {hideAlways:false};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}