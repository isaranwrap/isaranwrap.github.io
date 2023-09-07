let btn = document.querySelector('a');
btn.onmousemove = function(e) {
    let x = e.pageX - btn.offsetLeft;
    let y = e.pageY - btn.offsetTop;

    btn.style.setProperty('--x', x+'px');
    btn.style.setProperty('--y', y+'px');
    }

    
function getButtonTextEm() {
    var button = document.getElementById('btn');
    // var text = button.innerHTML;
    var text = "ishansaran65@gmail.com";
    alert(text)
}

function getButtonTextPh() {
    var button = document.getElementById('btn');
    // var text = button.innerHTML;
    var text = "+1 (702) 375-1516";
    alert(text)
}