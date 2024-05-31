// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = document.querySelectorAll('.gallery img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      const lightbox = document.createElement('div');
      lightbox.classList.add('lightbox');
      lightbox.innerHTML = `<img src="${src}" alt="Large View"><span class="close">&times;</span>`;
      
      document.body.appendChild(lightbox);
      
      lightbox.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(lightbox);
      });
    });
  });
});

