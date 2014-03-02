(function() {
	if (!window.addEventListener) {
		return;
	}

	/*> ../chrome/flying-focus.js */

	var style = doc.createElement('style');
	style.textContent = "/*> ../chrome/flying-focus.css */";
	body.appendChild(style);
})();
