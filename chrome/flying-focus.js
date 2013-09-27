var SVGNS = "http://www.w3.org/2000/svg";
var flyingFocus = document.createElementNS(SVGNS, 'svg');
flyingFocus.id = 'flying-focus';

var polygon = document.createElementNS(SVGNS, 'polygon');
var points = [];
for (var i = 4; i > 0; i--) {
	var point = flyingFocus.createSVGPoint();
	points.push(point);
	polygon.points.appendItem(point);
}
flyingFocus.appendChild(polygon);
document.body.insertBefore(flyingFocus, document.body.firstChild);

function close(i, j, edges) {
	// clockwise
	points[0].x = edges.a[i].x;
	points[0].y = edges.a[i].y;
	points[1].x = edges.a[j].x;
	points[1].y = edges.a[j].y;

	points[3].x = edges.b[i].x;
	points[3].y = edges.b[i].y;
	points[2].x = edges.b[j].x;
	points[2].y = edges.b[j].y;
}


var DURATION = 500;
//flyingFocus.style.transitionDuration = flyingFocus.style.WebkitTransitionDuration = DURATION / 1000 + 's';


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




function update(ax, bx, ay, by, aw, bw, ah, bh) {
	var ax2 = ax + aw;
	var ay2 = ay + ah;
	var bx2 = bx + bw;
	var by2 = by + bh;

	var i = 0;
	var j = 0;

	//I'm sure there is a better way of doing it
	if (ax < bx) {
		if (ax2 < bx2) {
			i = ay < by ? 1 : 0;
			j = ay2 < by2 ? 3 : 2;
		} else {
			if (ay < by) {
				i = 2;
				j = 3;
			} else {
				i = 0;
				j = 1;
			}
		}
	} else {
		if (ax2 > bx2) {
			i = ay < by ? 0 : 1;
			j = ay2 < by2 ? 2 : 3;
		} else {
			if (ay < by) {
				if (ay2 < by2) {
					i = 0;
					j = 1;
				} else {
					i = 2;
					j = 3;
				}
			} else {
				i = 2;
				j = 3;
			}
		}
	}

	close(i, j, {
		a: [
			{x: ax,  y: ay},
			{x: ax2, y: ay},
			{x: ax2, y: ay2},
			{x: ax,  y: ay2}
		],
		b: [
			{x: bx,  y: by},
			{x: bx2, y: by},
			{x: bx2, y: by2},
			{x: bx,  y: by2}
		]
	});
}


document.documentElement.addEventListener('focus', function(event) {
	var target = event.target;
	if (target.id === 'flying-focus') {
		return;
	}
	var offset = offsetOf(target);

	var x = offset.left + target.offsetWidth / 2;
	var y = offset.top + target.offsetHeight / 2;
	var distance = euclideanDistance(centerX, x, centerY, y);

//	var duration = DURATION; //Math.pow(distance, 0.6) / 100; // px per second
//	flyingFocus.style.transitionDuration = flyingFocus.style.WebkitTransitionDuration = DURATION / 1000 + 's';
//	console.log(flyingFocus.style.transitionDuration);


//		var p = 0.7;
//		position(
//			blend(t, offset.top, p),
//			blend(l, offset.left, p),
//			blend(w, target.offsetWidth, p),
//			blend(h, target.offsetHeight, p)
//		);
//		doTransition(offset.top, offset.left, target.offsetWidth, target.offsetHeight);
	update(l, offset.left, t, offset.top, w, target.offsetWidth, h, target.offsetHeight);
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

//	target.style.zIndex = 999;
//	prevFocused && (prevFocused.style.zIndex = 999);

	prevFocused = target;

	requestAnimationFrame(function() {
		flyingFocus.classList.add('flying-focus_transition');
		requestAnimationFrame(function() {
			flyingFocus.classList.add('flying-focus_hiding');
			movingId = setTimeout(onEnd, DURATION);
		});
	});

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
	flyingFocus.classList.remove('flying-focus_transition');
	flyingFocus.classList.remove('flying-focus_hiding');
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
