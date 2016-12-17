// ==UserScript==
// @name         PTH Upload Save Defaults
// @version      0.7
// @description  Save the dropdown menu selections on the upload form and automatically set them on page load
// @author       Chameleon
// @include      http*://passtheheadphones.me/upload.php*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';
  
  var before=document.getElementById('upload_table');

  var a=document.createElement('a');
  a.setAttribute('style', 'display: block; text-align: center;');
  a.innerHTML = 'Save dropdown menu options';
  a.href = 'javascript:void(0);';
  before.parentNode.insertBefore(a, before);
  a.addEventListener('click', saveOptions.bind(undefined, a), false);

  var options=window.localStorage.uploadOptions;
  if(!options)
    options = {selects:[], multiformat:false};
  else
    options = JSON.parse(options);

  if(options.multiformat)
  {
    for(var i=1; i<options.multiformat; i++)
    {
      createRow();
    }
  }
  var selects=document.getElementsByTagName('select');
  for(var i=0; i<options.selects.length; i++)
  {
    var s=options.selects[i];
    var dropdown=document.getElementById(s.id);
    if(!dropdown)
      continue;
    dropdown.selectedIndex = s.index;
    if(dropdown.id != "genre_tags" && dropdown.id != "categories")
    {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      selects[i].dispatchEvent(evt);
      if(dropdown.id == "format" && s.index == 2)
        document.getElementById('upload_logs').setAttribute('class', '');
    }
  }
}());

function saveOptions(a)
{
  var selects=document.getElementsByTagName('select');
  var options={selects:[], multiformat:false};
  for(var i=0; i<selects.length; i++)
  {
    var s=selects[i];
    options.selects.push({id:s.id, index:s.selectedIndex});
  }
  if(document.getElementById('extra_format_row_1'))
  {
    var rowNum=1;
    var node=document.getElementById('extra_format_row_'+rowNum);
    while(node)
    {
      rowNum++;
      node=document.getElementById('extra_format_row_'+rowNum);
    }
    options.multiformat=rowNum;
  }
  window.localStorage.uploadOptions = JSON.stringify(options);
  a.innerHTML = 'Dropdown menu options saved';
  window.setTimeout(reset.bind(undefined, a, 'Save dropdown menu options'), 5000);
}

function reset(a, message)
{
  a.innerHTML = message;
}