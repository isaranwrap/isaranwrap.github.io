var fullImgBox = document.getElementById("fullContainer");
var fullImg = document.getElementById("fullImg");

function openImage(filePath) {
    fullImgBox.style.display = "flex";
    fullImg.src = filePath;
}

function closeFullScreen() {
    fullImgBox.style.display = "none";
}