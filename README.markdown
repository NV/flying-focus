# [Focus Transition](http://n12v.com/focus-transition/)

![Flying Focus icon](http://nv.github.io/flying-focus/chrome/icon_128.png)

Flying Focus is a UI concept.

# How to build

## A single-file library

Create a flying-focus.js that can be included to any web page.
It includes all necessary CSS and has no external dependencies.

    rake standalone

## Safari extension

    rake safari

## Chrome extension

No build step required. Just load it as an unpacked extension from `chrome/`.
