
document.body.onkeydown = function(event) {
	// Screw Flying Focus:
	//event.stopPropagation();
};
document.getElementById('a').ondragstart = function(e) {
	e.dataTransfer.effectAllowed = 'move';
}

//SVGPolygonElement.prototype.addPoint = function(x, y) {
//	var point = this.ownerSVGElement.createSVGPoint();
//	point.x = x;
//	point.y = y;
//	this.points.appendItem(point);
//};

var polygon = document.getElementById('polygon');
var points = [];
for (var i = 0; i < polygon.points.numberOfItems; i++) {
	points.push(polygon.points.getItem(i));
}
var a1 = polygon.points.getItem(0);
var a2 = polygon.points.getItem(1);
//var a3 = polygon.points.getItem(2);
//var a4 = polygon.points.getItem(3);
var b1 = polygon.points.getItem(2);
var b2 = polygon.points.getItem(3);
//var b3 = polygon.points.getItem(5);
//var b4 = polygon.points.getItem(7);

function draggable(elem, opt) {
	opt || (opt = {});
	elem.addEventListener('mousedown', function(e) {
		var x = 0;
		var y = 0;
		var top = parseInt(elem.style.top || 0);
		var left = parseInt(elem.style.left || 0);
		var isFirst = true;

		function onMove(e) {
			if (isFirst) {
				isFirst = false;
				x = e.clientX;
				y = e.clientY;
				return;
			}
			var currentX = e.clientX;
			var currentY = e.clientY;
			var newTop = Math.max(0, top + (currentY - y));
			var newLeft = Math.max(0, left + (currentX - x));
			elem.style.top = newTop + 'px';
			elem.style.left = newLeft + 'px';
			e.preventDefault();

			opt.onMove && opt.onMove(e);
		}

		function onUp() {
			window.removeEventListener('mousemove', onMove, false);
			window.removeEventListener('mouseup', onUp, false);
		}

		window.addEventListener('mousemove', onMove, false);
		window.addEventListener('mouseup', onUp, false);
		e.preventDefault();
	}, false)
}


function connectCorners(ax, ay, aw, ah, bx, by, bw, bh, corners) {

	var ap = [
		{x: ax, y: ay + ah},
		{x: ax, y: ay},
		{x: ax + aw, y: ay},
		{x: ax + aw, y: ay + ah}
	];

	var bp = [
		{x: bx, y: by + bh},
		{x: bx, y: by},
		{x: bx + bw, y: by},
		{x: bx + bw, y: by + bh}
	];

	var all = ap.concat(bp);

	var p = corners[0];
	points[0].x = ap[p].x;
	points[0].y = ap[p].y;
	points[1].x = bp[p].x;
	points[1].y = bp[p].y;

	for (var i = 2; i < 6; i++) {

		var j = (i + 4) % 8;
		if (j === corners[1]) {
			return;
		}
		var point = points[i];
		point.x = all[j].x;
		point.y = all[j].y;
	}
}


function close(i, j, points) {
	// Counter clockwise
	a1.x = points.a[i].x;
	a1.y = points.a[i].y;
	a2.x = points.a[j].x;
	a2.y = points.a[j].y;	
	
	b2.x = points.b[i].x;
	b2.y = points.b[i].y;
	b1.x = points.b[j].x;
	b1.y = points.b[j].y;
}


function setPoints() {

}

function update() {
	var ax = parseInt(a.style.left);
	var ay = parseInt(a.style.top);
	var ax2 = ax + a.offsetWidth;
	var ay2 = ay + a.offsetHeight;

	var bx = parseInt(b.style.left);
	var by = parseInt(b.style.top);
	var bx2 = bx + b.offsetWidth;
	var by2 = by + b.offsetHeight;

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


draggable(document.getElementById('a'), {
	onMove: function(e) {
		update();
	}
});
draggable(document.getElementById('b'), {
	onMove: function(e) {
		update();
	}
});


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
update();
