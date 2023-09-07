# Imports
import pyautogui

# Parameters

text = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Falling Snow</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="circle-container">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>
"""

# First click then write 
pyautogui.click(x=1415, y=228)
pyautogui.write(text, interval=0.01)and    <meta charset=

for i in range(10):
    print(pyautogui.position())
    

# Move to CSS

text = """
body {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #001f3f; /* dark navy blue */
    overflow: hidden;
}

.circle-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.circle {
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    animation: fall 3s infinite;
}

@keyframes fall {
    0% {
        top: -50px;
        opacity: 1;
    }
    100% {
        top: 100vh;
        opacity: 0;
    }
}

"""
pyautogui.click(x=1844, y=236)
pyautogui.write(text, interval=0.01)

text = """
document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle');

    circles.forEach((circle, index) => {
        circle.style.left = `${Math.random() * window.innerWidth}px`;
        circle.style.animationDelay = `${index * 0.5}s`;
    });
});

"""

pyautogui.click(x=2249, y=229)
pyautogui.write(text, interval=0.01)