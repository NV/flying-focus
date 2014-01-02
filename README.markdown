**Flying Focus**
 · [Focus Snail](//github.com/NV/focus-snail/)
 · [Focus Zoom](//github.com/NV/focus-zoom/)
 · [Focus Hug](//github.com/NV/focus-hug/)

# [Focus Transition](http://n12v.com/focus-transition/)

![Flying Focus icon](http://nv.github.io/flying-focus/chrome/icon_128.png)

Flying Focus is a UI concept. It adds a transition to the focus outline when you tab around inputs, buttons, and links.

## [flying-focus.js](http://n12v.com/focus-transition/flying-focus.js) standalone script

Includes all necessary CSS and has no external dependencies. Build with `rake standalone`.

## [Safari extension](http://n12v.com/focus-transition/FlyingFocus.safariextz)

Build with `rake safari`.

## [Chrome extension](https://chrome.google.com/webstore/detail/flying-focus/koojelgeljpacclbmiflpcohjkbklplk)

No build step required; just load it as an unpacked extension from `chrome/`.

## Related browser bugs

* [TAB focus navigation doesn't show focus rings for buttons](https://code.google.com/p/chromium/issues/detail?id=321937) in Chrome
* Impossible to change outline CSS property of some form elements [Chrome](https://code.google.com/p/chromium/issues/detail?id=323003) [WebKit](https://bugs.webkit.org/show_bug.cgi?id=124816)
* No way to hide focus outline in Firefox, none of the methods [mentioned on StackOverflow](http://stackoverflow.com/questions/71074/how-to-remove-firefoxs-dotted-outline-on-buttons-as-well-as-links) work

## [Who uses Flying Focus](https://github.com/NV/flying-focus/wiki/In-the-Wild)
