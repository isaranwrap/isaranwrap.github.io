document.addEventListener('DOMContentLoaded', function () {
		  var circleCursor = document.createElement('div');
		  circleCursor.className = 'circle-cursor';
		  document.body.appendChild(circleCursor);
		
		  document.addEventListener('mousemove', function (e) {
			circleCursor.style.left = e.clientX + 'px';
			circleCursor.style.top = e.clientY + 'px';
			circleCursor.style.display = 'block';
			// document.removeEventListener('mousemove', this);
		  });
		});