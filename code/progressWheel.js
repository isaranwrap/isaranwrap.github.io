const rating = document.getElementsByClassName('rating')[0];
const block = document.getElementsByClassName('block');

for (var i = 1; i < 100; i++){
rating.innerHTML += "<div class='block'></div>";
block[i].style.transform = "rotate("+ 3.6 * i + "deg)";
block[i].style.animationDelay = `${i/120}s`; 
}