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

// Circle cursor style (sometimes this is duplicated (read: unnecessary))
var styles = `
    .circle-cursor {
    position: fixed;
    width: 10px;
    height: 10px;
    /* background-color: #008ECE; */
    background-color: rgb(135, 206, 235);
    border-radius: 50%;
    pointer-events: auto;
    z-index: 9999;
    display: none;
}
`

var styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)