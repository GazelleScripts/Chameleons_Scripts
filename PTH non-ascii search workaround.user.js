// ==UserScript==
// @name         PTH non-ascii search workaround
// @version      0.1
// @description  Redirect on searches that fail due to 16-bit non-ascii characters
// @author       Chameleon
// @include      http*://passtheheadphones.me/torrents.php?searchstr=*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  if(document.body.innerHTML.indexOf('Your search did not match anything.') != -1)
  {
    var match=window.location.search.match(/%..%../g);
    if(match)
    {
      var newSearch=window.location.search;
      for(var i=0; i<match.length; i++)
      {
        var m=match[i];
        newSearch=newSearch.replace(m, "%"+m.split('%')[1]);
      }
      window.location = '/torrents.php'+newSearch;
    }
  }
})();