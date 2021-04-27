// Select the button

const btn = document.querySelectorAll('.btn');

for(let i = 0; i < btn.length; i++) {
    btn[i].addEventListener('click', function(e) {
        btn[i].classList.toggle('button-clicked');
        btn[i].firstElementChild.classList.toggle('icon-clicked');
    })
    btn[i].addEventListener('mouseover', function(e) {
        btn[i].classList.toggle('button-hover');
    })
    btn[i].addEventListener('mouseover', function(e) {
        btn[i].classList.add('button-hover');
    })
    btn[i].addEventListener('mouseout', function(e) {
        btn[i].classList.remove('button-hover');
    })
}


// for (var i = 1; i < 100; i++){
// rating.innerHTML += "<div class='block'></div>";
// block[i].style.transform = "rotate("+ 3.6 * i + "deg)";
// block[i].style.animationDelay = `${i/40}s`; 

// block[i].style.color = "green";
// }

function toggleActive() {
    const block = document.querySelector('.card .rating .block');
    block.classList.toggle('active');
}

// const button = document.querySelector('.btn'); // Select the button element

// button.addEventListener('click', function() {
//     // Code to execute when the button is clicked
//     console.log("Button Clicked!"); // Example action (replace with your desired action)
//     alert("Welcome to Chess Lessons!");
// });

// const blocks = document.querySelectorAll('.block');

// button.addEventListener('click', function() {
//   for (const block of blocks) {
//     block.style.backgroundColor = 'green'; // Change color to green
//   }
// });

// Attempt 5: (keep as backup)
// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';
//   let angle = 0;
//   const angleIncrement = 360 / blocks.length;

//   for (let i = 0; i < blocks.length; i++) {
//     blocks[i].style.backgroundColor = color;
//     blocks[i].style.transform = `rotate(${angle}deg)`;
//     angle += angleIncrement;
//     block[i].style.animationDelay = `${i/40}s`; 
//   }
// });



// Attempt 6: 
// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const direction = isGreen ? 'to right' : 'to left';

//   blocks.forEach((block, index) => {
//     block.style.removeProperty('transition');
//     block.style.background = `linear-gradient(${direction}, green, transparent ${index / blocks.length * 100}%)`;
//   });
// });


// Attempt 7: Adding delay -- BEST SO FAR

// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';
//   let delay = 0;
//   const delayIncrement = 40; // Adjust delay as needed

//   blocks.forEach((block, index) => {
//     setTimeout(() => {
//       block.style.backgroundColor = color;
//     }, delay);
//     delay += delayIncrement;
//   });
// });

// Attempt 8: We're getting somewhere
// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Reset all blocks to black before starting the process
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//   });

//   let delay = 0;
//   const delayIncrement = 100; // Adjust delay as needed

//   blocks.forEach((block, index) => {
//     setTimeout(() => {
//       block.style.backgroundColor = color;
//     }, delay);
//     delay += delayIncrement;
//   });
// });


// // JavaScript
// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;
// let animationFrameId;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Reset all blocks to black
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//   });

//   const totalDuration = 5000; // Total animation duration in milliseconds
//   const numBlocks = blocks.length;
//   let elapsedTime = 0;
//   const frameDuration = 1000 / 60; // Target 60 frames per second

//   const animate = () => {
//     const progress = elapsedTime / totalDuration;
//     const greenIndex = Math.floor(progress * numBlocks);

//     blocks.forEach((block, index) => {
//       block.style.backgroundColor = index <= greenIndex ? color : 'black';
//     });

//     elapsedTime += frameDuration;

//     if (elapsedTime < totalDuration) {
//       animationFrameId = requestAnimationFrame(animate);
//     } else {
//       cancelAnimationFrame(animationFrameId);
//     }
//   };

//   animate();
// });


// Old code: 
// // JavaScript
// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;
// let animationFrameId;

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Reset all blocks to black
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//   });

//   const totalDuration = 5000; // Total animation duration in milliseconds
//   const numBlocks = blocks.length;
//   let elapsedTime = 0;
//   const frameDuration = 1000 / 60; // Target 60 frames per second

//   const animate = () => {
//     const progress = elapsedTime / totalDuration;
//     const greenIndex = Math.floor(progress * numBlocks);

//     blocks.forEach((block, index) => {
//       block.style.backgroundColor = index <= greenIndex ? color : 'black';
//     });

//     elapsedTime += frameDuration;

//     if (elapsedTime < totalDuration) {
//       animationFrameId = requestAnimationFrame(animate);
//     } else {
//       cancelAnimationFrame(animationFrameId);
//     }
//   };

//   animate();
// });


// 2024-08-12

// // Select the button

// const btn = document.querySelectorAll('.btn');

// for(let i = 0; i < btn.length; i++) {
//     btn[i].addEventListener('click', function(e) {
//         btn[i].classList.toggle('button-clicked');
//         btn[i].firstElementChild.classList.toggle('icon-clicked');
//     })
//     btn[i].addEventListener('mouseover', function(e) {
//         btn[i].classList.toggle('button-hover');
//     })
//     btn[i].addEventListener('mouseover', function(e) {
//         btn[i].classList.add('button-hover');
//     })
//     btn[i].addEventListener('mouseout', function(e) {
//         btn[i].classList.remove('button-hover');
//     })
// }

// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;
// let timeouts = []; // Array to store timeouts

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Clear existing timeouts
//   timeouts.forEach(clearTimeout);
//   timeouts = [];

//   // Reset all blocks to black
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//   });

//   const totalDuration = 500; // Total animation duration in milliseconds
//   const delayIncrement = totalDuration / blocks.length;

//   blocks.forEach((block, index) => {
//     const timeout = setTimeout(() => {
//       block.style.backgroundColor = color;
//     }, delayIncrement * index);
//     timeouts.push(timeout); // Store timeout for clearing
//   });
// });

// // Select the progress wheel button
// const progressButton = document.querySelector('.btn'); // Assuming different button

// // Select the progress wheel blocks
// const blocks = document.querySelectorAll('.block');

// let isGreen = false;
// let timeouts = []; // Array to store timeouts

// // Event listener for progress wheel button click
// progressButton.addEventListener('click', () => {
//   if (!progressButton.classList.contains('disabled')) { // Check for disabled class
//     isGreen = !isGreen;
//     const color = isGreen ? 'green' : 'black';

//     // Only change color if not already all green
//     if (!allSpokesGreen()) {
//         console.log("checking..");
//       // Clear existing timeouts
//       timeouts.forEach(clearTimeout);
//       timeouts = [];

//       // Reset all blocks to black
//       blocks.forEach(block => {
//         block.style.backgroundColor = 'black';
//       });

//       const totalDuration = 2000; // Total animation duration in milliseconds
//       const delayIncrement = totalDuration / blocks.length;

//       blocks.forEach((block, index) => {
//         const timeout = setTimeout(() => {
//           block.style.backgroundColor = color;
//         }, delayIncrement * index);
//         timeouts.push(timeout); // Store timeout for clearing
//       });
//     } else {
//       // All blocks are green, handle this case (optional)
//       console.log("All spokes are GREEN!"); // Replace with your desired logic
//       console.log("Let's see how we get you out of HERE");
//     //   progressButton.classList.add('disabled'); // Optional: Disable button
//     }
//   }
// });

// function allSpokesGreen() {
//   return Array.from(blocks).every(block => block.style.backgroundColor === 'green');
// }

// // OK - let's see where/how we add this: document.location.href = "html/landingPage.html";

// function checkAllGreen() {
//     if (allSpokesGreen()) {
//         console.log("this isn't logging!"); // Replace with your desired logic
//         console.log("but checkAllGreen is being called... right?");
//         // document.location.href = "html/landingPage.html";
//         window.location.href = "html/landingPage.html";
//     }
//   }


// Best solution thusfar:

// 2024-08-12

//

// (copy from here)
// Select the buttons using a more specific selector (if possible)
// const buttons = document.querySelectorAll('.btn'); // Assuming single class

// // Event listener for button click (combined and improved)
// buttons.forEach(button => {
//   button.addEventListener('click', (event) => {
//     if (!button.classList.contains('disabled')) { // Check for disabled class
//       button.classList.toggle('button-clicked');
//       const icon = button.querySelector('.icon-clicked'); // Assuming icon within button
//       if (icon) icon.classList.toggle('icon-clicked');
//     }
//   });
// });

// // Event listeners for button hover (combined and improved)
// buttons.forEach(button => {
//   button.addEventListener('mouseenter', () => { // Use mouseenter for hover
//     button.classList.add('button-hover');
//   });
//   button.addEventListener('mouseleave', () => {
//     button.classList.remove('button-hover');
//   });
// });

// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;
// let timeouts = []; // Array to store timeouts

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Clear existing timeouts
//   timeouts.forEach(clearTimeout);
//   timeouts = [];

//   // Reset all blocks to black
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//   });

//   const totalDuration = 3000; // Total animation duration in milliseconds
//   const delayIncrement = totalDuration / blocks.length;

//   blocks.forEach((block, index) => {
//     const timeout = setTimeout(() => {
//       block.style.backgroundColor = color;
//       if (index === blocks.length - 1) {
//         checkAllGreen();
//       }
//     }, delayIncrement * index);
//     timeouts.push(timeout); // Store timeout for clearing
//   });
// });

// function checkAllGreen() {
//   if (Array.from(blocks).every(block => block.style.backgroundColor === 'green')) {
//     setTimeout(() => {
//       window.location.href = "html/landingPage.html";
//     }, 1500); // 2000 milliseconds = 2 seconds
//   }
// }

// (to here)


// Now, new working blocks (for better intended effects):

// const button = document.querySelector('.btn');
// const blocks = document.querySelectorAll('.block');
// let isGreen = false;
// let timeouts = []; // Array to store timeouts

// button.addEventListener('click', function() {
//   isGreen = !isGreen;
//   const color = isGreen ? 'green' : 'black';

//   // Clear existing timeouts
//   timeouts.forEach(clearTimeout);
//   timeouts = [];

//   // Reset all blocks to black
//   blocks.forEach(block => {
//     block.style.backgroundColor = 'black';
//     block.style.boxShadow = 'none';
//   });

//   const totalDuration = 3000; // Total animation duration in milliseconds
//   const delayIncrement = totalDuration / blocks.length;

//   blocks.forEach((block, index) => {
//     const timeout = setTimeout(() => {
//       block.style.backgroundColor = color;
//       block.classList.add('green-spoke');
//       if (index + 1 <= 101) { // Adjust the limit as needed
//         block.classList.add('initial-green');
//       }
//       if (index === blocks.length - 1) {
//         checkAllGreen();
//       }
//     }, delayIncrement * index);
//     timeouts.push(timeout); // Store timeout for clearing
//   });
// });