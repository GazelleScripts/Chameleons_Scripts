// ==UserScript==
// @name         PTH Remove required ratio if it's 0.00
// @version      0.1
// @description  Remove required ratio if it's 0.00
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var headerRatio = document.getElementById('stats_required');
  if(headerRatio.textContent.replace(/[\t,\n]/g, "") == "Required:0.00")
    headerRatio.style.display = 'none';
  if(window.location.href.indexOf("user.php?id=") != -1)
  {
    var stats=document.getElementsByClassName('stats')[0].getElementsByTagName('li')[5];
    if(stats.textContent == "Required Ratio: 0.00")
      stats.style.display = 'none';
  }
})();