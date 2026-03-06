// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'Toggle Light Mode' : 'Toggle Dark Mode';
});

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Fade-in animations on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Lightbox for projects
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const projects = document.querySelectorAll('.project');
let currentIndex = 0;

projects.forEach((project, index) => {
    project.addEventListener('click', () => {
        currentIndex = index;
        showLightbox(project.dataset.image);
    });
});

function showLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}

document.querySelector('.close').addEventListener('click', () => {
    lightbox.style.display = 'none';
});

document.querySelector('.prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    showLightbox(projects[currentIndex].dataset.image);
});

document.querySelector('.next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % projects.length;
    showLightbox(projects[currentIndex].dataset.image);
});

// Comment system
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments')) || [];
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `<strong>${comment.name}:</strong> ${comment.text}`;
        commentsList.appendChild(div);
    });
}

commentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('commentName').value.trim();
    const text = document.getElementById('commentText').value.trim();
    if (name && text) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ name, text });
        localStorage.setItem('comments', JSON.stringify(comments));
        loadComments();
        this.reset();
    }
});

loadComments();