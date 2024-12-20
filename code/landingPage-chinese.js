// Select the buttons using a more specific selector (if possible)
const buttons = document.querySelectorAll('.btn'); // Assuming single class
const landingPage = "../html/chinese.html";


// Event listener for button click (combined and improved)
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    if (!button.classList.contains('disabled')) { // Check for disabled class
      button.classList.toggle('button-clicked');
      const icon = button.querySelector('.icon-clicked'); // Assuming icon within button
      const iconB = button.querySelector('.filter-blue'); // 1 sec here
      if (icon) icon.classList.toggle('icon-clicked');
    }
  });
});

// Event listeners for button hover (combined and improved)
buttons.forEach(button => {
  button.addEventListener('mouseenter', () => { // Use mouseenter for hover
    button.classList.add('button-hover');
  });
  button.addEventListener('mouseleave', () => {
    button.classList.remove('button-hover');
  });
});

const button = document.querySelector('.btn'); 
const blocks = document.querySelectorAll('.block');
let isGreen = false;
let timeouts = []; // Array to store timeouts

button.addEventListener('click', function() {
  isGreen = !isGreen;
  const color = isGreen ? 'green' : 'black';

  // Clear existing timeouts
  timeouts.forEach(clearTimeout);
  timeouts = [];

  // Reset all blocks to black
  blocks.forEach(block => {
    block.style.backgroundColor = 'black';
    block.style.boxShadow = 'none';
  });

  const totalDuration = 3000; // Total animation duration in milliseconds
  const delayIncrement = totalDuration / blocks.length;

  blocks.forEach((block, index) => {
    const timeout = setTimeout(() => {
      block.style.backgroundColor = color;
      if (color === 'green') {
        block.style.boxShadow = '0 0 15px green, 0 0 15px #0f0';
      } else {
        block.style.boxShadow = 'none'; // Ensure shadow is removed when turning black
      }
      if (index === blocks.length - 1) {
        checkAllGreen();
      }
    }, delayIncrement * index);
    timeouts.push(timeout); // Store timeout for clearing
  });
});


function checkAllGreen() {
  if (Array.from(blocks).every(block => block.style.backgroundColor === 'green')) {
    setTimeout(() => {
      window.location.href = landingPage; // This is the page we want to link towards
    }, 1500); // 2000 milliseconds = 2 seconds
  }
}

