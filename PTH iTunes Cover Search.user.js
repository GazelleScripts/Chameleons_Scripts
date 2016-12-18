// ==UserScript==
// @name         PTH iTunes Cover Search
// @version      1.2
// @description  Search iTunes for cover art
// @author       Chameleon
// @include      http*://passtheheadphones.me/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('upload.php') != -1)
    showUpload();
  if(window.location.href.indexOf('torrents.php?action=editgroup&groupid=') != -1)
    showEdit();
  if(window.location.href.indexOf('torrents.php?id=') != -1)
    saveArtist();
})();

function saveArtist()
{
  var artist=document.getElementsByTagName('h2')[0].textContent.split(' - ')[0];
  window.localStorage.lastArtist=artist;
}

function showEdit()
{
  var before=document.getElementsByClassName('edit_form')[0].getElementsByTagName('br')[0];
  var image=before.previousElementSibling.getElementsByTagName('input')[0];
  var artist=window.localStorage.lastArtist;
  if(!artist)
    artist='';
  var album=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].innerHTML;
  var div=document.createElement('div');
  before.parentNode.insertBefore(div, before);

  var messageDiv=document.createElement('div');

  if(image.parentNode.innerHTML.indexOf('Auto-rehost') == -1)
  {
    var a=document.createElement('a');
    div.parentNode.insertBefore(a, div);
    div.parentNode.insertBefore(document.createTextNode(' '), a);
    a.href='javascript:void(0);';
    a.innerHTML = 'Auto-rehost: Off';
    a.addEventListener('click', toggleAutoRehost.bind(undefined, a, image, messageDiv), false);

    image.addEventListener('keyup', rehost.bind(undefined, image, messageDiv), false);

    if(window.localStorage.autoUpload == "true")
    {
      image.setAttribute('autorehost', 'true');
      a.innerHTML = 'Auto-rehost: On';
    }
  }

  var a=document.createElement('a');
  div.appendChild(a);
  div.appendChild(messageDiv);
  a.innerHTML='Get image from iTunes';
  a.href='javascript:void(0);';
  a.addEventListener('click', getAlbum.bind(undefined, artist, album, image, div, messageDiv), false);
}

function showUpload()
{
  var artist=document.getElementById('artist');
  var album=document.getElementById('title');
  var image=document.getElementById('image');
  var imageTd=image.parentNode;

  var messageDiv=document.createElement('div');
  imageTd.appendChild(messageDiv);

  var a=document.createElement('a');
  imageTd.appendChild(a);
  a.innerHTML='Get image from iTunes';
  a.href='javascript:void(0);';
  a.addEventListener('click', getUploadAlbum.bind(undefined, artist, album, image, imageTd, messageDiv), false);
}

function getUploadAlbum(a, al, im, td, messageDiv)
{
  getAlbum(a.value, al.value, im, td, messageDiv);
}

function getAlbum(artist, album, im, td, messageDiv)
{
  //console.log(im);

  /*var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://itunes.apple.com/search?"+encodeURIComponent(artist+' '+album));
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, gotAlbum.bind(undefined, im, td, messageDiv), getAlbum.bind(undefined, a, al, im, td, messageDiv));
  xhr.send();*/

  //console.log("https://itunes.apple.com/search?term="+encodeURIComponent(artist+' '+album));
  messageDiv.innerHTML = 'Searching for image on iTunes';
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://itunes.apple.com/search?term="+encodeURIComponent(artist+' '+album),
    onload: function(response) { if(response.status == 200) {gotAlbum(im, td, messageDiv, response.responseText); } else { messageDiv.innerHTML = 'iTunes error: '+response.status; } }
  });
}

function gotAlbum(input, td, messageDiv, response)
{
  var r=JSON.parse(response);
  if(r.results.length > 0)
  {
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    td.appendChild(a);
    var img=document.createElement('img');
    a.setAttribute('imageSize', 'large');
    a.addEventListener('click', changeSize.bind(undefined, a, img, input, r.results[0].artworkUrl60), false);
    a.appendChild(img);
    img.src=r.results[0].artworkUrl60.replace("60x60bb", "10000x10000-999");
    input.value = img.src;
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("keyup", false, true);
    input.dispatchEvent(evt);
  }
  else
    messageDiv.innerHTML = "no results";
}

function changeSize(a, img, input, url)
{
  if(a.getAttribute('imageSize') == 'large')
  {
    a.setAttribute('imageSize', 'small');
    url=url.replace("60x60bb", "600x600bb");
  }
  else
  {
    a.setAttribute('imageSize', 'large');
    url=url.replace("60x60bb", "10000x10000-999");
  }
  input.value=url;
  img.src=url;
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("keyup", false, true);
  input.dispatchEvent(evt);
}

function rehost(imageInput, span)
{
  if(imageInput.getAttribute('autorehost') != "true")
    return;
  var whitelisted = ["imgur.com", "ptpimg.me"];
  if(imageInput.value.length < 1)
    return;
  for(var i=0; i<whitelisted.length; i++)
  {
    var whitelist=whitelisted[i];
    if(imageInput.value.indexOf(whitelist) != -1)
      return;
  }

  if(imageInput.value.indexOf("discogs.com") != -1)
  {
    imageInput.value = "http://reho.st/"+imageInput.value;
  }

  span.innerHTML = 'Rehosting';
  var formData = new FormData();
  formData.append('image', imageInput.value);
  if(imageInput.getAttribute('working') == "true")
    return;
  imageInput.setAttribute('working', "true");
  window.setTimeout(unworking.bind(undefined, imageInput), 1000);

  var settings = getSettings();

  if(settings.site == 'imgur.com')
  {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.imgur.com/3/image');
    xhr.setRequestHeader('Authorization', 'Client-ID 735033a56fe790b');
    xhr.onreadystatechange = xhr_func.bind(undefined, span, xhr, rehosted.bind(undefined, imageInput, span), rehost.bind(undefined, imageInput, span));
    xhr.send(formData);
  }
  else if(settings.site == 'ptpimg.me')
  {    
    if(!settings.apiKey || settings.apiKey.length != 36)
    {
      span.innerHTML = 'No valid ptpimg.me API key set';
      return;
    }
    /*var formData = new FormData();
    formData.append('link-upload', image_input.value);
    formData.append('api_key', 'xx');
    // ptpimg.me doesn't have 'Access-Control-Allow-Origin' set
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://ptpimg.me/upload.php');
    xhr.onreadystatechange = xhr_func.bind(undefined, a, xhr, uploaded.bind(undefined, a, form, settings), doRehost.bind(undefined, a, image_input, form, settings));
    xhr.send(formData);*/
    // use GM_xmlhttpRequest for cross-domain
    GM_xmlhttpRequest({
      method: "POST",
      url: 'https://ptpimg.me/upload.php',
      data: "link-upload="+encodeURIComponent(imageInput.value)+'&api_key='+settings.apiKey,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) { rehosted(imageInput, span, response.responseText); }
    });
  }
}

function getSettings()
{
  var settings = window.localStorage.uploadFromUploadPageSettings;
  if(!settings)
  {
    settings = {site:'imgur.com', apiKey:window.localStorage.ptpimgAPIKey ? window.localStorage.ptpimgAPIKey : ''};
  }
  else
    settings = JSON.parse(settings);
  return settings;
}

function unworking(input)
{
  input.setAttribute('working', "false");
}

function rehosted(imageInput, span, response)
{
  var settings = getSettings();
  var newLink='';
  try
  {
    if(settings.site == 'imgur.com')
      newLink = JSON.parse(response).data.link.replace(/http:/, 'https:');
    else if(settings.site == 'ptpimg.me')
    {
      var r=JSON.parse(response)[0];
      newLink = "https://ptpimg.me/"+r.code+'.'+r.ext;
    }
  }
  catch(err)
  {
    span.innerHTML = err.message;
    return;
  }
  span.innerHTML = 'Rehosted';
  imageInput.value = newLink;
}

function toggleAutoRehost(a, input, span)
{
  if(a.innerHTML.indexOf('Off') != -1)
  {
    input.setAttribute('autorehost', 'true');
    a.innerHTML = 'Auto-rehost: On';
    window.localStorage.autoUpload = 'true';
    rehost(input, span);
  }
  else
  {
    input.setAttribute('autorehost', 'false');
    a.innerHTML = 'Auto-rehost: Off';
    window.localStorage.autoUpload = 'false';
  }
}

function xhr_func(messageDiv, xhr, func, repeatFunc)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
      func(xhr.responseText);
    else
    {
      messageDiv.innerHTML = 'Error: '+xhr.status+'<br />retrying in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}