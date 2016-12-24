// ==UserScript==
// @name         PTH User tagging
// @version      0.2
// @description  Tag, ignore, highlight, and change avatars for users on PTH
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  window.setTimeout(checkHeight.bind(undefined, document.body.clientHeight), 800);

  if(window.location.href.indexOf('user.php?id=') != -1)
  {
    var username=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].textContent;
    var a=document.createElement('a');
    a.innerHTML = '[User tags]';
    a.href='javascript:void(0);';
    a.addEventListener('click', openTags.bind(undefined, username, undefined), false);
    document.getElementsByClassName('linkbox')[0].appendChild(a);
  }

  var posts=document.getElementsByClassName('forum_post');
  for(var i=0; i<posts.length-1; i++)
  {
    var p=posts[i];
    var links=p.getElementsByTagName('td')[0];
    var username=p.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].textContent;

    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.innerHTML='Tag';
    a.setAttribute('class', 'brackets');
    a.addEventListener('click', openTags.bind(undefined, username, p), false);
    links.appendChild(document.createTextNode(' - '));
    links.appendChild(a);

    var img=p.getElementsByTagName('img')[0];
    if(img)
    {
      img.setAttribute('originalAvatar', img.src);
    }
  }
  /*
  var avatars=document.getElementsByClassName('avatar');
  for(var i=0; i<avatars.length; i++)
  {
    var avatar=avatars[i];
    addTagLinks(avatar);
    var img=avatar.getElementsByTagName('img')[0];
    if(img)
    {
      img.setAttribute('originalAvatar', img.src);
    }
  }*/

  addTags();
})();


function checkHeight(height)
{
  if(height != document.body.clientHeight)
    pageResized();

  window.setTimeout(checkHeight.bind(undefined, document.body.clientHeight), 800);
}
/*
function addTagLinks(avatar)
{
  var tags=getTags();

  var postTable=avatar.parentNode;
  while(postTable.tagName != 'TABLE')
    postTable=postTable.parentNode;
  if(postTable.getAttribute('id') == 'preview_wrap_0')
    return;
  var username=postTable.getElementsByTagName('strong')[0].textContent;

  var id=postTable.getAttribute('id').split('post')[1];

  var a=document.createElement('a');
  a.setAttribute('class', 'tagLink');
  a.setAttribute('postId', id);
  var place = avatar.getBoundingClientRect();
  var style='position: absolute; z-index: 50000000; top: '+(place.top+window.scrollY)+'px; left: '+(place.left+window.scrollX)+'px; width: '+avatar.clientWidth+'px;';
  style+='text-align: center; color: blue; background: rgba(200,200,200,0.8); border-radius: 0px 0px 10px 10px;';
  a.setAttribute('style', style);

  a.innerHTML = 'Show user tags';
  a.href='javascript:void(0);';
  a.addEventListener('click', openTags.bind(undefined, username, postTable), false);
  document.body.appendChild(a);
  a.style.display='none';

  avatar.addEventListener('mouseover', mouseOver.bind(undefined, a), false);
  avatar.addEventListener('mouseout', mouseOut.bind(undefined, avatar, a), false);
}
*/
function pageResized()
{
  /*var tagLinks=document.getElementsByClassName('tagLink');
  for(var i=0; i<tagLinks.length; i++)
  {
    var t=tagLinks[i];
    var id=t.getAttribute('postId');
    var postTable=document.getElementById('post'+id);
    var avatar=postTable.getElementsByClassName('avatar')[0];

    var place = avatar.getBoundingClientRect();
    var style='position: absolute; z-index: 50000000; top: '+(place.top+window.scrollY)+'px; left: '+(place.left+window.scrollX)+'px; width: '+avatar.clientWidth+'px;';
    style+='text-align: center; color: blue; background: rgba(200,200,200,0.8); border-radius: 0px 0px 10px 10px;';
    t.setAttribute('style', style);
    t.style.display='none';
  }*/

  resetTags();
  addTags();
}

function resetTags()
{
  var posts=document.getElementsByClassName('forum_post');
  for(var i=0; i<posts.length-1; i++)
  {
    var p=posts[i];
    var avatar=p.getElementsByClassName('avatar')[0];

    var postTable=p;

    if(postTable.getAttribute('id') == 'preview_wrap_0')
      continue;
    var u=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    var username=u.textContent;

    if(avatar)
    {
      var img=avatar.getElementsByTagName('img')[0];
      if(img)
      {
        img.src=img.getAttribute('originalAvatar');
      }
    }
    u.setAttribute('style', '');
    postTable.setAttribute('style', '');
    var id=postTable.getAttribute('id').split('post')[1];
    var tag=document.getElementById('tag'+id);
    if(tag)
      tag.parentNode.removeChild(tag);
  }
  var hardIgnores=document.getElementsByClassName('hardIgnoreLink');
  for(var i=0; i<hardIgnores.length; i++)
  {
    var h=hardIgnores[i];
    h.parentNode.removeChild(h);
  }
}

function addTags()
{
  var posts=document.getElementsByClassName('forum_post');
  for(var i=0; i<posts.length-1; i++)
  {
    var p=posts[i];
    var avatar=p.getElementsByClassName('avatar')[0];

    var postTable=p;

    if(postTable.getAttribute('id') == 'preview_wrap_0')
      continue;
    var u=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    var username=u.textContent;

    var user=getUser(username)[0];
    if(user.replacementAvatar && avatar)
    {
      avatar.getElementsByTagName('img')[0].src=user.replacementAvatar;
    }
    if(user.usernameColour)
    {
      var style=u.getAttribute('style');
      if(!style)
        style='';
      u.setAttribute('style', style+' color: '+user.usernameColour+';');
    }
    if(user.postHighlight)
    {
      var style=postTable.getAttribute('style');
      postTable.setAttribute('style', 'box-shadow: '+user.postHighlight+' 0 0 5px 1px !important;');
    }
    if(user.tag && user.showTag)
    {
      var div=document.createElement('div');
      var id=postTable.getAttribute('id').split('post')[1];
      div.setAttribute('id', 'tag'+id);
      div.innerHTML = user.tag.replace(/\n/g,'<br />');
      var first;
      if(!avatar)
      {
        avatar=postTable;
        first=avatar;
      }
      else
        first=avatar.firstElementChild;
      var place = postTable.getBoundingClientRect();
      var width=300;
      var left=place.left+window.scrollX-width-20;
      if(left<0)
        left=0;
      var style='position: absolute; z-index: 50000000; top: '+(place.top+window.scrollY)+'px; left: '+left+'px; max-width: '+width+'px; text-align: center; color: white; background: rgba(20,20,20,0.7); border-radius: 20px 0px 0px 20px;';
      style+='font-size: large; box-shadow: inset '+(user.postHighlight ? user.postHighlight : 'black')+' 0 0 20px 0; padding: 10px;';
      div.setAttribute('style', style);
      document.body.appendChild(div);
      var avatarHeight=first.clientHeight;
      var top=place.top+window.scrollY+((avatarHeight-div.clientHeight)/2);
      div.style.top=top+'px';
      if(div.clientWidth < width)
      {
        left=place.left+window.scrollX-div.clientWidth;
        div.style.left=left+'px';
      }
    }
    if(user.softIgnore)
    {
      postTable.getElementsByTagName('tr')[1].style.display='none';
    }
    if(user.hardIgnore)
    {
      var a=document.createElement('a');
      var hr=document.createElement('hr');
      hr.setAttribute('title', username);
      a.appendChild(hr);
      a.setAttribute('class', 'hardIgnoreLink');
      a.href=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].href;
      postTable.parentNode.insertBefore(a, postTable);
      postTable.style.display='none';
    }
  }
}

function openTags(username, postTable)
{
  var div=document.getElementById('chameleonTagsDiv');
  if(!div)
  {
    div=document.createElement('div');
    div.setAttribute('id', 'chameleonTagsDiv');
    document.body.appendChild(div);
    div.setAttribute('style', 'position: fixed; top: 20px; margin: auto; left: 0; right: 0; text-align: center; background: rgba(0,0,0,0.7); color: white; width: 80%;');
  }
  div.innerHTML = '<h2>'+username+'\'s Tags<br />';

  var user=getUser(username)[0];

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Replacement avatar URL';
  input.value = user.replacementAvatar ? user.replacementAvatar : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Post highlight colour';
  input.value = user.postHighlight ? user.postHighlight : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Username colour';
  input.value = user.usernameColour ? user.usernameColour : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('textarea');
  input.setAttribute('id', 'tagTextarea');
  div.appendChild(input);
  input.setAttribute('style', 'text-align: center; border: none;');
  input.placeholder='Tag';
  input.value = user.tag ? user.tag : '';
  resize('tagTextarea');
  input.addEventListener('keyup', resize.bind(undefined, 'tagTextarea'), false);
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Show tag: '+(user.showTag ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Soft ignore: '+(user.softIgnore ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Hard ignore: '+(user.hardIgnore ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Save';
  a.href='javascript:void(0);';
  a.addEventListener('click', saveAndClose.bind(undefined, div, username, postTable), false);
}

function changeTags(div, username, table, a)
{
  var user=getUser(username);
  var index=user[1];
  user=user[0];

  var inputs=div.getElementsByTagName('input');
  user.replacementAvatar = inputs[0].value;
  user.postHighlight = inputs[1].value;
  user.usernameColour = inputs[2].value;

  var textareas=div.getElementsByTagName('textarea');
  user.tag=textareas[0].value;

  var as=div.getElementsByTagName('a');
  if(as[0] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.showTag=false;
    else
      user.showTag=true;
  }
  if(as[1] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.softIgnore=false;
    else
      user.softIgnore=true;
  }
  if(as[2] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.hardIgnore=false;
    else
      user.hardIgnore=true;
  }

  var tags=getTags();
  if(index != -1)
    tags[index]=user;
  else
  {
    user.username=username;
    tags.push(user);
  }
  window.localStorage.userTags = JSON.stringify(tags);

  openTags(username, table);
}

function saveAndClose(div, username, table)
{
  resetTags();
  addTags();
  div.parentNode.removeChild(div);
}

/*
function mouseOver(a)
{
  a.style.display = 'initial';
}

function mouseOut(avatar, a, event)
{
  if(event.relatedTarget == avatar || event.relatedTarget == a)
    return;
  a.style.display = 'none';
}*/

function getUser(username)
{
  var tags=getTags();
  for(var i=0; i<tags.length; i++)
  {
    var t=tags[i];
    if(t.username === username)
      return [t, i];
  }
  return [{}, -1];
}

function getTags()
{
  var tags = window.localStorage.userTags;
  if(!tags)
  {
    tags = [];
  }
  else
    tags = JSON.parse(tags);
  return tags;  
}