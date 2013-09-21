var flyingFocus = document.createElement('flying-focus'); // use uniq element name to decrease the chances of a conflict with website styles
flyingFocus.id = 'flying-focus';
document.body.appendChild(flyingFocus);

var DURATION = 100;
flyingFocus.style.transitionDuration = flyingFocus.style.WebkitTransitionDuration = DURATION / 1000 + 's';

function offsetOf(elem) {
	var rect = elem.getBoundingClientRect();
	var docElem = document.documentElement;
	var win = document.defaultView;
	var body = document.body;

	var clientTop  = docElem.clientTop  || body.clientTop  || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,
		scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
		scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
		top  = rect.top  + scrollTop  - clientTop,
		left = rect.left + scrollLeft - clientLeft;

	return {top: top, left: left};
}

var movingId = 0;
var prevFocused = null;
var isFirstFocus = true;

document.documentElement.addEventListener('focus', function(event) {
	var target = event.target;
	if (target.id === 'flying-focus') {
		return;
	}
	var offset = offsetOf(target);
	flyingFocus.style.left = offset.left + 'px';
	flyingFocus.style.top = offset.top + 'px';
	flyingFocus.style.width = target.offsetWidth + 'px';
	flyingFocus.style.height = target.offsetHeight + 'px';

	// Would be nice to use:
	//
	//   flyingFocus.style['outline-offset'] = getComputedStyle(target, null)['outline-offset']
	//
	// but it always '0px' in WebKit and Blink for some reason :(

	if (isFirstFocus) {
		isFirstFocus = false;
		return;
	}

	onEnd();
	target.classList.add('flying-focus_target');
	flyingFocus.classList.add('flying-focus_visible');
	prevFocused = target;
	movingId = setTimeout(onEnd, DURATION);
}, true);

document.documentElement.addEventListener('blur', function() {
	onEnd();
}, true);


function onEnd() {
	if (!movingId) {
		return;
	}
	clearTimeout(movingId);
	movingId = 0;
	flyingFocus.classList.remove('flying-focus_visible');
	prevFocused.classList.remove('flying-focus_target');
	prevFocused = null;
}
