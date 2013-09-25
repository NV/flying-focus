document.addEventListener('DOMContentLoaded', function(e) {
	if (document.getElementById('flying-focus')) return;

	/*> ../chrome/flying-focus.js */

	var style = document.createElement('style');
	style.textContent = "/*> ../chrome/flying-focus.css */";
	document.body.appendChild(style);
}, false);
