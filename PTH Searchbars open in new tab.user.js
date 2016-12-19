// ==UserScript==
// @name         PTH Searchbars open in new tab
// @version      0.1
// @description  Open the searches from the search bar on a new tab
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var forms=document.getElementById('searchbars').getElementsByTagName('form');
  for(var i=0; i<forms.length; i++)
  {
    forms[i].setAttribute('target', '_blank');
  }
})();