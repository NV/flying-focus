var flyingFocus = document.createElement('flying-focus'); // use uniq element name to decrease the chances of a conflict with website styles
flyingFocus.id = 'flying-focus';
document.body.appendChild(flyingFocus);

var SVGNS = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(SVGNS, 'svg');
svg.id = 'flying-focus-lines';
var line = document.createElementNS(SVGNS, 'line');
var line2 = document.createElementNS(SVGNS, 'line');
svg.appendChild(line);
svg.appendChild(line2);
document.body.appendChild(svg);
function linePosition(x1, x2, y1, y2, w1, w2, h1, h2) {
	var l2r = x1 < x2;
	var t2b = y1 < y2;

	var width = Math.abs(x1 - x2);
	var height = Math.abs(y1 - y2);
	var left = Math.max(x1, x2) - width;
	var top = Math.max(y1, y2) - height;

	var ld = 0;
	if (l2r) {
		ld = x2 -= x1;
		x1 = 0;
	} else {
		ld = x1 -= x2;
		x2 = 0;
	}

	if (t2b) {
		y2 -= y1;
		y1 = 0
	} else {
		y1 -= y2;
		y2 = 0;
	}


	if ((l2r && t2b) || (!l2r && !t2b)) {
		line.setAttribute('x1', x1);
		line.setAttribute('x2', x2);
		line.setAttribute('y1', y1 + h1);
		line.setAttribute('y2', y2 + h2);

		line2.setAttribute('x1', x1 + w1);
		line2.setAttribute('x2', x2 + w2);
		line2.setAttribute('y1', y1);
		line2.setAttribute('y2', y2);
	} else {
		line.setAttribute('x1', x1);
		line.setAttribute('x2', x2);
		line.setAttribute('y1', y1);
		line.setAttribute('y2', y2);

		line2.setAttribute('x1', x1 + w1);
		line2.setAttribute('x2', x2 + w2);
		line2.setAttribute('y1', y1 + h1);
		line2.setAttribute('y2', y2 + h2);
	}

	svg.style.left = left + 'px';
	svg.style.top = top + 'px';
	svg.width = width;
	svg.height = height;
//	x1 -= left;
//	x2 -= left;
//	y1 -= top;
//	y2 -= top;
//
//
//	line.setAttribute('x1', x1);
//	line.setAttribute('x2', x2);
//	line.setAttribute('y1', y1);
//	line.setAttribute('y2', y2);
}


var DURATION = 100;
//flyingFocus.style.transitionDuration = flyingFocus.style.WebkitTransitionDuration = DURATION / 1000 + 's';

function setTransitionDuration(distance) {

}

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
var keyDownTime = 0;

document.documentElement.addEventListener('keydown', function(event) {
	var code = event.which;
	// Show animation only upon Tab or Arrow keys press.
	if (code === 9 || (code > 36 && code < 41)) {
		keyDownTime = now();
	}
}, false);

var centerX = 0;
var centerY = 0;

var l = 0;
var t = 0;
var w = 0;
var h = 0;

document.documentElement.addEventListener('focus', function(event) {
	var target = event.target;
	if (target.id === 'flying-focus') {
		return;
	}
	var offset = offsetOf(target);

	var x = offset.left + target.offsetWidth / 2;
	var y = offset.top + target.offsetHeight / 2;
	var distance = euclideanDistance(centerX, x, centerY, y);

	var duration = 0.2; //Math.pow(distance, 0.6) / 100; // px per second
	flyingFocus.style.transitionDuration = flyingFocus.style.WebkitTransitionDuration = duration + 's';
	console.log(flyingFocus.style.transitionDuration);

//	if (distance > 64) {
		var p = 0.7;
		position(
			blend(t, offset.top, p),
			blend(l, offset.left, p),
			blend(w, target.offsetWidth, p),
			blend(h, target.offsetHeight, p)
		);
//		flyingFocus.style.left =  + 'px';
//		flyingFocus.style.top =  + 'px';
//		flyingFocus.style.width =  + 'px';
//		flyingFocus.style.height = + 'px';
		doTransition(offset.top, offset.left, target.offsetWidth, target.offsetHeight);
//	} else {
//		flyingFocus.style.left = offset.left + 'px';
//		flyingFocus.style.top = offset.top + 'px';
//		flyingFocus.style.width = target.offsetWidth + 'px';
//		flyingFocus.style.height = target.offsetHeight + 'px';
//	}
	linePosition(l, offset.left, t, offset.top, w, target.offsetWidth, h, target.offsetHeight);
	centerX = x;
	centerY = y;

	l = offset.left;
	t = offset.top;
	w = target.offsetWidth;
	h = target.offsetHeight;



//	setTransitionDuration(distance);


	// Would be nice to use:
	//
	//   flyingFocus.style['outline-offset'] = getComputedStyle(target, null)['outline-offset']
	//
	// but it always '0px' in WebKit and Blink for some reason :(

	if (isFirstFocus) {
		isFirstFocus = false;
		return;
	}

	if (now() - keyDownTime > 42) {
		return;
	}

	onEnd();
	target.classList.add('flying-focus_target');
	flyingFocus.classList.add('flying-focus_visible');
	svg.classList.add('flying-focus_visible');
	prevFocused = target;
	movingId = setTimeout(onEnd, duration * 1000);
}, true);






function position(t, l, w, h) {
	flyingFocus.style.transitionProperty = 'none';
	flyingFocus.style.top = t + 'px';
	flyingFocus.style.left = l + 'px';
	flyingFocus.style.width = w + 'px';
	flyingFocus.style.height = h + 'px';
}

function doTransition(t, l, w, h) {
	flyingFocus.style.removeProperty('transition-property');
	requestAnimationFrame(function() {
		flyingFocus.style.left = l + 'px';
		flyingFocus.style.top = t + 'px';
		flyingFocus.style.width = w + 'px';
		flyingFocus.style.height = h + 'px';
	});
}


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
	svg.classList.remove('flying-focus_visible');
	prevFocused.classList.remove('flying-focus_target');
	prevFocused = null;
}

function now() {
	return new Date().valueOf();
}

function euclideanDistance(x1, x2, y1, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function blend(a, b, x) {
	return a * (1 - x) + b * x;
}
