// ==UserScript==
// @name         Similar Artists from WCD missing on RED
// @version      0.2
// @description  Add a box to the sidebar with the missing Similar Artists from the WCD metadata
// @author       Chameleon
// @include      http*://*redacted.ch/artist.php?id=*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  'use strict';

  var artist=document.title.split(' :: Redacted')[0];
  var similar_artists=document.getElementsByClassName('box_artists')[0];

  var box=document.createElement('div');
  box.innerHTML='<div class="head"><strong>WCD Similar Artists</strong></div>';
  box.setAttribute('class', 'box');
  var ul=document.createElement('ul');
  box.appendChild(ul);
  ul.setAttribute('class', 'stats nobullet');
  similar_artists.parentNode.insertBefore(box, similar_artists.nextElementSibling);
  //box.innerHTML='Searching for artist "'+artist+'" in the WCD metadata';
  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/artist.php?action=autocomplete&query="+encodeURIComponent(artist),
                     onload: gotArtists.bind(undefined, ul, similar_artists)
                    });
})();

function gotArtists(box, similar_artists, response)
{
  var r=JSON.parse(response.responseText);
  if(r.suggestions.length === 0)
  {
    box.innerHTML='Artist not found';
    return;
  }
  var artistID=r.suggestions[0].data;
  GM_xmlhttpRequest({method: "GET",
                     url: "http://159.89.252.33/ajax.php?action=similar_artists&id="+artistID+"&limit=1000",
                     onload: gotSimilar.bind(undefined, box, similar_artists)
                    });
}

function gotSimilar(box, similar_artists, response)
{
  var r=JSON.parse(response.responseText);
  if(r===null)
  {
    box.innerHTML='None found';
    return;
  }
  box.innerHTML='';

  var s=similar_artists.getElementsByTagName('li');
  var names=[];
  for(var i=0; i<s.length; i++)
  {
    names.push(s[i].getElementsByTagName('a')[0].textContent);
  }

  var final_artists=[];
  for(var i=0; i<r.length; i++)
  {
    var a=r[i];
    var found=false;
    for(var j=0; j<names.length; j++)
    {
      if(names[j].toLowerCase() === a.name.toLowerCase())
      {
        found=true;
        break;
      }
    }
    if(!found)
      final_artists.push(a.name);
  }

  if(final_artists.length > 20)
  {
    var p=box.previousElementSibling;
    var a=document.createElement('a');
    p.appendChild(a);
    a.setAttribute('style', 'float: right;');
    a.innerHTML='(Show more)';
    a.href='javascript:void(0);';
    a.addEventListener('click', showMore.bind(undefined, box, final_artists, a));
  }
  showSimilar(box, final_artists, false);
}

function showMore(box, final_artists, a)
{
  if(a.textContent==='(Show more)')
  {
    a.innerHTML='(Show less)';
    showSimilar(box, final_artists, true);
  }
  else
  {
    a.innerHTML='(Show more)';
    showSimilar(box, final_artists, false);
  }
}

function showSimilar(box, final_artists, all)
{
  box.innerHTML='';
  var links=[];
  for(var i=0; i<final_artists.length; i++)
  {
    var f=final_artists[i];
    var li=document.createElement('li');
    li.innerHTML='<a href="/artist.php?artistname='+encodeURIComponent(f)+'">'+f+'</a>';
    var a=document.createElement('a');
    li.appendChild(a);
    a.setAttribute('style', 'float: right;');
    a.innerHTML='(Add)';
    a.href='javascript:void(0);';
    a.addEventListener('click', addArtist.bind(undefined, a, f, false, [], 0));
    links.push({a:a, f:f});
    box.appendChild(li);
    if(i >= 19 && !all)
      break;
  }
  var li=document.createElement('li');
  box.appendChild(li);
  li.setAttribute('style', 'text-align: center;');
  var a=document.createElement('a');
  li.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML='(Add all to similar artists)';
  a.addEventListener('click', addAll.bind(undefined, links));
}

function addAll(links)
{
  addArtist(links[0].a, links[0].f, true, links, 0);
}

function addArtist(a, f, addAll, links, index)
{
  if(a.innerHTML==='(Added)')
  {
    if(addAll)
    {
      index++;
      if(index >= links.length)
        return;
      addArtist(links[index].a, links[index].f, addAll, links, index);
    }
    return;
  }
  a.innerHTML='(Adding)';

  var inputs=document.getElementsByClassName('add_form')[0].getElementsByTagName('input');

  GM_xmlhttpRequest({method: "POST",
                     url: "/artist.php",
                     headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                     },
                     data: "action=add_similar&auth="+inputs[1].value+"&artistid="+inputs[2].value+"&artistname="+encodeURIComponent(f),
                     onload: addedArtist.bind(undefined, a, addAll, links, index)
                    });
}

function addedArtist(a, addAll, links, index, response)
{
  a.innerHTML='(Added)';
  if(!addAll)
    return;

  index++;
  if(index >= links.length)
    return;

  window.setTimeout(addArtist.bind(undefined, links[index].a, links[index].f, addAll, links, index), 1000);
}