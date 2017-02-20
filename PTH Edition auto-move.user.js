// ==UserScript==
// @name         PTH Edition auto-move
// @version      0.2
// @description  Move the year, label, and catalogue number to the edition fields
// @author       Chameleon
// @include      http*://redacted.ch/upload.php*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  var remaster=document.getElementById('remaster');
  remaster.addEventListener('click', moveEdition, false);
})();

function moveEdition(event)
{
  if(event.shiftKey)
  {
    var year=document.getElementById('year');
    document.getElementById('remaster_year').value = year.value;
    year.value='';
    var rLabel=document.getElementById('record_label');
    document.getElementById('remaster_record_label').value = rLabel.value;
    rLabel.value='';
    var cNumber=document.getElementById('catalogue_number');
    document.getElementById('remaster_catalogue_number').value = cNumber.value;
    cNumber.value='';
    
    document.getElementById('remaster_title').focus();
  }
}
